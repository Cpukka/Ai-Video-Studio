import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const original = await prisma.project.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        videos: true
      }
    })

    if (!original) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const duplicated = await prisma.project.create({
      data: {
        name: `${original.name} (Copy)`,
        description: original.description,
        userId: session.user.id,
        script: original.script,
        voiceId: original.voiceId,
        avatarId: original.avatarId,
        status: 'DRAFT',
      }
    })

    return NextResponse.json(duplicated, { status: 201 })
  } catch (error) {
    console.error('Failed to duplicate project:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}