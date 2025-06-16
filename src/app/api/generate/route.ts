// src/app/api/generate/route.ts
import { NextResponse } from 'next/server';
import { generatePrompt } from '@/lib/openai';

export async function POST(req: Request) {
  // 🔄 DEV MOCK ENABLED
  if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
    const mock = {
      roles: [
        { title: 'AI Engineer', match: '90%' },
        { title: 'Data Scientist', match: '80%' },
        { title: 'ML Researcher', match: '75%' }
      ],
      strengths: ['Excellent Python & ML experience', 'Real-world AI projects'],
      weaknesses: ['Lacks leadership roles', 'Limited collaboration'],
      keywordMatch: ['TensorFlow', 'LangChain', 'GPT-3.5'],
      roleSummary: 'Highly suitable for AI engineering and GenAI prototyping.',
      finalScore: 88
    };
    return NextResponse.json(mock);
  }

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
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await completion.json();
    console.log('RAW OpenAI RESPONSE:', JSON.stringify(data, null, 2));

    if (data.error) {
      console.error('OpenAI API Error:', data.error);
      return NextResponse.json({ error: data.error.message || 'Unknown error from OpenAI' }, { status: 500 });
    }

    const content = data.choices?.[0]?.message?.content;

    if (!content || typeof content !== 'string') {
      console.error('No content received from OpenAI:', data);
      return NextResponse.json({ error: 'No valid content received from OpenAI.' }, { status: 500 });
    }
// src\app\api\generate\route.ts
    try {
      const parsed = JSON.parse(content);
      return NextResponse.json(parsed);
    } catch {
      console.error(' Failed to parse JSON from OpenAI response:', content);
      return NextResponse.json({ error: 'OpenAI returned invalid JSON.' }, { status: 500 });
    }
  } catch (err: unknown) {
    console.error(' OpenAI Error:', err);
    return NextResponse.json({ error: 'Failed to process resume' }, { status: 500 });
  }
}
