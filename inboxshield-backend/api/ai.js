import { NextResponse } from 'next/server';

export const config = {
  runtime: 'nodejs', // Ensure compatibility
};

export default async function handler(req) {
  const { text, type } = await req.json();

  const prompt =
    type === 'summarize'
      ? `Summarize this email in 1–2 sentences:\n\n${text}`
      : `Write a short, professional reply to this email:\n\n${text}`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://inboxshield-backend.vercel.app' // must match your public domain
    },
    body: JSON.stringify({
      model: 'openrouter/openai/gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();
  const message = data.choices?.[0]?.message?.content || 'No response.';

  return NextResponse.json(
    { result: message },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    }
  );
}