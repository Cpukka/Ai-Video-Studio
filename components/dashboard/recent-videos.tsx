'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { FiVideo, FiDownload, FiEye, FiClock, FiCalendar, FiRefreshCw } from 'react-icons/fi'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface VideoItem {
  id: string
  title: string
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED'
  url?: string
  thumbnail?: string
  createdAt: string
  duration?: number
}

export function RecentVideos() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecentVideos = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/videos/recent')
      
      if (response.status === 404) {
        // API not ready yet, show empty state
        setVideos([])
        setError(null)
        return
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setVideos(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch videos:', error)
      setError('Unable to load videos. Please try again later.')
      setVideos([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRecentVideos()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-500">Completed</Badge>
      case 'PROCESSING':
        return <Badge variant="secondary" className="animate-pulse">Processing</Badge>
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Draft</Badge>
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Videos</CardTitle>
          <CardDescription>Your recently created AI avatar videos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-16 w-24 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Videos</CardTitle>
          <CardDescription>Your recently created AI avatar videos</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <FiVideo className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" onClick={fetchRecentVideos} className="gap-2">
            <FiRefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (videos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Videos</CardTitle>
          <CardDescription>Your recently created AI avatar videos</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <FiVideo className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-4">No videos created yet</p>
          <Link href="/studio">
            <Button className="mt-2">
              Create Your First Video
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Videos</CardTitle>
        <CardDescription>Your recently created AI avatar videos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="h-16 w-24 rounded bg-muted flex items-center justify-center overflow-hidden">
              {video.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiVideo className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="font-medium truncate">{video.title || 'Untitled Video'}</p>
                {getStatusBadge(video.status)}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <FiCalendar className="h-3 w-3" />
                  {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                </span>
                {video.duration && (
                  <span className="flex items-center gap-1">
                    <FiClock className="h-3 w-3" />
                    {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                  </span>
                )}
              </div>
            </div>
            {video.status === 'COMPLETED' && video.url && (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" asChild>
                  <a href={video.url} target="_blank" rel="noopener noreferrer">
                    <FiEye className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a href={video.url} download>
                    <FiDownload className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        ))}
        <div className="text-center pt-2">
          <Link href="/projects">
            <Button variant="outline" size="sm">
              View All Videos
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}