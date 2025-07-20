import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { message: 'ID utilisateur requis' },
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

    // Get all finalists ordered by score (descending) then by completion time
    const finalists = await prisma.user.findMany({
      where: {
        isFinalist: true
      },
      orderBy: [
        { score: 'desc' },
        { updatedAt: 'asc' } // Earlier completion time is better
      ]
    })

    return NextResponse.json({
      user,
      finalists
    })

  } catch (error) {
    console.error('Get finalists error:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}