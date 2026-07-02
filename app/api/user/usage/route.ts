import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        videos: {
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        },
      },
    })

    const planLimits = {
      FREE: { minutes: 60, credits: 100 },
      PRO: { minutes: 500, credits: 1000 },
      ENTERPRISE: { minutes: 5000, credits: 10000 },
    }

    const limits = planLimits[user?.plan as keyof typeof planLimits] || planLimits.FREE

    const totalVideos = user?.videos.length || 0
    const minutesUsed = user?.videos.reduce((acc, video) => acc + (video.duration || 0), 0) / 60
    const creditsUsed = limits.credits - (user?.credits || 0)

    return NextResponse.json({
      totalVideos,
      totalMinutes: Math.floor(minutesUsed),
      creditsUsed: Math.max(0, creditsUsed),
      creditsTotal: limits.credits,
      monthlyLimit: limits.minutes,
      minutesUsed: Math.floor(minutesUsed),
      scriptsGenerated: 0,
    })
  } catch (error) {
    console.error('Failed to fetch usage:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usage stats' },
      { status: 500 }
    )
  }
}