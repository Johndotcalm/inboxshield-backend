import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { text, type } = await req.json();

  const prompt = type === 'summarize'
    ? `Summarize this email in 1-2 sentences:\n\n${text}`
    : `Write a short, professional reply to this email:\n\n${text}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await response.json();
  const message = data.choices?.[0]?.message?.content || 'No response.';

  return new Response(JSON.stringify({ result: message }), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  });
}
