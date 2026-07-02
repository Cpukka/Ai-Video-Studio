import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const videos = await prisma.video.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        url: true,
        thumbnail: true,
        createdAt: true,
        duration: true,
      },
    })

    return NextResponse.json(videos)
  } catch (error) {
    console.error('Failed to fetch recent videos:', error)
    return NextResponse.json([], { status: 200 }) // Return empty array on error
  }
}