import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { text, type } = await req.json();

  const prompt =
    type === 'summarize'
      ? `Summarize this email in 1-2 sentences:\n\n${text}`
      : `Write a short, professional reply to this email:\n\n${text}`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://inboxshield-backend.vercel.app', // your deployed backend URL
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);
      return NextResponse.json({ result: `Error: ${data.error?.message || 'Unknown issue'}` }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      });
    }

    const message = data.choices?.[0]?.message?.content || 'No response.';
    return NextResponse.json({ result: message }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });

  } catch (err) {
    console.error("Request failed:", err);
    return NextResponse.json({ result: 'Request failed: ' + err.message }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }
}
