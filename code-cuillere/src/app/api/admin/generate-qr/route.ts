import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/auth'
import QRCode from 'qrcode'

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const qrCodes: string[] = []

    // Generate QR codes for all 7 riddles
    for (let i = 1; i <= 7; i++) {
      const riddleNumber = i.toString().padStart(3, '0')
      const url = `${baseUrl}/riddle/${riddleNumber}`
      
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(url, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        qrCodes.push(qrCodeDataUrl)
      } catch (error) {
        console.error(`Error generating QR code for riddle ${i}:`, error)
        qrCodes.push('')
      }
    }

    return NextResponse.json({
      success: true,
      qrCodes,
      message: 'QR codes générés avec succès'
    })

  } catch (error) {
    console.error('Generate QR codes error:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}