import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { number: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const riddleNumber = parseInt(params.number)

    if (!userId) {
      return NextResponse.json(
        { message: 'ID utilisateur requis' },
        { status: 400 }
      )
    }

    if (isNaN(riddleNumber) || riddleNumber < 1 || riddleNumber > 7) {
      return NextResponse.json(
        { message: 'Numéro d\'énigme invalide' },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Check if user can access this riddle
    if (user.currentLevel < riddleNumber) {
      return NextResponse.json(
        { message: 'Vous devez d\'abord résoudre les énigmes précédentes' },
        { status: 403 }
      )
    }

    // Get riddle
    const riddle = await prisma.riddle.findFirst({
      where: { riddleNumber }
    })

    if (!riddle) {
      return NextResponse.json(
        { message: 'Énigme non trouvée' },
        { status: 404 }
      )
    }

    // Get user progress for this riddle
    let progress = await prisma.userProgress.findFirst({
      where: {
        userId: user.id,
        riddleId: riddle.id
      }
    })

    // Create progress if it doesn't exist
    if (!progress) {
      progress = await prisma.userProgress.create({
        data: {
          userId: user.id,
          riddleId: riddle.id,
          attempts: 0,
          isCompleted: false,
          answers: '[]',
          unlockedHints: '[]'
        }
      })
    }

    return NextResponse.json({
      user,
      riddle,
      progress
    })

  } catch (error) {
    console.error('Get riddle error:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}