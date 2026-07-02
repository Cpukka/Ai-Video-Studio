import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
})

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = profileSchema.parse(body)

    // Check if email is already taken by another user
    if (validatedData.email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      })
      
      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { error: 'Email already in use by another account' },
          { status: 400 }
        )
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
      },
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

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Failed to update profile:', error)
    
    if (error instanceof z.ZodError) {
      // Use error.issues instead of error.errors
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
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        credits: true,
        plan: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}