import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, riddleNumber, answer } = body

    if (!userId || !riddleNumber || !answer) {
      return NextResponse.json(
        { message: 'Paramètres manquants' },
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

    // Check if user can access this riddle
    if (user.currentLevel < riddleNumber) {
      return NextResponse.json(
        { message: 'Vous devez d\'abord résoudre les énigmes précédentes' },
        { status: 403 }
      )
    }

    // Get user progress
    let progress = await prisma.userProgress.findFirst({
      where: {
        userId: user.id,
        riddleId: riddle.id
      }
    })

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

    // Check if already completed
    if (progress.isCompleted) {
      return NextResponse.json(
        { message: 'Énigme déjà résolue' },
        { status: 400 }
      )
    }

    // Parse previous answers
    const previousAnswers = progress.answers ? JSON.parse(progress.answers) : []
    
    // Add new answer
    previousAnswers.push({
      answer: answer.toLowerCase(),
      timestamp: new Date().toISOString()
    })

    // Check if answer is correct
    const normalizedAnswer = answer.toLowerCase().trim()
    const normalizedCorrect = riddle.correctAnswer.toLowerCase().trim()
    const isCorrect = normalizedAnswer === normalizedCorrect

    let nextRiddle = null
    let updatedUser = user

    if (isCorrect) {
      // Mark progress as completed
      await prisma.userProgress.update({
        where: { id: progress.id },
        data: {
          isCompleted: true,
          answers: JSON.stringify(previousAnswers),
          attempts: progress.attempts + 1,
          completedAt: new Date()
        }
      })

      // Update user level and score
      const newLevel = Math.min(user.currentLevel + 1, 8)
      const scoreIncrement = 100 - (progress.attempts * 10) // Bonus for fewer attempts
      
      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          currentLevel: newLevel,
          score: user.score + Math.max(scoreIncrement, 10),
          isFinalist: newLevel > 7
        }
      })

      // Prepare next riddle if exists
      if (newLevel <= 7) {
        nextRiddle = newLevel
        
        // Create progress for next riddle
        const nextRiddleData = await prisma.riddle.findFirst({
          where: { riddleNumber: newLevel }
        })
        
        if (nextRiddleData) {
          await prisma.userProgress.create({
            data: {
              userId: user.id,
              riddleId: nextRiddleData.id,
              attempts: 0,
              isCompleted: false,
              answers: '[]',
              unlockedHints: '[]'
            }
          })
        }
      }
    } else {
      // Update attempts
      await prisma.userProgress.update({
        where: { id: progress.id },
        data: {
          answers: JSON.stringify(previousAnswers),
          attempts: progress.attempts + 1
        }
      })
    }

    return NextResponse.json({
      correct: isCorrect,
      nextRiddle,
      user: updatedUser,
      attempts: progress.attempts + 1
    })

  } catch (error) {
    console.error('Submit answer error:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}