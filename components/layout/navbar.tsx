'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
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
  FiBookOpen
} from 'react-icons/fi'
import { MdOutlineAutoAwesome } from 'react-icons/md'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Public navigation links
  const publicNavLinks = [
    { href: '/features', label: 'Features', icon: MdOutlineAutoAwesome },
    { href: '/pricing', label: 'Pricing', icon: FiCreditCard },
    { href: '/docs', label: 'Docs', icon: FiBookOpen },
  ]

  // Dashboard links for authenticated users
  const dashboardLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: FiHome },
    //{ href: '/studio', label: 'Studio', icon: FiVideo },
    //{ href: '/projects', label: 'Projects', icon: FiFolder },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-lg border-b shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <MdOutlineAutoAwesome className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI Avatar Studio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {/* Public links */}
            {publicNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Dashboard links for logged in users */}
            {isAuthenticated && (
              <>
                <div className="w-px h-6 bg-border mx-2" />
                {dashboardLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {/* Credit Display */}
                <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <FiBarChart2 className="h-3 w-3" />
                  <span>{session?.user?.credits || 0} credits</span>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                        <AvatarFallback>
                          {session?.user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session?.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <FiHome className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/studio" className="cursor-pointer">
                        <FiVideo className="mr-2 h-4 w-4" />
                        Studio
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/projects" className="cursor-pointer">
                        <FiFolder className="mr-2 h-4 w-4" />
                        Projects
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/pricing" className="cursor-pointer">
                        <FiCreditCard className="mr-2 h-4 w-4" />
                        Subscription
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <FiSettings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="cursor-pointer text-red-600"
                    >
                      <FiLogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-gradient-to-r from-primary to-primary/60">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex flex-col space-y-3">
              {/* Show credits on mobile if logged in */}
              {isAuthenticated && (
                <div className="flex items-center justify-between gap-2 px-2 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <FiBarChart2 className="h-4 w-4" />
                    Available Credits
                  </span>
                  <span className="font-bold">{session?.user?.credits || 0}</span>
                </div>
              )}
              
              {/* Public links */}
              {publicNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
              
              {/* Dashboard links for logged in users */}
              {isAuthenticated && (
                <>
                  <div className="h-px bg-border my-2" />
                  <p className="text-xs font-semibold text-muted-foreground px-2 pt-2">DASHBOARD</p>
                  {dashboardLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors px-2 py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  ))}
                </>
              )}
              
              {/* Auth links for non-authenticated users */}
              {!isAuthenticated && (
                <>
                  <div className="h-px bg-border my-2" />
                  <Link
                    href="/login"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FiUsers className="h-4 w-4" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-2 text-sm font-medium text-primary px-2 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MdOutlineAutoAwesome className="h-4 w-4" />
                    Get Started
                  </Link>
                </>
              )}
              
              {/* Sign out for mobile */}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    signOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors px-2 py-1 mt-2"
                >
                  <FiLogOut className="h-4 w-4" />
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}