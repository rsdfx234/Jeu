import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, whatsapp } = body

    // Validate input
    if (!firstName || !whatsapp) {
      return NextResponse.json(
        { message: 'Prénom et numéro WhatsApp requis' },
        { status: 400 }
      )
    }

    // Clean and validate WhatsApp number
    const cleanWhatsapp = whatsapp.replace(/\s+/g, '').replace(/[^\d+]/g, '')
    
    if (cleanWhatsapp.length < 8) {
      return NextResponse.json(
        { message: 'Numéro WhatsApp invalide' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { whatsapp: cleanWhatsapp }
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          message: 'Ce numéro WhatsApp est déjà enregistré',
          user: existingUser 
        },
        { status: 200 }
      )
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        whatsapp: cleanWhatsapp,
        currentLevel: 1,
        score: 0
      }
    })

    // Create progress for first riddle
    const firstRiddle = await prisma.riddle.findFirst({
      where: { riddleNumber: 1 }
    })

    if (firstRiddle) {
      await prisma.userProgress.create({
        data: {
          userId: user.id,
          riddleId: firstRiddle.id,
          attempts: 0,
          isCompleted: false,
          answers: '[]',
          unlockedHints: '[]'
        }
      })
    }

    return NextResponse.json({
      message: 'Inscription réussie',
      user
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}