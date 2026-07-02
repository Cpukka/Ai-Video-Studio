'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { CreditCard, Video, Mic, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface UsageData {
  totalVideos: number
  totalMinutes: number
  creditsUsed: number
  creditsTotal: number
  monthlyLimit: number
  minutesUsed: number
  scriptsGenerated: number
}

export function UsageStats() {
  const { data: session } = useSession()
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsageStats()
  }, [])

  const fetchUsageStats = async () => {
    try {
      const response = await fetch('/api/user/usage')
      const data = await response.json()
      setUsage(data)
    } catch (error) {
      console.error('Failed to fetch usage stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !usage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage Statistics</CardTitle>
          <CardDescription>Your current usage and limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-2 bg-muted rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-2 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const creditPercentage = (usage.creditsUsed / usage.creditsTotal) * 100
  const minutesPercentage = (usage.minutesUsed / usage.monthlyLimit) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Usage Statistics</span>
          <span className="text-sm font-normal text-muted-foreground">
            {session?.user?.plan || 'Free'} Plan
          </span>
        </CardTitle>
        <CardDescription>Your current usage and limits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Credits */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Credits Used
            </span>
            <span className="font-medium">
              {usage.creditsUsed} / {usage.creditsTotal}
            </span>
          </div>
          <Progress value={creditPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Credits are used for AI generation and video rendering
          </p>
        </div>

        {/* Video Minutes */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Video className="h-3 w-3" />
              Video Minutes
            </span>
            <span className="font-medium">
              {usage.minutesUsed} / {usage.monthlyLimit} min
            </span>
          </div>
          <Progress value={minutesPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Monthly video generation limit
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <Video className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">{usage.totalVideos}</p>
            <p className="text-xs text-muted-foreground">Total Videos</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <Mic className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">{usage.totalMinutes}</p>
            <p className="text-xs text-muted-foreground">Minutes Generated</p>
          </div>
        </div>

        {creditPercentage > 80 && (
          <div className="pt-2">
            <Link href="/pricing">
              <Button className="w-full" size="sm">
                <CreditCard className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}