import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Get all data
    const [users, riddles, progress, payments, settings] = await Promise.all([
      prisma.user.findMany({
        orderBy: { score: 'desc' }
      }),
      prisma.riddle.findMany({
        orderBy: { riddleNumber: 'asc' }
      }),
      prisma.userProgress.findMany({
        include: {
          user: {
            select: {
              firstName: true,
              whatsapp: true
            }
          },
          riddle: {
            select: {
              riddleNumber: true,
              title: true
            }
          }
        }
      }),
      prisma.paymentRequest.findMany({
        include: {
          user: {
            select: {
              firstName: true,
              whatsapp: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.appSettings.findFirst()
    ])

    // Prepare WhatsApp export (as requested)
    const whatsappNumbers = users.map(user => ({
      firstName: user.firstName,
      whatsapp: user.whatsapp,
      level: user.currentLevel,
      score: user.score,
      isFinalist: user.isFinalist,
      registrationDate: user.createdAt
    }))

    // Prepare finalists specifically
    const finalists = users.filter(user => user.isFinalist).map(user => ({
      firstName: user.firstName,
      whatsapp: user.whatsapp,
      score: user.score,
      completionDate: user.updatedAt
    }))

    const exportData = {
      exportDate: new Date().toISOString(),
      summary: {
        totalUsers: users.length,
        finalists: finalists.length,
        totalPayments: payments.length,
        totalRevenue: payments
          .filter(p => p.status === 'approved')
          .reduce((sum, p) => sum + p.amount, 0)
      },
      users,
      riddles: riddles.map(r => ({
        ...r,
        // Don't export the answers in the main export for security
        correctAnswer: '***'
      })),
      progress,
      payments,
      whatsappNumbers,
      finalists,
      settings
    }

    return NextResponse.json(exportData)

  } catch (error) {
    console.error('Admin export error:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}