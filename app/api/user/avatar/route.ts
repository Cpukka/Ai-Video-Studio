import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const avatarFile = formData.get('avatar') as File

    if (!avatarFile) {
      return NextResponse.json(
        { error: 'No avatar file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!avatarFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 2MB)
    if (avatarFile.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image must be less than 2MB' },
        { status: 400 }
      )
    }

    // Convert file to base64 for storage
    const bytes = await avatarFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = `data:${avatarFile.type};base64,${buffer.toString('base64')}`

    // Update user's avatar in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: base64Image },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        credits: true,
        plan: true,
      },
    })

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      imageUrl: base64Image,
      message: 'Avatar updated successfully' 
    })
    
  } catch (error) {
    console.error('Failed to upload avatar:', error)
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    )
  }
}