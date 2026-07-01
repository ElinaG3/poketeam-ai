export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
  const { imageBase64, mimeType } = req.body  // ← ADD mimeType here
  const apiKey = process.env.ANTHROPIC_API_KEY

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mimeType || 'image/jpeg',  // ← USE mimeType here
              data: imageBase64
            }
          },
            {
              type: 'text',
              text: `Extract Pokémon info from this screenshot. Return ONLY JSON:
{
  "pokémon": [
    {
      "name": "Pokémon name",
      "cp": 1234,
      "hp": 120,
      "types": ["type1"],
      "fastMove": "move name",
      "chargedMove": "move name"
    }
  ]
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
    const content = data.content[0]?.text || ''
    const parsed = JSON.parse(content)

    return res.status(200).json(parsed)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
