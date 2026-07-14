import React, { useState, useEffect } from 'react'

function PokemonSprite({ name }) {
  const [src, setSrc] = useState(null)

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase().trim()}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setSrc(d?.sprites?.other?.['official-artwork']?.front_default))
      .catch(() => {})
  }, [name])

  if (!src) return null
  return <img src={src} alt={name} className="w-24 h-24 mx-auto mb-2" />
}

export default function TeamRecommendation({ recommendation, battleGoal }) {
  const [expanded, setExpanded] = useState({})

  return (
    <div>
      <h2>🎯 Your Team</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {(recommendation?.pokemon || []).map((poke) => (
          <div key={poke.name} className="rounded-xl border border-gray-700 bg-gray-800 p-4">

            <PokemonSprite name={poke.name} />

            {/* Header */}
            <div className="flex justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">{poke.name}</h3>
                <p className="text-sm text-gray-400">CP: {poke.cp}</p>
              </div>
              <div className={`px-3 py-1 rounded font-bold text-sm ${
                poke.decision === 'KEEP'
                  ? 'bg-green-600/30 text-green-400'
                  : 'bg-red-600/30 text-red-400'
              }`}>
                {poke.decision}
              </div>
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setExpanded(p => ({ ...p, [poke.name]: !p[poke.name] }))}
              className="w-full py-2 px-3 rounded bg-red-600/20 border border-red-600/50 text-red-400 text-sm hover:bg-red-600/30"
            >
              {expanded[poke.name] ? '▼ Hide' : '▶ Details'}
            </button>

            {/* Details */}
            {expanded[poke.name] && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-xs text-gray-500 mb-1">Why:</p>
                <p className="text-sm text-gray-300 mb-3">{poke.reason}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {recommendation?.summary && (
        <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
          <h3 className="font-bold mb-3">Summary</h3>
          <p className="text-gray-300">{recommendation.summary}</p>
        </div>
      )}
    </div>
  )
}
