'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, whatsapp }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('userId', data.user.id)
        router.push('/riddle/001')
      } else {
        const error = await response.json()
        alert(error.message || 'Erreur lors de l\'inscription')
      }
    } catch (error) {
      alert('Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CODE CUILLÈRE
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 font-light">
            Mystère • Énigme • Récompense
          </p>
        </div>

        {!isRegistering ? (
          /* Welcome Section */
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-black/30 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-purple-300">
                🔍 Bienvenue dans l'Aventure
              </h2>
              
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Résous <span className="text-purple-400 font-bold">7 énigmes mystérieuses</span> dissé  minées dans la ville.
              </p>
              
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black p-4 rounded-lg mb-6">
                <p className="text-2xl font-bold">
                  🏆 Le gagnant remportera 100 000 F CFA 🏆
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm">
                <div className="bg-purple-800/50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🧩</div>
                  <p>7 énigmes progressives</p>
                </div>
                <div className="bg-purple-800/50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">💡</div>
                  <p>Indices disponibles</p>
                </div>
                <div className="bg-purple-800/50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🎯</div>
                  <p>Tirage au sort final</p>
                </div>
              </div>

              <button
                onClick={() => setIsRegistering(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🚀 Commencer le Jeu
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div className="max-w-md mx-auto">
            <div className="bg-black/30 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-center text-purple-300">
                📝 Inscription
              </h2>
              
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                    placeholder="Votre prénom"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Numéro WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                    placeholder="Ex: +223 XX XX XX XX"
                  />
                </div>

                <div className="text-xs text-gray-400 bg-gray-800/30 p-3 rounded-lg">
                  ℹ️ Votre numéro WhatsApp sera utilisé pour les notifications et le tirage au sort final.
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className="flex-1 px-4 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800/50 transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-3 rounded-lg font-bold transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? '⏳' : '🎯 S\'inscrire'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>🔐 Jeu sécurisé • 💰 Paiement Orange Money / Wave</p>
          <p className="mt-2">📞 Support: 00223 70446750</p>
        </div>
      </div>
    </div>
  )
}
