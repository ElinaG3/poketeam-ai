import React, { useState } from 'react'
import BattleGoalSelector from './components/BattleGoalSelector'
import ScreenshotUploader from './components/ScreenshotUploader'
import PokémonExtractor from './components/PokémonExtractor'
import TeamRecommendation from './components/TeamRecommendation'
import './styles/globals.css'
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  const [step, setStep] = useState('goal')
  const [battleGoal, setBattleGoal] = useState(null)
  const [screenshots, setScreenshots] = useState([])
  const [pokémonData, setPokémonData] = useState([])
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGoalSelect = (goal) => {
    setBattleGoal(goal)
    setStep('upload')
  }

  const handleScreenshotsSelected = (files) => {
    setScreenshots(files)
    setStep('analyzing')
  }

  const handlePokémonExtracted = async (data) => {
    setPokémonData(data)
  }

  const handleGoBack = () => {
    if (step === 'upload') {
      setStep('goal')
      setBattleGoal(null)
    } else if (step === 'analyzing') {
      setStep('upload')
      setScreenshots([])
      setPokémonData([])
    } else if (step === 'results') {
      setStep('goal')
      setBattleGoal(null)
      setScreenshots([])
      setPokémonData([])
      setRecommendation(null)
    }
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <header className="border-b border-gray-700 bg-black/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                🔴 PokéTeam AI
              </h1>
              <p className="text-gray-400 mt-2">AI-powered Pokémon GO team optimizer</p>
            </div>
            {step !== 'goal' && (
              <button
                onClick={handleGoBack}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-sm font-medium"
              >
                ← Back
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {step === 'goal' && (
          <BattleGoalSelector onSelect={handleGoalSelect} />
        )}

        {step === 'upload' && (
          <ScreenshotUploader 
            battleGoal={battleGoal}
            onScreenshotsSelected={handleScreenshotsSelected}
          />
        )}

        {step === 'analyzing' && (
          <PokémonExtractor 
            screenshots={screenshots}
            battleGoal={battleGoal}
            onExtracted={handlePokémonExtracted}
            onRecommendationReady={(rec) => {
              setRecommendation(rec)
              setStep('results')
            }}
            setError={setError}
          />
        )}

        {step === 'results' && recommendation && (
          <TeamRecommendation 
            recommendation={recommendation}
            pokémonData={pokémonData}
            battleGoal={battleGoal}
          />
        )}
      </main>

      <footer className="border-t border-gray-700 bg-black/50 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>Built with ❤️ by Elina • Powered by Claude Vision API</p>
        </div>
      </footer>
    </div>
    <Analytics />
    </>
  )
}
