import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

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

    // Check if user is a finalist
    if (!user.isFinalist) {
      return NextResponse.json(
        { message: 'Seuls les finalistes peuvent s\'inscrire au tirage' },
        { status: 403 }
      )
    }

    // Update user to confirm registration (the isFinalist flag already serves this purpose)
    // We could add a separate registeredForDraw field if needed in the future

    return NextResponse.json({
      success: true,
      message: 'Inscription au tirage confirmée',
      user
    })

  } catch (error) {
    console.error('Register for draw error:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}