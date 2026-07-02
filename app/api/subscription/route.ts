import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const subscriptionSchema = z.object({
  plan: z.enum(['FREE', 'PRO', 'ENTERPRISE']),
})

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription) {
      // Return default subscription if none exists
      return NextResponse.json({
        plan: 'FREE',
        status: 'ACTIVE',
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      })
    }

    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Failed to fetch subscription:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = subscriptionSchema.parse(body)

    // Check if user already has a subscription
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (existingSubscription) {
      // Update existing subscription
      const updated = await prisma.subscription.update({
        where: { userId: session.user.id },
        data: {
          plan: validatedData.plan,
          status: 'ACTIVE',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          cancelAtPeriodEnd: false,
        },
      })
      
      // Also update user's plan
      await prisma.user.update({
        where: { id: session.user.id },
        data: { plan: validatedData.plan },
      })

      return NextResponse.json(updated)
    }

    // Create new subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        plan: validatedData.plan,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
      },
    })

    // Update user's plan
    await prisma.user.update({
      where: { id: session.user.id },
      data: { plan: validatedData.plan },
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    console.error('Failed to create/update subscription:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Cancel subscription (set to FREE plan)
    await prisma.subscription.update({
      where: { userId: session.user.id },
      data: {
        plan: 'FREE',
        status: 'CANCELED',
        cancelAtPeriodEnd: true,
      },
    })

    // Update user's plan
    await prisma.user.update({
      where: { id: session.user.id },
      data: { plan: 'FREE' },
    })

    return NextResponse.json({ success: true, message: 'Subscription canceled' })
  } catch (error) {
    console.error('Failed to cancel subscription:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}