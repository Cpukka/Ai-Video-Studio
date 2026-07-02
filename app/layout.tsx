import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/shared/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Avatar Studio - Create Talking Avatars with AI',
  description: 'Create stunning talking avatar videos with AI. Generate scripts, voices, and videos in minutes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}