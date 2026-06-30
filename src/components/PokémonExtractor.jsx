import React, { useEffect, useState } from 'react'

export default function PokémonExtractor({ 
  screenshots, 
  battleGoal, 
  onExtracted, 
  onRecommendationReady,
  setError 
}) {
  const [progress, setProgress] = useState(0)
  const [analyzing, setAnalyzing] = useState(true)
  const [currentFile, setCurrentFile] = useState('')
  const [extractedData, setExtractedData] = useState([])

  useEffect(() => {
    analyzeScreenshots()
  }, [screenshots])

  const analyzeScreenshots = async () => {
    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
      if (!apiKey) {
        throw new Error('VITE_ANTHROPIC_API_KEY not set. Add it to .env.local')
      }

      const allPokémon = []
      const totalFiles = screenshots.length

      for (let i = 0; i < totalFiles; i++) {
        const file = screenshots[i]
        setCurrentFile(file.name)
        setProgress(Math.round((i / totalFiles) * 100))

        const base64 = await fileToBase64(file)
        
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
                    media_type: 'image/jpeg',
                    data: base64
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
      "chargedMove": "move name",
      "shiny": false,
      "lucky": false,
      "shadow": false
    }
  ]
}`
                }
              ]
            }]
          })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(`Claude API error: ${error.error?.message}`)
        }

        const data = await response.json()
        const content = data.content[0]?.text || ''
        
        try {
          const parsed = JSON.parse(content)
          if (parsed.pokémon && Array.isArray(parsed.pokémon)) {
            allPokémon.push(...parsed.pokémon)
          }
        } catch (e) {
          console.warn(`Failed to parse response for ${file.name}`)
        }
      }

      setExtractedData(allPokémon)
      setProgress(100)
      setAnalyzing(false)
      onExtracted(allPokémon)

      await generateRecommendations(allPokémon, battleGoal)

    } catch (err) {
      setError(err.message)
      setAnalyzing(false)
    }
  }

  const generateRecommendations = async (pokémon, goal) => {
    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 2048,
          messages: [{
            role: 'user',
            content: `You are a Pokémon GO expert. Given this player's Pokémon and their goal (${goal.name}), recommend the best team of 6.

Pokémon: ${JSON.stringify(pokémon)}

Return ONLY JSON:
{
  "team": [
    {"name": "Pokémon", "cp": 1234, "reason": "Why recommended"}
  ],
  "typeCoverage": ["type1"],
  "summary": "Brief strategy"
}`
          }]
        })
      })

      const data = await response.json()
      const content = data.content[0]?.text || ''
      
      const recommendation = JSON.parse(content)
      onRecommendationReady(recommendation)

    } catch (err) {
      console.error('Recommendation failed:', err)
      setError('Failed to generate recommendations. Try again.')
    }
  }

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">🤖 AI Analysis in Progress</h2>
        <p className="text-gray-400">Extracting Pokémon data using Claude Vision...</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-bold text-red-500">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-yellow-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {currentFile && (
        <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 mb-8">
          <p className="text-sm text-gray-400">Currently analyzing:</p>
          <p className="font-mono text-sm mt-1 truncate">{currentFile}</p>
        </div>
      )}

      {extractedData.length > 0 && (
        <div className="p-4 rounded-lg bg-green-900/30 border border-green-700 text-green-300">
          ✓ Extracted {extractedData.length} Pokémon so far...
        </div>
      )}

      {analyzing && (
        <div className="flex justify-center mt-8">
          <div className="space-y-4">
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-red-600 animate-bounce"
                  style={{
                    animationDelay: `${i * 0.15}s`
                  }}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">Analyzing your Pokémon...</p>
          </div>
        </div>
      )}
    </div>
  )
}
