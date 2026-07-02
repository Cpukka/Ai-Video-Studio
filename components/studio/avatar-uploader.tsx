'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Upload, Image as ImageIcon, Sparkles } from 'lucide-react'
import { useStudio } from '@/store/studio-store'

interface AvatarUploaderProps {
  onComplete: () => void
}

export function AvatarUploader({ onComplete }: AvatarUploaderProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  
  const store = useStudio()
  const setAvatar = store((state) => state.setAvatar)
  const savedAvatarUrl = store((state) => state.avatarUrl)
  const { toast } = useToast()

  const handleImageUpload = (file: File) => {
    setSelectedImage(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleCreateAvatar = async () => {
    if (!selectedImage) return

    setIsGenerating(true)
    try {
      const formData = new FormData()
      formData.append('image', selectedImage)

      const response = await fetch('/api/avatar', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (response.ok) {
        setAvatar(data.avatarId, data.avatarUrl)
        toast({
          title: 'Avatar Created!',
          description: 'Your AI avatar is ready to use.',
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create avatar',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleContinue = () => {
    if (savedAvatarUrl) {
      onComplete()
      toast({
        title: 'Ready to Generate!',
        description: 'Your video is ready to be created.',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-primary" />
          Create Your Avatar
        </CardTitle>
        <CardDescription>
          Upload a photo or generate an AI avatar for your video.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Photo</TabsTrigger>
            <TabsTrigger value="ai">AI Generate</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 mt-4">
            {!previewUrl ? (
              <div className="text-center p-12 border-2 border-dashed rounded-lg">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Upload a Photo</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop or click to upload
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file)
                  }}
                  className="block w-full text-sm text-muted-foreground
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-primary-foreground
                    hover:file:bg-primary/90"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-square w-full max-w-sm mx-auto rounded-lg overflow-hidden border">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setPreviewUrl('')}>
                    Choose Different
                  </Button>
                  <Button onClick={handleCreateAvatar} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Avatar...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Create Avatar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai" className="space-y-4 mt-4">
            <div className="text-center p-12 border-2 border-dashed rounded-lg">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">AI Avatar Generation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Describe your ideal avatar and let AI create it
              </p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {savedAvatarUrl && (
          <div className="p-4 rounded-lg bg-muted/50">
            <Label>Current Avatar</Label>
            <div className="relative aspect-square w-32 mx-auto mt-2 rounded-lg overflow-hidden">
              <Image
                src={savedAvatarUrl}
                alt="Current avatar"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        <Button 
          onClick={handleContinue} 
          disabled={!savedAvatarUrl}
          className="w-full"
        >
          Continue to Generation
        </Button>
      </CardContent>
    </Card>
  )
}