'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Container } from '@/components/shared/container'
import { ScriptGenerator } from '@/components/studio/script-generator'
import { VoiceGenerator } from '@/components/studio/voice-generator'
import { AvatarUploader } from '@/components/studio/avatar-uploader'
import { VideoPreview } from '@/components/studio/video-preview'
import { GenerationControls } from '@/components/studio/generation-controls'
import { useStudioStore } from '@/store/studio-store'

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState('script')
  const { script, voiceId, avatarUrl, isGenerating } = useStudioStore()

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Video Studio</h1>
        <p className="text-muted-foreground">
          Create stunning talking avatar videos in three simple steps
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="script">1. Script</TabsTrigger>
              <TabsTrigger value="voice">2. Voice</TabsTrigger>
              <TabsTrigger value="avatar">3. Avatar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="script" className="mt-4">
              <ScriptGenerator onComplete={() => setActiveTab('voice')} />
            </TabsContent>
            
            <TabsContent value="voice" className="mt-4">
              <VoiceGenerator onComplete={() => setActiveTab('avatar')} />
            </TabsContent>
            
            <TabsContent value="avatar" className="mt-4">
              <AvatarUploader onComplete={() => setActiveTab('script')} />
            </TabsContent>
          </Tabs>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Generation Settings</h3>
            <GenerationControls />
          </Card>
        </div>

        <div className="space-y-6">
          <VideoPreview />
          
          {script && voiceId && avatarUrl && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Ready to Generate!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your video is ready to be generated. This may take a few minutes.
              </p>
              <GenerationControls isReady={true} />
            </Card>
          )}
        </div>
      </div>
    </Container>
  )
}