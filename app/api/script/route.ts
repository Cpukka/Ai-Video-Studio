import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const scriptSchema = z.object({
  topic: z.string().min(1),
  tone: z.enum(['professional', 'casual', 'enthusiastic', 'serious']),
  length: z.enum(['short', 'medium', 'long']),
  language: z.string().default('en'),
  includeKeywords: z.array(z.string()).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = scriptSchema.parse(body)

    // Check credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true }
    })

    if (!user || user.credits < 1) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 })
    }

    // Generate mock script (works without Anthropic)
    const mockScript = `This is a sample script about ${validatedData.topic}. 
    
The tone is ${validatedData.tone} and the length is ${validatedData.length}.

To enable real AI script generation, add your ANTHROPIC_API_KEY to .env.local`

    // Deduct credit
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 1 } }
    })

    return NextResponse.json({ script: mockScript })
  } catch (error) {
    console.error('Script generation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: 'Failed to generate script' },
      { status: 500 }
    )
  }
}