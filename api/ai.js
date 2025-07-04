
export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Actual request logic
  const { text, type } = req.body;

  // Example response (you can replace this with your AI logic)
  res.status(200).json({
    result: `AI processed your ${type} request: "${text}"`
  });
}
