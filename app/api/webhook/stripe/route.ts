import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-06-24.dahlia',
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
        
        if (userId && session.subscription) {
          // Retrieve the full subscription object
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          // Get the plan details from the subscription items
          const plan = subscription.items.data[0]?.plan
          
          if (plan) {
            // Update user's subscription in database
            await prisma.subscription.upsert({
              where: { userId },
              update: {
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: session.customer as string,
                plan: mapStripePlanToAppPlan(plan.id),
                status: subscription.status === 'active' ? 'ACTIVE' : 'INCOMPLETE',
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              },
              create: {
                userId,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: session.customer as string,
                plan: mapStripePlanToAppPlan(plan.id),
                status: 'ACTIVE',
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              },
            })

            // Update user's plan
            await prisma.user.update({
              where: { id: userId },
              data: { plan: mapStripePlanToAppPlan(plan.id) },
            })
          }
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

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.customer && invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          )
          
          // Update subscription period
          await prisma.subscription.updateMany({
            where: {
              stripeCustomerId: invoice.customer as string,
            },
            data: {
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              status: 'ACTIVE',
            },
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

// Helper function to map Stripe plan IDs to app plans
function mapStripePlanToAppPlan(stripePlanId: string): 'FREE' | 'PRO' | 'ENTERPRISE' {
  // Map your Stripe plan IDs to your app plans
  // This should match your Stripe product/plan IDs
  const planMap: Record<string, 'FREE' | 'PRO' | 'ENTERPRISE'> = {
    'price_pro_monthly': 'PRO',
    'price_pro_annual': 'PRO',
    'price_enterprise_monthly': 'ENTERPRISE',
    'price_enterprise_annual': 'ENTERPRISE',
    // Add more mappings as needed
  }
  
  return planMap[stripePlanId] || 'FREE'
}