import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, amount, paymentType, riddleNumber } = body

    if (!userId || !amount || !paymentType || !riddleNumber) {
      return NextResponse.json(
        { message: 'Paramètres manquants' },
        { status: 400 }
      )
    }

    // Validate amount
    const validAmounts = [100, 200, 500]
    if (!validAmounts.includes(amount)) {
      return NextResponse.json(
        { message: 'Montant invalide' },
        { status: 400 }
      )
    }

    // Validate payment type
    const validTypes = ['bonus_hint', 'mega_hint', 'answer']
    if (!validTypes.includes(paymentType)) {
      return NextResponse.json(
        { message: 'Type de paiement invalide' },
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
        { message: 'Vous ne pouvez pas acheter d\'indices pour cette énigme' },
        { status: 403 }
      )
    }

    // Check if there's already a pending request for this user/riddle/type
    const existingRequest = await prisma.paymentRequest.findFirst({
      where: {
        userId: user.id,
        riddleNumber,
        paymentType,
        status: 'pending'
      }
    })

    if (existingRequest) {
      return NextResponse.json(
        { message: 'Une demande de paiement est déjà en cours pour cet indice' },
        { status: 400 }
      )
    }

    // Create payment request
    const paymentRequest = await prisma.paymentRequest.create({
      data: {
        userId: user.id,
        amount,
        paymentType,
        riddleNumber,
        paymentMethod: 'orange_money', // Default, can be updated later
        status: 'pending'
      }
    })

    return NextResponse.json({
      success: true,
      paymentRequest,
      message: 'Demande de paiement créée avec succès'
    })

  } catch (error) {
    console.error('Payment request error:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}