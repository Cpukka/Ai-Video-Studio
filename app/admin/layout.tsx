'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { 
  FiHome, 
  FiUsers, 
  FiCreditCard, 
  FiBarChart2, 
  FiSettings,
  FiVideo,
  FiAlertCircle,
  FiLogOut
} from 'react-icons/fi'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  const adminNavItems = [
    { href: '/admin/dashboard', label: 'Overview', icon: FiHome },
    { href: '/admin/users', label: 'Users', icon: FiUsers },
    { href: '/admin/subscriptions', label: 'Subscriptions', icon: FiCreditCard },
    { href: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
    { href: '/admin/videos', label: 'Videos', icon: FiVideo },
    { href: '/admin/reports', label: 'Reports', icon: FiAlertCircle },
    { href: '/admin/settings', label: 'Settings', icon: FiSettings },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r">
          <div className="flex h-16 items-center px-4 border-b">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <FiBarChart2 className="h-6 w-6 text-primary" />
              <span className="font-bold">Admin Panel</span>
            </Link>
          </div>
          <nav className="p-4 space-y-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t">
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <FiLogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 lg:ml-64">
          {/* Admin Header */}
          <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-lg border-b">
            <div className="flex h-full items-center justify-between px-6">
              <h2 className="text-lg font-semibold">Admin Dashboard</h2>
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user?.image || ''} />
                  <AvatarFallback>
                    {session.user?.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{session.user?.name}</span>
              </div>
            </div>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}