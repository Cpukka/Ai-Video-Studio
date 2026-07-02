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
        videos: true,
      },
    })

    const totalVideos = user?.videos.length || 0
    const totalMinutes = user?.videos.reduce((acc, video) => acc + (video.duration || 0), 0) / 60
    const creditsLeft = user?.credits || 0

    return NextResponse.json({
      totalVideos,
      totalMinutes: Math.floor(totalMinutes),
      creditsLeft,
      growth: 15,
    })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}