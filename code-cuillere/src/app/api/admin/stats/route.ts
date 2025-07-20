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

    const [
      totalUsers,
      activeUsers,
      finalists,
      totalPayments,
      pendingPayments,
      approvedPayments
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          currentLevel: {
            gt: 1
          }
        }
      }),
      prisma.user.count({
        where: {
          isFinalist: true
        }
      }),
      prisma.paymentRequest.count(),
      prisma.paymentRequest.count({
        where: {
          status: 'pending'
        }
      }),
      prisma.paymentRequest.count({
        where: {
          status: 'approved'
        }
      })
    ])

    return NextResponse.json({
      totalUsers,
      activeUsers,
      finalists,
      totalPayments,
      pendingPayments,
      approvedPayments
    })

  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}