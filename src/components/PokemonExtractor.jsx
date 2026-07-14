import React, { useEffect, useState } from 'react'

export default function PokemonExtractor({ 
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
      const allPokemon = []
      const totalFiles = screenshots.length

      for (let i = 0; i < totalFiles; i++) {
        const file = screenshots[i]
        setCurrentFile(file.name)
        setProgress(Math.round((i / totalFiles) * 100))

        const { base64, mimeType } = await fileToBase64(file)

const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ imageBase64: base64, mimeType })
})

        if (!response.ok) {
          const error = await response.json()
          throw new Error(`API error: ${error.error}`)
        }

        const data = await response.json()
       if (data.pokemon && Array.isArray(data.pokemon)) {
  allPokemon.push(...data.pokemon)
}
      }

      setExtractedData(allPokemon)
      setProgress(100)
      setAnalyzing(false)
      onExtracted(allPokemon)

      await generateRecommendations(allPokemon, battleGoal)

    } catch (err) {
      setError(err.message)
      setAnalyzing(false)
    }
  }

  const generateRecommendations = async (pokemon, goal) => {
  try {
    const response = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pokemon, goal: goal.name })
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(`API error: ${error.error}`)
    }
    const recommendation = await response.json()
    onRecommendationReady(recommendation)
  } catch (err) {
    console.error('Recommendation failed:', err)
    setError('Failed to generate recommendations.')
  }
}

  const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result
      const base64 = result.split(',')[1]
      const mimeType = file.type || 'image/jpeg'
      resolve({ base64, mimeType })
    }
    reader.onerror = reject
  })
}
  

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">🤖 AI Analysis in Progress</h2>
        <p className="text-gray-400">Extracting Pokemon data using Claude Vision...</p>
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
          ✓ Extracted {extractedData.length} Pokemon so far...
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
            <p className="text-sm text-gray-500">Analyzing your Pokemon...</p>
          </div>
        </div>
      )}
    </div>
  )
}