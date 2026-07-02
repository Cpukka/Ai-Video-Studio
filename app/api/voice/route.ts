import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const voiceSchema = z.object({
  name: z.string().min(1),
  voiceId: z.string().min(1),
  isClone: z.boolean().default(false),
})

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get voices for the user (including default voices)
    const voices = await prisma.voice.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { isClone: false, userId: null }, // Default voices
        ],
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(voices)
  } catch (error) {
    console.error('Failed to fetch voices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch voices' },
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
    const validatedData = voiceSchema.parse(body)

    // Check if voice already exists
    const existingVoice = await prisma.voice.findFirst({
      where: {
        voiceId: validatedData.voiceId,
        userId: session.user.id,
      },
    })

    if (existingVoice) {
      return NextResponse.json(
        { error: 'Voice already exists' },
        { status: 400 }
      )
    }

    const voice = await prisma.voice.create({
      data: {
        name: validatedData.name,
        voiceId: validatedData.voiceId,
        isClone: validatedData.isClone,
        userId: session.user.id,
      },
    })

    return NextResponse.json(voice, { status: 201 })
  } catch (error) {
    console.error('Failed to create voice:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: 'Failed to create voice' },
      { status: 500 }
    )
  }
}