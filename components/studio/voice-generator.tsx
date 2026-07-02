'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Volume2, Play, Square, Mic, Upload } from 'lucide-react'
import { useStudioStore } from '@/store/studio-store'

interface Voice {
  id: string
  name: string
  voiceId: string
  isClone: boolean
  previewUrl?: string
}

interface VoiceGeneratorProps {
  onComplete: () => void
}

export function VoiceGenerator({ onComplete }: VoiceGeneratorProps) {
  const [voices, setVoices] = useState<Voice[]>([])
  const [selectedVoiceId, setSelectedVoiceId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCloning, setIsCloning] = useState(false)
  const [settings, setSettings] = useState({
    stability: 0.5,
    similarityBoost: 0.75,
    speed: 1.0,
  })
  
  // Use selectors correctly
  const setVoice = useStudioStore((state) => state.setVoice)
  const savedVoiceId = useStudioStore((state) => state.voiceId)
  const { toast } = useToast()

  useEffect(() => {
    fetchVoices()
  }, [])

  const fetchVoices = async () => {
    try {
      const response = await fetch('/api/voice')
      const data = await response.json()
      setVoices(data)
      if (savedVoiceId) {
        setSelectedVoiceId(savedVoiceId)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load voices',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoiceId(voiceId)
    const voice = voices.find(v => v.id === voiceId)
    if (voice) {
      setVoice(voice.id, voice.name)
    }
  }

  const handlePreview = async () => {
    if (!selectedVoiceId) return
    
    setIsPlaying(true)
    try {
      const response = await fetch('/api/voice/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceId: selectedVoiceId,
          text: "Hello! This is a preview of my voice. How does it sound?",
          settings,
        }),
      })

      const blob = await response.blob()
      const audioUrl = URL.createObjectURL(blob)
      const audio = new Audio(audioUrl)
      
      audio.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }
      
      await audio.play()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to play preview',
        variant: 'destructive',
      })
      setIsPlaying(false)
    }
  }

  const handleCloneVoice = async (audioFile: File) => {
    setIsCloning(true)
    try {
      const formData = new FormData()
      formData.append('audio', audioFile)
      formData.append('name', `Cloned Voice ${new Date().toLocaleDateString()}`)

      const response = await fetch('/api/voice/clone', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Voice cloned successfully',
        })
        await fetchVoices()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clone voice',
        variant: 'destructive',
      })
    } finally {
      setIsCloning(false)
    }
  }

  const handleContinue = () => {
    if (selectedVoiceId) {
      onComplete()
      toast({
        title: 'Voice Selected',
        description: 'Proceed to avatar selection.',
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-primary" />
          Voice Selection
        </CardTitle>
        <CardDescription>
          Choose a voice for your avatar or clone your own voice.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="library">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">Voice Library</TabsTrigger>
            <TabsTrigger value="clone">Clone Voice</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Select Voice</Label>
              <Select value={selectedVoiceId} onValueChange={handleVoiceSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      <div className="flex items-center gap-2">
                        {voice.name}
                        {voice.isClone && (
                          <Badge variant="secondary" className="text-xs">
                            Custom
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedVoiceId && (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Stability: {settings.stability}</Label>
                    <Slider
                      value={[settings.stability]}
                      onValueChange={([val]) => setSettings({ ...settings, stability: val })}
                      min={0}
                      max={1}
                      step={0.05}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Similarity Boost: {settings.similarityBoost}</Label>
                    <Slider
                      value={[settings.similarityBoost]}
                      onValueChange={([val]) => setSettings({ ...settings, similarityBoost: val })}
                      min={0}
                      max={1}
                      step={0.05}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Speed: {settings.speed}x</Label>
                    <Slider
                      value={[settings.speed]}
                      onValueChange={([val]) => setSettings({ ...settings, speed: val })}
                      min={0.5}
                      max={2}
                      step={0.1}
                    />
                  </div>
                </div>

                <Button onClick={handlePreview} disabled={isPlaying} className="w-full">
                  {isPlaying ? (
                    <>
                      <Square className="mr-2 h-4 w-4" />
                      Playing...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Preview Voice
                    </>
                  )}
                </Button>
              </>
            )}
          </TabsContent>

          <TabsContent value="clone" className="space-y-4 mt-4">
            <div className="text-center p-6 border-2 border-dashed rounded-lg">
              <Mic className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">Clone Your Voice</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a clear audio recording (30 seconds minimum)
              </p>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleCloneVoice(file)
                }}
                className="block w-full text-sm text-muted-foreground
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/90"
              />
              {isCloning && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Cloning your voice...</span>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Button 
          onClick={handleContinue} 
          disabled={!selectedVoiceId}
          className="w-full"
        >
          Continue to Avatar
        </Button>
      </CardContent>
    </Card>
  )
}