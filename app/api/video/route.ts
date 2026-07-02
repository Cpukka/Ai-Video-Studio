import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { VideoService } from '@/services/video-service'
import { z } from 'zod'

const videoSchema = z.object({
  script: z.string().min(10),
  voiceId: z.string(),
  avatarId: z.string(),
  projectId: z.string().optional(),
  settings: z.object({
    background: z.string().optional(),
    subtitle: z.boolean().default(false),
    resolution: z.enum(['720p', '1080p', '4k']).default('1080p'),
  }).optional(),
})

export async function POST(req: NextRequest) {
  try {
    // Use modern auth() instead of getServerSession
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = videoSchema.parse(body)

    // Check subscription limits
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, credits: true }
    })

    const requiredCredits = validatedData.settings?.resolution === '4k' ? 10 : 
                           validatedData.settings?.resolution === '1080p' ? 5 : 3

    if (user?.credits && user.credits < requiredCredits) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 })
    }

    // Create video record
    const video = await prisma.video.create({
      data: {
        title: `Video ${new Date().toISOString()}`,
        script: validatedData.script,
        voiceId: validatedData.voiceId,
        avatarId: validatedData.avatarId,
        status: 'PROCESSING',
        userId: session.user.id,
        projectId: validatedData.projectId,
        metadata: validatedData.settings,
      }
    })

    // Start async video generation
    VideoService.generateVideo(video.id, {
      ...validatedData,
      userId: session.user.id,
    }).catch(console.error)

    // Deduct credits
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: requiredCredits } }
    })

    return NextResponse.json({ 
      success: true, 
      videoId: video.id,
      message: 'Video generation started'
    })
  } catch (error) {
    console.error('Video generation error:', error)
    
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
      { error: 'Failed to start video generation' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const videoId = searchParams.get('id')

    if (videoId) {
      const video = await prisma.video.findFirst({
        where: {
          id: videoId,
          userId: session.user.id,
        }
      })

      if (!video) {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 })
      }

      return NextResponse.json(video)
    }

    const videos = await prisma.video.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return NextResponse.json(videos)
  } catch (error) {
    console.error('Failed to fetch videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}