import { NextResponse } from 'next/server';

export async function POST(req) {
  const { text, type } = await req.json();

  const prompt =
    type === 'summarize'
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

  const res = NextResponse.json({ result: message });

  // 👇 Add CORS headers to allow Chrome extension requests
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return res;
}

// Handle OPTIONS preflight requests
export async function OPTIONS() {
  const res = new Response(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}
