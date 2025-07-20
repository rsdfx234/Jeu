'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/types'

export default function FinalistsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [finalists, setFinalists] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      router.push('/')
      return
    }
    
    loadFinalistsData(userId)
  }, [])

  const loadFinalistsData = async (userId: string) => {
    try {
      const response = await fetch(`/api/finalists?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setFinalists(data.finalists)
        setIsRegistered(data.user?.isFinalist || false)
      }
    } catch (error) {
      console.error('Error loading finalists:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterForDraw = async () => {
    if (!user) return
    
    try {
      const response = await fetch('/api/finalists/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })

      if (response.ok) {
        setIsRegistered(true)
        alert('🎉 Inscription au tirage au sort confirmée !')
      }
    } catch (error) {
      alert('Erreur lors de l\'inscription')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">⏳ Chargement...</div>
      </div>
    )
  }

  if (!user || !user.isFinalist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4">🔒 Accès réservé aux finalistes</h1>
          <p className="mb-6">Vous devez résoudre les 7 énigmes pour accéder à cette page.</p>
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
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            🏆 FÉLICITATIONS !
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">
            Tu as résolu les 7 énigmes de Code Cuillère !
          </p>
        </div>

        {/* Congratulations Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-black/30 backdrop-blur-lg border border-yellow-500/30 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-6 text-yellow-300">
              🎉 Bravo {user.firstName} !
            </h2>
            
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black p-6 rounded-lg mb-6">
              <p className="text-2xl font-bold mb-2">
                Tu es maintenant FINALISTE !
              </p>
              <p className="text-lg">
                Score final : {user.score} points
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-purple-300">🎯 Prochaine étape</h3>
              <p className="text-gray-300 leading-relaxed">
                Tous les finalistes participent automatiquement au 
                <span className="text-yellow-400 font-bold"> tirage au sort final</span> pour 
                remporter le prix de <span className="text-green-400 font-bold">100 000 F CFA</span> !
              </p>
            </div>

            {!isRegistered ? (
              <button
                onClick={handleRegisterForDraw}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🎟️ Confirmer mon inscription au tirage
              </button>
            ) : (
              <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg">
                <p className="text-green-200 font-bold">
                  ✅ Inscription confirmée au tirage au sort !
                </p>
                <p className="text-green-300 text-sm mt-2">
                  Nous te contacterons sur WhatsApp pour le résultat.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Finalists List */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/30 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-300">
              🏅 Liste des Finalistes
            </h2>
            
            {finalists.length > 0 ? (
              <div className="space-y-4">
                {finalists.map((finalist, index) => (
                  <div 
                    key={finalist.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      finalist.id === user.id 
                        ? 'bg-yellow-900/30 border-yellow-500/30' 
                        : 'bg-gray-800/30 border-gray-600/30'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">
                        {index < 3 ? ['🥇', '🥈', '🥉'][index] : '🏅'}
                      </div>
                      <div>
                        <p className="font-bold">
                          {finalist.id === user.id ? `${finalist.firstName} (Toi)` : finalist.firstName}
                        </p>
                        <p className="text-sm text-gray-400">
                          Score: {finalist.score} points
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      Niveau {finalist.currentLevel}/7
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400">
                Aucun autre finaliste pour le moment...
              </p>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="max-w-2xl mx-auto mt-12">
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-6 text-center">
            <h3 className="text-lg font-bold mb-3 text-blue-300">
              📱 Informations importantes
            </h3>
            <div className="text-sm text-blue-200 space-y-2">
              <p>• Le tirage au sort aura lieu quand tous les QR codes auront été scannés</p>
              <p>• Le gagnant sera contacté via WhatsApp</p>
              <p>• En cas d'égalité, le score et le temps de résolution comptent</p>
              <p>• Suivez-nous pour les mises à jour !</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>🔐 Code Cuillère • 📞 00223 70446750</p>
        </div>
      </div>
    </div>
  )
}