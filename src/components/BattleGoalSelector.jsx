import React, { useState } from 'react'

const BATTLE_GOALS = [
  {
    id: 'great-league',
    name: 'Great League',
    icon: '⚔️',
    cpCap: 1500,
    description: 'Best for competitive PvP with CP cap',
    whatToUpload: 'Screenshot all Pokemon that are under 1500 CP',
    tips: [
      'Focus on Pokemon with good bulk (HP + Defense)',
      'Type variety matters more than raw stats',
      'Lower evolution stages often perform better here',
      'Check IVs - sometimes lower IVs are better for Great League!'
    ],
    searchShortcuts: [
      'cp1500 (find Pokemon near cap)',
      'great (shows Pokemon ranked for Great League)',
      '3* or 4* (high IV catches)',
      'type:water type:grass (by type)'
    ]
  },
  {
    id: 'ultra-league',
    name: 'Ultra League',
    icon: '🗡️',
    cpCap: 2500,
    description: 'Mid-tier competitive PvP',
    whatToUpload: 'Screenshot Pokemon between 1500-2500 CP',
    tips: [
      'More powerful Pokemon than Great League',
      'Evolved forms shine here (Charizard, Venusaur)',
      'Perfect IVs become more valuable',
      'Still need good coverage, not just raw power'
    ],
    searchShortcuts: [
      'cp2500',
      'ultra (shows Ultra League recommendations)',
      'evolved (only evolved forms)',
      '3* or 4*'
    ]
  },
  {
    id: 'master-league',
    name: 'Master League',
    icon: '👑',
    cpCap: null,
    description: 'No CP limit - bring your strongest!',
    whatToUpload: 'Screenshot your highest CP Pokemon (2500+ CP)',
    tips: [
      'Legendary Pokemon dominate this league',
      'Perfect IVs are essential (aim for 13+/14+/15)',
      'Mythical Pokemon are your secret weapons',
      'Coverage matters more than bulk'
    ],
    searchShortcuts: [
      'legendary (legendary Pokemon)',
      'mythical (mythical Pokemon)',
      '4* (perfect or near-perfect IV)',
      'cp3000 (show strongest Pokemon)'
    ]
  },
  {
    id: 'raids',
    name: 'Raid Attackers',
    icon: '💥',
    description: 'Best attackers for raid bosses',
    whatToUpload: 'Screenshot Pokemon with high Attack stats (all CP levels)',
    tips: [
      'Only attack stats matter (ignore Defense)',
      'Type matchup is CRITICAL - super effective wins raids',
      'High level Pokemon (40+) are best',
      'Power up your attackers for each raid type',
      'Focus on 2-3 of the same type for raids'
    ],
    searchShortcuts: [
      'legendary (raid-worthy legendaries)',
      'type:electric type:water type:fire (by type)',
      'attack (filter by attack stat)',
      '4*'
    ]
  },
  {
    id: 'shadow-raids',
    name: 'Shadow Raids',
    icon: '⚫',
    description: 'Optimized teams for Shadow raid bosses',
    whatToUpload: 'Screenshot Shadow Pokemon with good stats (20+ level)',
    tips: [
      'Shadow Pokemon deal 20% more damage',
      'Use these ONLY for raids, not PvP',
      'Prioritize Shadow Pokemon with strong fast moves',
      'Type coverage is even MORE important vs Shadows',
      'Shadow legendaries are raid gold'
    ],
    searchShortcuts: [
      'shadow (only Shadow Pokemon)',
      'shadow& legendary',
      'shadow& type:electric',
      'level40 (high level Shadows)'
    ]
  },
  {
    id: 'gym-defense',
    name: 'Gym Defense',
    icon: '🏰',
    description: 'Defensive team for holding gyms',
    whatToUpload: 'Screenshot your tankiest Pokemon (high CP & HP)',
    tips: [
      'Defense and HP are your priorities',
      'Slow-charge moves are better (forces shields)',
      'Type variety = attacker confusion',
      'Higher CP = stays in gym longer',
      'Bulky Pokemon like Blissey, Umbreon, Dragonite excel'
    ],
    searchShortcuts: [
      'defense (high Defense stats)',
      'cp3000 (highest CP defenders)',
      'legendary (legendary defenders)',
      'type:normal type:steel (bulky types)'
    ]
  },
  {
    id: 'transfer-advice',
    name: 'Transfer Advice',
    icon: '🗑️',
    description: 'What to keep, transfer, or evolve',
    whatToUpload: 'Screenshot all your recent catches or duplicates',
    tips: [
      'NEVER transfer: Shiny, Lucky, Shadow, Purified, Legendary',
      'Compare IVs - keep highest of each species',
      'Evolve only if you have a good moveset after evolution',
      'Save 100 IV Pokemon even if uncommon',
      'Transfer low IV duplicates to free up space'
    ],
    searchShortcuts: [
      '0* (0 IV - safe to transfer)',
      '1* or 2* (low IV - check before transfer)',
      'shiny (never transfer)',
      'lucky (lucky trades - keep)',
      'legendary (never transfer)'
    ]
  }
]

