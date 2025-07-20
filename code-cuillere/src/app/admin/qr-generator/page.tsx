'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function QRGeneratorPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [generatedQRs, setGeneratedQRs] = useState<string[]>([])

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
  }, [])

  const generateQRCodes = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/generate-qr', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedQRs(data.qrCodes)
      }
    } catch (error) {
      alert('Erreur lors de la génération')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadPoster = async (riddleNumber: number) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/poster/${riddleNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `code-cuillere-${riddleNumber.toString().padStart(3, '0')}.png`
        link.click()
      }
    } catch (error) {
      alert('Erreur lors du téléchargement')
    }
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">📱 Générateur QR Codes - Code Cuillère</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
          >
            ← Retour au Dashboard
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Instructions */}
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-blue-300">📋 Instructions</h2>
            <div className="space-y-2 text-blue-200">
              <p>• Générez les QR codes pour toutes les énigmes</p>
              <p>• Téléchargez les affiches individuellement</p>
              <p>• Collez les affiches dans la ville selon la stratégie définie</p>
              <p>• Chaque QR code redirige vers l'énigme correspondante</p>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <button
              onClick={generateQRCodes}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? '⏳ Génération...' : '🎯 Générer tous les QR Codes'}
            </button>
          </div>

          {/* QR Codes Grid */}
          {generatedQRs.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center">📱 QR Codes générés</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6, 7].map(riddleNumber => (
                  <div key={riddleNumber} className="bg-gray-800 rounded-lg p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-purple-300">
                        Code Cuillère #{riddleNumber.toString().padStart(3, '0')}
                      </h3>
                    </div>

                    {/* QR Code Display */}
                    <div className="bg-white p-4 rounded-lg mb-4 flex items-center justify-center">
                      {generatedQRs[riddleNumber - 1] ? (
                        <img 
                          src={generatedQRs[riddleNumber - 1]} 
                          alt={`QR Code ${riddleNumber}`}
                          className="w-48 h-48"
                        />
                      ) : (
                        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">QR Code</span>
                        </div>
                      )}
                    </div>

                    {/* URL Display */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-2">URL de destination:</p>
                      <p className="text-xs bg-gray-700 p-2 rounded break-all">
                        {baseUrl}/riddle/{riddleNumber.toString().padStart(3, '0')}
                      </p>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={() => downloadPoster(riddleNumber)}
                      className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      📥 Télécharger l'affiche
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Example Poster Content */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-yellow-300">🖼️ Exemple d'affiche</h2>
            <div className="bg-gradient-to-br from-purple-900 to-blue-900 p-6 rounded-lg border-2 border-yellow-400">
              <div className="text-center text-white space-y-4">
                <h3 className="text-2xl font-bold">🔍 CODE CUILLÈRE #001</h3>
                <p className="text-lg">Résous cette énigme et commence ta quête pour 100 000 F CFA !</p>
                
                <div className="bg-black/30 p-4 rounded-lg">
                  <p className="text-xl font-bold mb-2">🧠 Énigme :</p>
                  <p className="text-lg italic">"Dans la rue, je guide tes pas. Je suis marqué mais pas sur papier. Qu'est-ce que je suis ?"</p>
                </div>

                <div className="text-sm space-y-1">
                  <p>📍 Scanne, joue, gagne !</p>
                  <p>2 indices offerts.</p>
                  <p>Indice bonus : 100 F | Méga indice : 200 F | Réponse : 500 F</p>
                  <p>Orange/Wave : 00223 70446750</p>
                </div>

                <div className="w-32 h-32 bg-white mx-auto rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold">QR CODE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}