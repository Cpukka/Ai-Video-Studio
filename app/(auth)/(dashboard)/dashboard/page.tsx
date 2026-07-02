'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/shared/container'
import { AnalyticsCard } from '@/components/dashboard/analytics-card'
import { RecentVideos } from '@/components/dashboard/recent-videos'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { UsageStats } from '@/components/dashboard/usage-stats'
import { Video, Mic, Clock, TrendingUp, Home } from 'lucide-react'  // ← Lucide icons

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalMinutes: 0,
    creditsLeft: 0,
    growth: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'Creator'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your AI avatar studio today.
          </p>
        </div>
        
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <AnalyticsCard
          title="Total Videos"
          value={stats.totalVideos}
          icon={Video}
          trend="+12%"
          trendUp={true}
        />
        <AnalyticsCard
          title="Minutes Generated"
          value={stats.totalMinutes}
          icon={Clock}
          trend="+8%"
          trendUp={true}
        />
        <AnalyticsCard
          title="Credits Left"
          value={stats.creditsLeft}
          icon={Mic}
          trend="-5%"
          trendUp={false}
        />
        <AnalyticsCard
          title="Growth Rate"
          value={`${stats.growth}%`}
          icon={TrendingUp}
          trend="+2%"
          trendUp={true}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <QuickActions />
          <RecentVideos />
        </div>
        <div className="space-y-8">
          <UsageStats />
          <Card>
            <CardHeader>
              <CardTitle>Need More Credits?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Upgrade to Pro plan for unlimited access and premium features.
              </p>
              <Link href="/pricing">
                <Button className="w-full">
                  Upgrade Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  )
}