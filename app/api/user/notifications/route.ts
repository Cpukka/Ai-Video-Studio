import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const notificationsSchema = z.object({
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  videoCompleteAlerts: z.boolean(),
  creditAlerts: z.boolean(),
})

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = notificationsSchema.parse(body)

    // Store notification preferences in database
    // You'll need to add a NotificationSettings model to your schema
    // For now, just return success
    
    // If you have a NotificationSettings model:
    // await prisma.notificationSettings.upsert({
    //   where: { userId: session.user.id },
    //   update: validatedData,
    //   create: { userId: session.user.id, ...validatedData },
    // })

    return NextResponse.json({ 
      success: true, 
      message: 'Notification preferences updated' 
    })
    
  } catch (error) {
    console.error('Failed to update notifications:', error)
    
    if (error instanceof z.ZodError) {
      // Fix: Use error.issues instead of error.errors
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          }))
        }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return default preferences if no settings found
    const defaultPreferences = {
      emailNotifications: true,
      marketingEmails: false,
      videoCompleteAlerts: true,
      creditAlerts: true,
    }

    // If you have a NotificationSettings model:
    // const settings = await prisma.notificationSettings.findUnique({
    //   where: { userId: session.user.id },
    // })
    // return NextResponse.json(settings || defaultPreferences)

    return NextResponse.json(defaultPreferences)
    
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notification preferences' },
      { status: 500 }
    )
  }
}