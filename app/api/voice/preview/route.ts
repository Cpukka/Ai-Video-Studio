import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const previewSchema = z.object({
  voiceId: z.string().min(1),
  text: z.string().min(1).max(500),
  settings: z.object({
    stability: z.number().min(0).max(1).default(0.5),
    similarityBoost: z.number().min(0).max(1).default(0.75),
    speed: z.number().min(0.5).max(2).default(1.0),
  }).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = previewSchema.parse(body)

    // Get voice details
    const voice = await prisma.voice.findFirst({
      where: {
        OR: [
          { id: validatedData.voiceId, userId: session.user.id },
          { id: validatedData.voiceId, isClone: false },
        ],
      },
    })

    if (!voice) {
      return NextResponse.json({ error: 'Voice not found' }, { status: 404 })
    }

    // Here you would integrate with ElevenLabs API
    // For now, return a mock audio response
    
    // Mock: Create a simple audio response (base64 encoded silence)
    // In production, replace this with actual ElevenLabs API call
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Generate a mock audio file (this is just a placeholder)
    // In production, you would call ElevenLabs API:
    // const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voice.voiceId, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'xi-api-key': process.env.ELEVENLABS_API_KEY!,
    //   },
    //   body: JSON.stringify({
    //     text: validatedData.text,
    //     model_id: 'eleven_monolingual_v1',
    //     voice_settings: {
    //       stability: validatedData.settings?.stability || 0.5,
    //       similarity_boost: validatedData.settings?.similarityBoost || 0.75,
    //     },
    //   }),
    // })
    
    // For now, return a mock response
    return NextResponse.json({ 
      success: true, 
      message: 'Preview generation would call ElevenLabs API',
      voiceId: voice.voiceId,
      text: validatedData.text.substring(0, 100),
    })
    
  } catch (error) {
    console.error('Failed to generate preview:', error)
    
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
      { error: 'Failed to generate voice preview' },
      { status: 500 }
    )
  }
}