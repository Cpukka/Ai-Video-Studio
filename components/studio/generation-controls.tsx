'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, Video, Subtitles, Maximize } from 'lucide-react'
import { useStudioStore } from '@/store/studio-store'

interface GenerationControlsProps {
  isReady?: boolean
}

export function GenerationControls({ isReady = false }: GenerationControlsProps) {
  const { settings, setSetting } = useStudioStore()
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <Button variant="outline" onClick={() => setIsOpen(true)} className="w-full">
        <Settings className="mr-2 h-4 w-4" />
        Configure Generation Settings
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Generation Settings
          </span>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </CardTitle>
        <CardDescription>
          Customize how your video will be generated
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Background Selection */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Background
          </Label>
          <Select 
            value={settings.background} 
            onValueChange={(val) => setSetting('background', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select background" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default (Blur)</SelectItem>
              <SelectItem value="office">Office Background</SelectItem>
              <SelectItem value="nature">Nature Background</SelectItem>
              <SelectItem value="studio">Studio Background</SelectItem>
              <SelectItem value="custom">Custom Background</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subtitles Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Subtitles className="h-4 w-4" />
              Subtitles
            </Label>
            <p className="text-sm text-muted-foreground">
              Add subtitles to your video
            </p>
          </div>
          <Switch 
            checked={settings.subtitles} 
            onCheckedChange={(val) => setSetting('subtitles', val)}
          />
        </div>

        {/* Resolution Selection */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Maximize className="h-4 w-4" />
            Resolution
          </Label>
          <Select 
            value={settings.resolution} 
            onValueChange={(val: '720p' | '1080p' | '4k') => setSetting('resolution', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select resolution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="720p">720p (Standard)</SelectItem>
              <SelectItem value="1080p">1080p (HD) - 5 credits</SelectItem>
              <SelectItem value="4k">4K (Ultra HD) - 10 credits</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Higher resolutions consume more credits
          </p>
        </div>

        {isReady && (
          <Button size="lg" className="w-full bg-gradient-to-r from-primary to-primary/60">
            Generate Video Now
          </Button>
        )}
      </CardContent>
    </Card>
  )
}