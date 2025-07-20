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

    const users = await prisma.user.findMany({
      orderBy: [
        { score: 'desc' },
        { currentLevel: 'desc' },
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json(users)

  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}