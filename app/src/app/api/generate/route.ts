import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { trackServerEvent } from '@/lib/analytics-server';

// Image generation provider configuration (set in Vercel environment variables):
//
//   Google Gemini (default):
//     AI_IMAGE_API_KEY  = your Google AI Studio API key (starts with AIza…)
//     AI_IMAGE_API_URL  = https://generativelanguage.googleapis.com/v1beta  (default)
//     AI_IMAGE_MODEL    = gemini-2.0-flash-preview-image-generation          (default)
//                         Use 'imagen-3.0-generate-002' for higher quality text-to-image
//                         (note: Imagen 3 does not support reference images)
//
//   Stability AI v1 (deprecated — legacy fallback):
//     AI_IMAGE_API_URL  = https://api.stability.ai/v1
//     AI_IMAGE_MODEL    = stable-diffusion-xl-1024-v1-0

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_DEFAULT_MODEL = 'gemini-2.0-flash-preview-image-generation';

interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

interface GeminiResponse {
  candidates?: Array<{
    content: { parts: GeminiPart[] };
  }>;
}

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

interface ReferenceImage {
  data: string;
  mimeType?: string;
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
    const apiUrl = process.env.AI_IMAGE_API_URL || GEMINI_BASE_URL;
    const modelId = process.env.AI_IMAGE_MODEL || GEMINI_DEFAULT_MODEL;

    if (!apiKey) {
      console.error('AI_IMAGE_API_KEY is missing');
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }

    // Validate reference images upfront (applies to all providers)
    let validatedRefImage: ReferenceImage | null = null;
    if (referenceImages && Array.isArray(referenceImages) && referenceImages.length > 0) {
      const refImage = referenceImages[0] as ReferenceImage;
      if (!refImage?.data || typeof refImage.data !== 'string' || refImage.data.trim() === '') {
        return NextResponse.json({ error: 'Invalid reference image data' }, { status: 400 });
      }
      // Verify it is valid base64 (standard or URL-safe alphabet)
      if (!/^[A-Za-z0-9+/\-_]+=*$/.test(refImage.data.replace(/\s/g, ''))) {
        return NextResponse.json({ error: 'Reference image is not valid base64' }, { status: 400 });
      }
      validatedRefImage = refImage;
    }

    let isGemini = false;
    try {
      const { hostname } = new URL(apiUrl);
      isGemini = hostname === 'generativelanguage.googleapis.com';
    } catch {
      // Invalid URL — fall through to Stability AI path
    }

    let imageUrl: string;
    if (isGemini) {
      imageUrl = await generateWithGemini({ apiKey, apiUrl, modelId, prompt, negative_prompt, referenceImage: validatedRefImage });
    } else {
      imageUrl = await generateWithStability({ apiKey, apiUrl, modelId, prompt, negative_prompt, referenceImage: validatedRefImage });
    }

    await trackServerEvent('design_generated', {
      modelId,
      hasReferenceImages: validatedRefImage !== null,
      promptLength: prompt.length,
    });

    return NextResponse.json({ imageUrl });
  } catch (error: unknown) {
    console.error('Generation API Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown generation error';
    await trackServerEvent('ai_generation_exception', { error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function generateWithGemini({
  apiKey, apiUrl, modelId, prompt, negative_prompt, referenceImage,
}: {
  apiKey: string;
  apiUrl: string;
  modelId: string;
  prompt: string;
  negative_prompt?: string;
  referenceImage: ReferenceImage | null;
}): Promise<string> {
  const parts: GeminiPart[] = [];

  // Combine prompt and negative prompt into a single instruction
  const fullPrompt = negative_prompt
    ? `${prompt}\n\nDo not include: ${negative_prompt}`
    : prompt;
  parts.push({ text: fullPrompt });

  // Attach reference image for image-conditional generation
  if (referenceImage) {
    const mimeType = referenceImage.mimeType || 'image/jpeg';
    parts.push({ inlineData: { mimeType, data: referenceImage.data } });
  }

  // Pass the API key via header to avoid it appearing in proxy/load-balancer logs
  const endpoint = `${apiUrl}/models/${modelId}:generateContent`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        responseModalities: ['IMAGE', 'TEXT'],
        temperature: 0.8,
      },
    }),
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') ?? '';
    let errorData: unknown;
    try {
      errorData = contentType.includes('application/json')
        ? await response.json()
        : await response.text();
    } catch {
      errorData = `HTTP ${response.status}`;
    }
    console.error('Gemini API error:', response.status, errorData);
    await trackServerEvent('ai_generation_error', { modelId, status: response.status, error: errorData });
    throw new Error('Image generation failed');
  }

  const result: GeminiResponse = await response.json();

  // Find the image part in the response
  const imagePart = result.candidates?.[0]?.content?.parts?.find(
    (p): p is GeminiPart & { inlineData: NonNullable<GeminiPart['inlineData']> } =>
      Boolean(p.inlineData?.data)
  );

  if (!imagePart?.inlineData?.data) {
    console.error('Gemini returned no image in response:', JSON.stringify(result));
    await trackServerEvent('ai_generation_error', { modelId, status: 200, error: 'No image in Gemini response' });
    throw new Error('Image generation is temporarily unavailable. Please try again later.');
  }

  return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
}

async function generateWithStability({
  apiKey, apiUrl, modelId, prompt, negative_prompt, referenceImage,
}: {
  apiKey: string;
  apiUrl: string;
  modelId: string;
  prompt: string;
  negative_prompt?: string;
  referenceImage: ReferenceImage | null;
}): Promise<string> {
  // Stability AI v1 (deprecated) — update AI_IMAGE_API_URL to migrate away
  // Stability AI image-to-image requires width/height to be multiples of 64
  // and within [589824, 1048576] total pixels.
  let endpoint = `${apiUrl}/generation/${modelId}/text-to-image`;
  const body: StabilityBody = {
    text_prompts: [
      { text: prompt, weight: 1 },
      { text: negative_prompt || 'blurry, distorted, low quality, text, watermark, messy', weight: -1 },
    ],
    cfg_scale: 7,
    steps: 30,
    samples: 1,
  };

  if (referenceImage) {
    endpoint = `${apiUrl}/generation/${modelId}/image-to-image`;
    body.init_image = referenceImage.data;
    body.image_strength = 0.35;
    body.init_image_mode = 'IMAGE_STRENGTH';
  } else {
    body.height = 1024;
    body.width = 1024;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') ?? '';
    let errorData: unknown;
    try {
      errorData = contentType.includes('application/json')
        ? await response.json()
        : await response.text();
    } catch {
      errorData = `HTTP ${response.status}`;
    }
    console.error('Stability AI error:', response.status, errorData);
    await trackServerEvent('ai_generation_error', { modelId, status: response.status, error: errorData });
    throw new Error('Image generation failed');
  }

  const result = await response.json();

  if (!Array.isArray(result.artifacts) || result.artifacts.length === 0 || !result.artifacts[0]?.base64) {
    console.error('Stability AI returned no image artifacts:', result);
    await trackServerEvent('ai_generation_error', { modelId, status: 200, error: 'No artifacts in response' });
    throw new Error('Image generation is temporarily unavailable. Please try again later.');
  }

  return `data:image/png;base64,${result.artifacts[0].base64}`;
}
