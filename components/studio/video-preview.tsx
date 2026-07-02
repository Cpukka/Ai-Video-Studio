'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useStudioStore } from '@/store/studio-store'
import { useToast } from '@/hooks/use-toast'
import { Play, Pause, Download, Loader2, CheckCircle, XCircle } from 'lucide-react'

interface Video {
  id: string
  url: string
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED'
  progress?: number
}

export function VideoPreview() {
  // Use selectors instead of destructuring
  const script = useStudioStore((state) => state.script)
  const voiceId = useStudioStore((state) => state.voiceId)
  const avatarUrl = useStudioStore((state) => state.avatarUrl)
  const settings = useStudioStore((state) => state.settings)
  
  const [video, setVideo] = useState<Video | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  const generateVideo = async () => {
    if (!script || !voiceId || !avatarUrl) {
      toast({
        title: 'Missing Information',
        description: 'Please complete all steps before generating.',
        variant: 'destructive',
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script,
          voiceId,
          avatarId: avatarUrl,
          settings,
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: 'Generation Started',
          description: 'Your video is being generated. This may take a few minutes.',
        })
        pollVideoStatus(data.videoId)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start video generation',
        variant: 'destructive',
      })
      setIsGenerating(false)
    }
  }

  const pollVideoStatus = async (videoId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/video?id=${videoId}`)
        const data = await response.json()
        
        setVideo(data)
        
        if (data.status === 'COMPLETED') {
          clearInterval(interval)
          setIsGenerating(false)
          toast({
            title: 'Video Ready!',
            description: 'Your video has been generated successfully.',
          })
        } else if (data.status === 'FAILED') {
          clearInterval(interval)
          setIsGenerating(false)
          toast({
            title: 'Generation Failed',
            description: 'There was an error generating your video.',
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 3000)
  }

  const downloadVideo = async () => {
    if (video?.url) {
      const link = document.createElement('a')
      link.href = video.url
      link.download = `avatar-video-${Date.now()}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast({
        title: 'Download Started',
        description: 'Your video is being downloaded.',
      })
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {video?.url && video.status === 'COMPLETED' ? (
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                src={video.url}
                className="w-full h-full"
                controls={false}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-4 right-4"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={downloadVideo} className="w-full" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Video
            </Button>
          </div>
        ) : video?.status === 'PROCESSING' ? (
          <div className="space-y-4 text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <div>
              <h3 className="font-semibold">Generating Your Video</h3>
              <p className="text-sm text-muted-foreground">
                This may take a few minutes...
              </p>
            </div>
            <Progress value={video.progress || 0} className="w-full" />
          </div>
        ) : video?.status === 'FAILED' ? (
          <div className="text-center py-12">
            <XCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h3 className="font-semibold">Generation Failed</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please try again or contact support.
            </p>
            <Button onClick={generateVideo}>Try Again</Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <Badge variant="outline" className="mb-2">
                Ready to Generate
              </Badge>
              <h3 className="font-semibold">Your video is ready</h3>
              <p className="text-sm text-muted-foreground">
                Click generate to create your talking avatar video
              </p>
            </div>
            <Button 
              onClick={generateVideo} 
              disabled={isGenerating || !script || !voiceId || !avatarUrl}
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Generate Video
                </>
              )}
            </Button>
            {(!script || !voiceId || !avatarUrl) && (
              <p className="text-xs text-muted-foreground mt-4">
                Complete all steps above to enable generation
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}