export default function BattleGoalSelector({ onSelect }) {
  const [expandedGoal, setExpandedGoal] = useState(null)

  return (
    <div>
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-3">🎯 What's your goal?</h2>
        <p className="text-gray-400 text-lg">
          Click any goal below to see detailed instructions and tips!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {BATTLE_GOALS.map((goal) => (
          <div key={goal.id} className="flex flex-col">
            <button
              onClick={() => {
                setExpandedGoal(expandedGoal === goal.id ? null : goal.id)
              }}
              className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition text-left border border-gray-700 hover:border-red-500 flex-1"
            >
              <div className="text-5xl mb-4">{goal.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{goal.name}</h3>
              {goal.cpCap && (
                <p className="text-yellow-500 font-bold mb-2">CP Cap: {goal.cpCap}</p>
              )}
              <p className="text-gray-400">{goal.description}</p>
              <p className="text-xs text-gray-500 mt-4">
                {expandedGoal === goal.id ? '▼ Hide details' : '▶ Click for details'}
              </p>
            </button>

            {expandedGoal === goal.id && (
              <div className="mt-2 p-4 rounded-xl bg-gray-900/80 border border-gray-700 text-sm space-y-4">
                <div>
                  <h4 className="font-bold text-blue-400 mb-2">📸 What to Upload:</h4>
                  <p className="text-gray-300">{goal.whatToUpload}</p>
                </div>

                <div>
                  <h4 className="font-bold text-green-400 mb-2">💡 Pro Tips:</h4>
                  <ul className="space-y-1 text-gray-300">
                    {goal.tips.map((tip, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-green-500">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-purple-400 mb-2">🔍 Search Shortcuts:</h4>
                  <div className="space-y-1">
                    {goal.searchShortcuts.map((shortcut, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded bg-gray-800/50 font-mono text-xs text-purple-300">
                        <span>➜</span>
                        {shortcut}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Use these in Pokemon GO's search!</p>
                </div>

                <button
                  onClick={() => {
                    onSelect(goal)
                    setExpandedGoal(null)
                  }}
                  className="w-full mt-2 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-bold transition"
                >
                  Upload for {goal.name} →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-xl bg-blue-900/20 border border-blue-700/50">
        <h3 className="font-bold text-blue-300 mb-3">📱 How to Take Good Screenshots:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <p className="font-bold text-white mb-1">✓ DO:</p>
            <ul className="space-y-1 text-gray-400">
              <li>• Pokemon summary screen</li>
              <li>• Stats & moveset visible</li>
              <li>• CP, HP, IVs clear</li>
              <li>• One Pokemon per screenshot</li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-white mb-1">✗ DON'T:</p>
            <ul className="space-y-1 text-gray-400">
              <li>• Blurry or partial views</li>
              <li>• Only the sprite</li>
              <li>• Multiple Pokemon</li>
              <li>• Filters or overlays</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}