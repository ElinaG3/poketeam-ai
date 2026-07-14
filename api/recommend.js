export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const { pokemon, goal } = req.body
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
        max_tokens: 1500,
        messages: [{
          role: 'user',
          
          content: `Here is my full Pokémon GO roster as JSON:
${JSON.stringify(pokemon)}

My battle goal: ${goal}

Select the BEST 6 Pokémon from this roster for that goal. Consider CP, typical type matchups and role coverage. Return ONLY JSON, no markdown, no explanation:
{
  "pokemon": [
    { "name": "...", "cp": 1234, "hp": 120, "decision": "KEEP", "reason": "Why this one made the top 6 for this goal" }
  ],
  "summary": "Overall team strategy for this goal"
}`
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`)
    }

    const data = await response.json()
    let content = data.content[0]?.text || ''
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return res.status(200).json(JSON.parse(content))
  } catch (error) {
    console.error('Recommend Error:', error)
    return res.status(500).json({ error: error.message })
  }
}