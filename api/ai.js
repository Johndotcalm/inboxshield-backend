export default async function handler(req, res) {
  const { text, type } = req.body;

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
        'HTTP-Referer': 'https://inboxshield-backend.vercel.app', // <-- Your domain
      },
      body: JSON.stringify({
        model: 'openrouter/openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || 'No response.';
    res.status(200).json({ result: message });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
