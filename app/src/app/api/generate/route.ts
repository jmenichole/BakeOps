import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, referenceImages } = await req.json();

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
    
    const body: any = {
      text_prompts: [
        {
          text: prompt,
          weight: 1,
        },
        {
          text: 'blurry, distorted, low quality, text, watermark, messy',
          weight: -1,
        }
      ],
      cfg_scale: 7,
      steps: 30,
      samples: 1,
    };

    if (referenceImages && Array.isArray(referenceImages) && referenceImages.length > 0) {
      endpoint = `${apiUrl}/generation/${engineId}/image-to-image`;
      // Use the first image as the reference
      body.init_image = referenceImages[0].data;
      body.image_strength = 0.35;
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
      return NextResponse.json({ error: 'Failed to generate image' }, { status: response.status });
    }

    const result = await response.json();
    const base64Image = result.artifacts[0].base64;
    const imageUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error('Generation API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
