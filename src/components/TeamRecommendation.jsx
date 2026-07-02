import React, { useState, useEffect } from 'react'

export default function TeamRecommendation({ recommendation, battleGoal }) {
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
  console.log('FULL recommendation object:', recommendation)
  console.log('recommendation.pokémon:', recommendation?.pokémon)
  console.log('recommendation keys:', Object.keys(recommendation || {}))
}, [recommendation])
  return (
  <div>
    {/* DEBUG */}
    <pre style={{ color: 'yellow', fontSize: '10px', position: 'fixed', top: 0, right: 0, maxWidth: '300px', maxHeight: '200px', overflow: 'auto', background: 'black', zIndex: 9999, padding: '10px' }}>
      {JSON.stringify(recommendation, null, 2)}
    </pre>
    {/* END DEBUG */}

    <h2>🎯 Your Team</h2>
    {/* rest of component... */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {recommendation.pokémon.map((poke, idx) => (
          <div key={poke.name} className="rounded-xl border border-gray-700 bg-gray-800 p-4">
            
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

      {recommendation.summary && (
        <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
          <h3 className="font-bold mb-3">Summary</h3>
          <p className="text-gray-300">{recommendation.summary}</p>
        </div>
      )}
    </div>
  )
}