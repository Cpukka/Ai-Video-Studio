import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id
        
        if (userId) {
          const subscriptionId = session.subscription as string
          
          // Get subscription details from Stripe
          const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId)
          
          // Update user's subscription in database
          await prisma.subscription.upsert({
            where: { userId },
            update: {
              stripeSubscriptionId: subscriptionId,
              stripeCustomerId: session.customer as string,
              plan: 'PRO',
              status: 'ACTIVE',
              currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
              currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            },
            create: {
              userId,
              stripeSubscriptionId: subscriptionId,
              stripeCustomerId: session.customer as string,
              plan: 'PRO',
              status: 'ACTIVE',
              currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
              currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            },
          })

          // Update user's plan
          await prisma.user.update({
            where: { id: userId },
            data: { plan: 'PRO' },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.userId
        
        if (userId) {
          await prisma.subscription.update({
            where: { userId },
            data: {
              plan: 'FREE',
              status: 'CANCELED',
            },
          })

          await prisma.user.update({
            where: { id: userId },
            data: { plan: 'FREE' },
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}