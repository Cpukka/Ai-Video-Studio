import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function proxy(request: NextRequest) {
  const session = await auth()
  const isAuthenticated = !!session
  
  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/pricing', '/features','/doc', '/', '/api/auth']
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith('/api/auth')
  )
  
  // Admin check
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  const isAdmin = session?.user?.role === 'ADMIN'
  
  if (isAdminPath && !isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // Redirect authenticated users away from auth pages
  if (isAuthenticated && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // Protect private routes
  if (!isAuthenticated && !isPublicPath) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}