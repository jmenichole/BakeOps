import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { trackServerEvent } from '@/lib/analytics-server';

interface StabilityBody {
  text_prompts: { text: string; weight: number }[];
  cfg_scale: number;
  steps: number;
  samples: number;
  height?: number;
  width?: number;
  init_image?: string;
  image_strength?: number;
  init_image_mode?: string;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const limited = rateLimit(`generate:${user.id}`, { maxRequests: 5, windowMs: 60_000 });
    if (limited) return limited;

    const { prompt, negative_prompt, referenceImages } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.AI_IMAGE_API_KEY;
    const apiUrl = process.env.AI_IMAGE_API_URL || 'https://api.stability.ai/v1';
    const engineId = process.env.AI_IMAGE_MODEL || 'stable-diffusion-xl-1024-v1-0';

    if (!apiKey) {
      console.error('AI_IMAGE_API_KEY is missing');
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }

    let endpoint = `${apiUrl}/generation/${engineId}/text-to-image`;
    
    const body: StabilityBody = {
      text_prompts: [
        {
          text: prompt,
          weight: 1,
        },
        {
          text: negative_prompt || 'blurry, distorted, low quality, text, watermark, messy',
          weight: -1,
        }
      ],
      cfg_scale: 7,
      steps: 30, // Could offer lower steps for faster drafts if needed
      samples: 1,
    };

    if (referenceImages && Array.isArray(referenceImages) && referenceImages.length > 0) {
      endpoint = `${apiUrl}/generation/${engineId}/image-to-image`;
      body.init_image = referenceImages[0].data;
      body.image_strength = 0.35; // Adjust this if we want more/less adherence
      body.init_image_mode = 'IMAGE_STRENGTH';
    } else {
      body.height = 1024;
      body.width = 1024;
    }

    const response = await fetch(
      endpoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Stability AI Error:', errorData);
      
      await trackServerEvent('ai_generation_error', {
        engineId,
        status: response.status,
        error: errorData
      });
      
      return NextResponse.json({ error: 'Failed to generate image' }, { status: response.status });
    }

    const result = await response.json();
    const base64Image = result.artifacts[0].base64;
    const imageUrl = `data:image/png;base64,${base64Image}`;

    // Server-side analytics tracking for successful generation
    await trackServerEvent('design_generated', {
      engineId,
      hasReferenceImages: referenceImages && referenceImages.length > 0,
      promptLength: prompt.length
    });

    return NextResponse.json({ imageUrl });
  } catch (error: unknown) {
    console.error('Generation API Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown generation error';
    
    await trackServerEvent('ai_generation_exception', {
      error: message
    });
    
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
