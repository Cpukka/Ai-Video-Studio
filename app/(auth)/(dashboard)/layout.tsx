'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { 
  FiHome, 
  FiVideo, 
  FiFolder, 
  FiSettings, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiCreditCard,
  FiBarChart2,
  FiUsers,
  FiArrowLeft
} from 'react-icons/fi'
import { MdOutlineAutoAwesome } from 'react-icons/md'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: FiHome },
    { href: '/studio', label: 'Studio', icon: FiVideo },
    { href: '/projects', label: 'Projects', icon: FiFolder },
    { href: '/pricing', label: 'Subscription', icon: FiCreditCard },
    { href: '/settings', label: 'Settings', icon: FiSettings },
  ]

  const isAdmin = session.user?.role === 'ADMIN'

  if (isAdmin) {
    navItems.push({ href: '/admin/dashboard', label: 'Admin', icon: FiUsers })
  }

  // Don't show homepage link if already on homepage
  const isOnDashboard = pathname === '/dashboard'

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-64 bg-card border-r transition-transform duration-300',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          !isSidebarOpen && 'lg:-translate-x-64'
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <MdOutlineAutoAwesome className="h-6 w-6 text-primary" />
            <span className="font-bold">AI Avatar Studio</span>
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
          
          {/* Divider */}
          <div className="my-4 border-t" />
          
          {/* Homepage Link - Always goes to / not /dashboard */}
          <Link
            href="/"
            className="flex items-center space-x-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <FiArrowLeft className="h-4 w-4" />
            <span>Back to Homepage</span>
          </Link>
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user?.image || ''} />
                <AvatarFallback>
                  {session.user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session.user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.user?.credits || 0} credits left
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          'transition-all duration-300',
          isSidebarOpen ? 'lg:pl-64' : 'lg:pl-16'
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-lg border-b">
          <div className="flex h-full items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-md hover:bg-accent transition-colors"
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsMobileSidebarOpen(true)
                  } else {
                    setIsSidebarOpen(!isSidebarOpen)
                  }
                }}
                aria-label="Toggle sidebar"
              >
                <FiMenu className="h-5 w-5" />
              </button>
              
              {/* Homepage link in header (visible on mobile) - Goes to / not /dashboard */}
              <Link
                href="/"
                className="ml-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors md:hidden"
              >
                <FiArrowLeft className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {/* Credit Display */}
              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <FiBarChart2 className="h-3 w-3" />
                <span>{session.user?.credits || 0} credits</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                      <AvatarFallback>
                        {session.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/pricing">Upgrade Plan</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {/* Homepage link in dropdown - Goes to / not /dashboard */}
                  <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer">
                      <FiArrowLeft className="mr-2 h-4 w-4" />
                      Back to Homepage
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <FiLogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}