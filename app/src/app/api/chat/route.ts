import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const CHAT_MODEL = 'gemini-2.0-flash';

const SYSTEM_PROMPT = `You are BakeBot, a friendly and enthusiastic cake design consultant for BakeOps — a platform for custom bakers.

Your job is to help bakers understand exactly what their customers want so you can build a precise AI image generation prompt.

Ask SHORT, focused questions ONE AT A TIME to gather these details (in roughly this order):
1. The occasion (birthday, wedding, anniversary, baby shower, etc.)
2. Color palette or theme colors
3. Key design elements, characters, or motifs
4. Style preference (modern/minimalist, rustic, whimsical, elegant, floral, etc.)
5. Any specific details: number of tiers, flavors, special toppers, or text on the cake

After 4-6 exchanges and you have enough information, generate a refined prompt and end your message EXACTLY like this:

✨ Here's your refined design prompt:
[PROMPT]

Where [PROMPT] is a single descriptive paragraph starting with "Professional bakery photography of a..." that captures all the details discussed. Make it vivid and detailed for best AI image results.

Keep all responses concise (2-3 sentences max). Be warm and encouraging. One question at a time.`;

interface GeminiMessage {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const limited = rateLimit(`chat:${user.id}`, { maxRequests: 30, windowMs: 60_000 });
    if (limited) return limited;

    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.AI_IMAGE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }

    const contents: GeminiMessage[] = [
      ...(Array.isArray(history) ? history : []),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await fetch(
      `${GEMINI_BASE_URL}/models/${CHAT_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini chat error:', response.status, errorText);
      return NextResponse.json({ error: 'Chat service unavailable' }, { status: 500 });
    }

    const result = await response.json();
    const reply: string | undefined = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    // Extract the refined prompt if the model has generated one
    const promptMatch = reply.match(/✨ Here's your refined design prompt:\n([\s\S]+)/);
    const refinedPrompt = promptMatch ? promptMatch[1].trim() : null;

    return NextResponse.json({ reply, refinedPrompt });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
