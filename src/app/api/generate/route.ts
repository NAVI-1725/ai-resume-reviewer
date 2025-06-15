// src/app/api/generate/route.ts
import { NextResponse } from 'next/server';
import { generatePrompt } from '@/lib/openai';

export async function POST(req: Request) {
  const { resume, role }: { resume: string; role?: string } = await req.json();

  const prompt = generatePrompt(resume, role);

  try {
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await completion.json();
    console.log('RAW OpenAI RESPONSE:', JSON.stringify(data, null, 2));

    const content = data.choices?.[0]?.message?.content;

    if (!content || typeof content !== 'string') {
      console.error(' No content received from OpenAI:', data);
      return NextResponse.json({ error: 'No valid content received from OpenAI.' }, { status: 500 });
    }
// src\app\api\generate\route.ts
    try {
      const parsed = JSON.parse(content);
      return NextResponse.json(parsed);
    } catch (err) {
      console.error(' Failed to parse JSON from OpenAI response:', content);
      return NextResponse.json({ error: 'OpenAI returned invalid JSON.' }, { status: 500 });
    }
  } catch (err) {
    console.error(' OpenAI Error:', err);
    return NextResponse.json({ error: 'Failed to process resume' }, { status: 500 });
  }
}
