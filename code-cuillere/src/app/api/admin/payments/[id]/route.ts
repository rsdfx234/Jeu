import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action } = body
    const paymentId = params.id

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { message: 'Action invalide' },
        { status: 400 }
      )
    }

    // Get payment request
    const payment = await prisma.paymentRequest.findUnique({
      where: { id: paymentId },
      include: {
        user: true
      }
    })

    if (!payment) {
      return NextResponse.json(
        { message: 'Demande de paiement non trouvée' },
        { status: 404 }
      )
    }

    if (payment.status !== 'pending') {
      return NextResponse.json(
        { message: 'Cette demande a déjà été traitée' },
        { status: 400 }
      )
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected'

    // Update payment status
    const updatedPayment = await prisma.paymentRequest.update({
      where: { id: paymentId },
      data: {
        status: newStatus,
        approvedBy: admin.adminId,
        approvedAt: new Date()
      }
    })

    // If approved, unlock the hint/answer for the user
    if (action === 'approve') {
      const riddle = await prisma.riddle.findFirst({
        where: { riddleNumber: payment.riddleNumber }
      })

      if (riddle) {
        // Get user progress for this riddle
        let progress = await prisma.userProgress.findFirst({
          where: {
            userId: payment.userId,
            riddleId: riddle.id
          }
        })

        if (progress) {
          const unlockedHints = progress.unlockedHints 
            ? JSON.parse(progress.unlockedHints) 
            : []

          // Add the purchased hint/answer
          let hintToAdd = ''
          if (payment.paymentType === 'bonus_hint') {
            hintToAdd = riddle.bonusHint
          } else if (payment.paymentType === 'mega_hint') {
            hintToAdd = riddle.megaHint
          } else if (payment.paymentType === 'answer') {
            hintToAdd = `Réponse: ${riddle.correctAnswer}`
          }

          if (hintToAdd && !unlockedHints.includes(hintToAdd)) {
            unlockedHints.push(hintToAdd)

            await prisma.userProgress.update({
              where: { id: progress.id },
              data: {
                unlockedHints: JSON.stringify(unlockedHints)
              }
            })
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
      message: `Demande ${action === 'approve' ? 'approuvée' : 'rejetée'} avec succès`
    })

  } catch (error) {
    console.error('Admin payment action error:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}