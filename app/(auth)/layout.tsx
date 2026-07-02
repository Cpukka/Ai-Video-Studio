import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication | AI Avatar Studio',
  description: 'Sign in or create an account to start creating AI avatar videos',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {children}
    </div>
  )
}