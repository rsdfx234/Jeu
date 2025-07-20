'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { User, Riddle, UserProgress } from '@/types'

export default function RiddlePage() {
  const params = useParams()
  const router = useRouter()
  const riddleNumber = params.number as string
  
  const [user, setUser] = useState<User | null>(null)
  const [riddle, setRiddle] = useState<Riddle | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [unlockedHints, setUnlockedHints] = useState<string[]>([])

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      router.push('/')
      return
    }
    
    loadRiddleData(userId)
  }, [riddleNumber])

  const loadRiddleData = async (userId: string) => {
    try {
      const response = await fetch(`/api/riddle/${riddleNumber}?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setRiddle(data.riddle)
        setProgress(data.progress)
        
        // Parse unlocked hints
        if (data.progress?.unlockedHints) {
          setUnlockedHints(JSON.parse(data.progress.unlockedHints))
        }
      } else {
        const error = await response.json()
        setMessage(error.message)
      }
    } catch (error) {
      setMessage('Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer.trim() || !user) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/riddle/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          riddleNumber: parseInt(riddleNumber),
          answer: answer.trim().toLowerCase()
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        if (data.correct) {
          setMessage('🎉 Bravo ! Réponse correcte !')
          setTimeout(() => {
            if (data.nextRiddle) {
              router.push(`/riddle/${String(data.nextRiddle).padStart(3, '0')}`)
            } else {
              router.push('/finalists')
            }
          }, 2000)
        } else {
          setMessage('❌ Réponse incorrecte. Essayez encore !')
          setAnswer('')
        }
      } else {
        setMessage(data.message)
      }
    } catch (error) {
      setMessage('Erreur de connexion')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePurchaseHint = (hintType: 'bonus' | 'mega' | 'answer') => {
    if (!user || !riddle) return
    
    const amounts = {
      bonus: 100,
      mega: 200,
      answer: 500
    }
    
    const hintTypes = {
      bonus: 'Indice bonus',
      mega: 'Méga indice',
      answer: 'Bonne réponse'
    }

    const amount = amounts[hintType]
    const hintName = hintTypes[hintType]
    
    // Create payment request
    fetch('/api/payment/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        amount,
        paymentType: hintType === 'bonus' ? 'bonus_hint' : hintType === 'mega' ? 'mega_hint' : 'answer',
        riddleNumber: parseInt(riddleNumber)
      }),
    }).then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(`💰 ${hintName} (${amount} F CFA)\n\nPour obtenir votre ${hintName.toLowerCase()}, envoyez ${amount} F CFA via:\n• Orange Money ou Wave au 00223 70446750\n• Ensuite, envoyez la capture d'écran sur WhatsApp au même numéro\n\nVotre demande sera traitée rapidement !`)
      }
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">⏳ Chargement...</div>
      </div>
    )
  }

  if (!riddle || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4">❌ Énigme non trouvée</h1>
          <button 
            onClick={() => router.push('/')}
            className="bg-purple-600 px-6 py-3 rounded-lg"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-800/20 to-transparent rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-800/20 to-transparent rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {riddle.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-4"></div>
          <p className="text-gray-300">
            Bonjour {user.firstName} • Niveau {user.currentLevel}/7
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(user.currentLevel / 7) * 100}%` }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-2">
            Tu as validé {user.currentLevel - 1} énigmes sur 7
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-black/30 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-8 mb-8">
            {/* Riddle Text */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">🧩 Énigme</h2>
              <p className="text-lg text-gray-200 leading-relaxed bg-gray-800/50 p-6 rounded-lg">
                {riddle.text}
              </p>
            </div>

            {/* Free Hints */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 text-green-400">💡 Indices gratuits</h3>
              <div className="space-y-3">
                <div className="bg-green-900/30 p-4 rounded-lg border border-green-500/30">
                  <p className="text-green-200">🔸 {riddle.freeHint1}</p>
                </div>
                <div className="bg-green-900/30 p-4 rounded-lg border border-green-500/30">
                  <p className="text-green-200">🔸 {riddle.freeHint2}</p>
                </div>
              </div>
            </div>

            {/* Purchase Hints */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 text-yellow-400">💰 Acheter des indices</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => handlePurchaseHint('bonus')}
                  className="bg-yellow-900/30 hover:bg-yellow-900/50 p-4 rounded-lg border border-yellow-500/30 transition-colors"
                >
                  <div className="text-yellow-300 font-bold">Indice bonus</div>
                  <div className="text-yellow-200 text-sm">100 F CFA</div>
                </button>
                <button
                  onClick={() => handlePurchaseHint('mega')}
                  className="bg-orange-900/30 hover:bg-orange-900/50 p-4 rounded-lg border border-orange-500/30 transition-colors"
                >
                  <div className="text-orange-300 font-bold">Méga indice</div>
                  <div className="text-orange-200 text-sm">200 F CFA</div>
                </button>
                <button
                  onClick={() => handlePurchaseHint('answer')}
                  className="bg-red-900/30 hover:bg-red-900/50 p-4 rounded-lg border border-red-500/30 transition-colors"
                >
                  <div className="text-red-300 font-bold">Bonne réponse</div>
                  <div className="text-red-200 text-sm">500 F CFA</div>
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-4 text-center">
                📱 Envoyez Orange Money/Wave au 00223 70446750 puis la capture sur WhatsApp
              </p>
            </div>

            {/* Unlocked Hints */}
            {unlockedHints.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-blue-400">🔓 Indices débloqués</h3>
                <div className="space-y-3">
                  {unlockedHints.map((hint, index) => (
                    <div key={index} className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
                      <p className="text-blue-200">✨ {hint}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Answer Form */}
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  🎯 Ta réponse
                </label>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                  placeholder="Écris ta réponse ici..."
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || !answer.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-3 rounded-lg font-bold transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? '⏳ Vérification...' : '🚀 Valider la réponse'}
              </button>
            </form>

            {/* Message */}
            {message && (
              <div className={`mt-4 p-4 rounded-lg text-center ${
                message.includes('Bravo') ? 'bg-green-900/30 border border-green-500/30 text-green-200' :
                message.includes('incorrect') ? 'bg-red-900/30 border border-red-500/30 text-red-200' :
                'bg-blue-900/30 border border-blue-500/30 text-blue-200'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm">
          <p>🔐 Code Cuillère • 💰 00223 70446750</p>
        </div>
      </div>
    </div>
  )
}