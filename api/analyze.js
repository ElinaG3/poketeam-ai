// --- Rate limiter: max 10 analyses per IP per hour ---
const RATE_LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000;
const ipRequests = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = ipRequests.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    ipRequests.set(ip, { windowStart: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({
      error: 'Rate limit reached. Try again in an hour.',
    });
  }

  try {
    const { imageBase64, mimeType } = req.body
    const apiKey = process.env.ANTHROPIC_API_KEY

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType || 'image/jpeg',
                data: imageBase64
              }
            },
            {
              type: 'text',
              text: `Extract Pokemon from this screenshot. Return ONLY JSON - no markdown, no explanation:
{
  "pokemon": [
    {
      "name": "PokemonName",
      "cp": 1234,
      "hp": 120,
      "decision": "KEEP or TRANSFER",
      "reason": "Why keep or transfer"
    }
  ],
  "summary": "Overall advice"
}`
            }
          ]
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`)
    }

    const data = await response.json()
    let content = data.content[0]?.text || ''
    
    // Strip markdown
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    const parsed = JSON.parse(content)
    return res.status(200).json(parsed)
    
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: error.message })
  }
}