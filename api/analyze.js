export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
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
        model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
        max_tokens: 1024,
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
  text: `You are a Pokémon GO expert. Extract data AND provide strategic recommendations.

Data to extract:
{
  "pokémon": [{"name": "", "cp": 0, "hp": 0, "types": [], "fastMove": "", "chargedMove": ""}]
}

Then provide detailed analysis:
{
  "analysis": {
    "primaryTeam": [
      {
        "name": "Name",
        "cp": 1234,
        "reason": "Why chosen - type coverage, stats, etc",
        "actions": [
          "Power up to level 50 for Great League",
          "Change fast move to Thunder Shock for better DPS",
          "Keep charged move as is"
        ]
      }
    ],
    "alternativeTeam": [
      {
        "name": "Alternative Pokémon",
        "cp": 1200,
        "reason": "Why this is second choice"
      }
    ],
    "priorityActions": [
      "IMMEDIATE: Power up Raticat to max CP for Great League",
      "Evolve Hitmonlee if you have candy - better moveset after evolution",
      "Purify Shadow Pokémon if any - adds 20% damage boost",
      "Use TM to change moves if current ones are suboptimal"
    ],
    "summary": "Overall strategy and tips"
  }
}

Return ONLY valid JSON with both pokémon data AND analysis`
}
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

    // Strip markdown code blocks if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    const parsed = JSON.parse(content)

    return res.status(200).json(parsed)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}