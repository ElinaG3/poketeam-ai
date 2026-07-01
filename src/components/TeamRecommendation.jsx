import React, { useState, useEffect } from 'react'

export default function TeamRecommendation({ recommendation, pokémonData, battleGoal }) {
  const [pokémonImages, setPokémonImages] = useState({})

  useEffect(() => {
    loadPokémonImages()
  }, [recommendation])

  const loadPokémonImages = async () => {
    const images = {}
    
    if (recommendation.team) {
      for (const poke of recommendation.team) {
        const pokeName = poke.name.toLowerCase().replace(/\s+/g, '-')
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/${pokeName}.png`
        images[poke.name] = imageUrl
      }
    }

    setPokémonImages(images)
  }

  const PokémonCard = ({ pokémon, index }) => (
    <div className="rounded-xl overflow-hidden border border-gray-700 hover:border-red-500 transition-all hover:shadow-lg hover:shadow-red-500/20 bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="aspect-square bg-gray-900 flex items-center justify-center overflow-hidden">
        <img
          src={pokémonImages[pokémon.name] || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/1.png'}
          alt={pokémon.name}
          className="w-full h-full object-contain p-2"
          onError={(e) => {
            e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/25.png'
          }}
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-lg">{pokémon.name}</h3>
            <p className="text-sm text-gray-400">CP: <span className="text-yellow-500">{pokémon.cp}</span></p>
          </div>
          <div className="text-2xl font-black text-red-500">#{index + 1}</div>
        </div>

        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Why This Pokémon:</p>
          <p className="text-sm text-gray-300 leading-tight">{pokémon.recommendation}</p>
        </div>

        {pokémon.actions && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Actions to Take:</p>
            <p className="text-sm text-yellow-400 leading-tight font-medium">{pokémon.actions}</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <div className="mb-12">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-2">
          🎯 Your Optimal Team
        </h2>
        <p className="text-gray-400">For {battleGoal.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {recommendation.team && recommendation.team.map((poke, idx) => (
          <PokémonCard key={poke.name} pokémon={poke} index={idx} />
        ))}
      </div>

      {recommendation.typeCoverage && (
        <div className="mb-8 p-6 rounded-xl bg-blue-900/30 border border-blue-700">
          <h3 className="font-bold mb-3 text-blue-300">Type Coverage</h3>
          <div className="flex flex-wrap gap-2">
            {recommendation.typeCoverage.map(type => (
              <span
                key={type}
                className="px-3 py-1 rounded-full bg-blue-600/50 text-blue-200 text-sm font-medium"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {recommendation.summary && (
        <div className="mb-8 p-6 rounded-xl bg-gray-800/50 border border-gray-700">
          <h3 className="font-bold mb-3">Strategy Summary</h3>
          <p className="text-gray-300 leading-relaxed">{recommendation.summary}</p>
        </div>
      )}
    </div>
  )
}
