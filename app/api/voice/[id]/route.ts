import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const voice = await prisma.voice.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!voice) {
      return NextResponse.json({ error: 'Voice not found' }, { status: 404 })
    }

    // Only allow deletion of cloned voices, not default ones
    if (!voice.isClone) {
      return NextResponse.json(
        { error: 'Cannot delete default voices' },
        { status: 403 }
      )
    }

    await prisma.voice.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete voice:', error)
    return NextResponse.json(
      { error: 'Failed to delete voice' },
      { status: 500 }
    )
  }
}