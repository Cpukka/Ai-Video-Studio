'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Sparkles, Copy, Check } from 'lucide-react'
import { useStudioStore } from '@/store/studio-store'

const scriptSchema = z.object({
  topic: z.string().min(5, 'Topic must be at least 5 characters'),
  tone: z.enum(['professional', 'casual', 'enthusiastic', 'serious']),
  length: z.enum(['short', 'medium', 'long']),
  language: z.string(),
  keywords: z.string().optional(),
})

type ScriptFormData = z.infer<typeof scriptSchema>

interface ScriptGeneratorProps {
  onComplete: () => void
}

export function ScriptGenerator({ onComplete }: ScriptGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedScript, setGeneratedScript] = useState('')
  const [copied, setCopied] = useState(false)
  
  // Use selectors instead of destructuring
  const setScript = useStudioStore((state) => state.setScript)
  const savedScript = useStudioStore((state) => state.script)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ScriptFormData>({
    resolver: zodResolver(scriptSchema),
    defaultValues: {
      tone: 'professional',
      length: 'medium',
      language: 'en',
    },
  })

  const tone = watch('tone')
  const length = watch('length')

  const onSubmit = async (data: ScriptFormData) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: data.topic,
          tone: data.tone,
          length: data.length,
          language: data.language,
          includeKeywords: data.keywords?.split(',').map(k => k.trim()) || [],
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate script')
      }

      const result = await response.json()
      setGeneratedScript(result.script)
      setScript(result.script)
      
      toast({
        title: 'Script Generated!',
        description: 'Your AI script is ready to use.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate script',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUseScript = () => {
    if (generatedScript) {
      onComplete()
      toast({
        title: 'Script Saved',
        description: 'Proceed to voice selection.',
      })
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: 'Copied!',
      description: 'Script copied to clipboard.',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Script Generator
        </CardTitle>
        <CardDescription>
          Generate engaging scripts using AI. Customize tone, length, and language.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic / Subject</Label>
            <Input
              id="topic"
              placeholder="e.g., Introduction to Artificial Intelligence"
              {...register('topic')}
            />
            {errors.topic && (
              <p className="text-sm text-destructive">{errors.topic.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(val: any) => setValue('tone', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="serious">Serious</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="length">Length</Label>
              <Select value={length} onValueChange={(val: any) => setValue('length', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (30-60 sec)</SelectItem>
                  <SelectItem value="medium">Medium (1-2 min)</SelectItem>
                  <SelectItem value="long">Long (2-3 min)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (Optional)</Label>
            <Input
              id="keywords"
              placeholder="Enter keywords separated by commas"
              {...register('keywords')}
            />
            <p className="text-xs text-muted-foreground">
              Add relevant keywords to focus the script content
            </p>
          </div>

          <Button type="submit" disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Script...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Script
              </>
            )}
          </Button>
        </form>

        {generatedScript && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Generated Script</Label>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="ml-1">{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 max-h-96 overflow-y-auto">
              <p className="whitespace-pre-wrap">{generatedScript}</p>
            </div>
            <Button onClick={handleUseScript} className="w-full">
              Use This Script
            </Button>
          </div>
        )}

        {savedScript && !generatedScript && (
          <div className="space-y-4">
            <Label>Saved Script</Label>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="whitespace-pre-wrap">{savedScript}</p>
            </div>
            <Button onClick={onComplete} variant="outline" className="w-full">
              Continue with Saved Script
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}