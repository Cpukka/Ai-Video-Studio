import { elevenlabs } from '@/lib/elevenlabs'
import  prisma from '@/lib/prisma'

export class VoiceService {
  static async generateSpeech(text: string, voiceId: string, userId: string) {
    try {
      const response = await elevenlabs.textToSpeech(voiceId, {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      })

      // Convert stream to buffer
      const chunks: Uint8Array[] = []
      for await (const chunk of response) {
        chunks.push(chunk)
      }
      const audioBuffer = Buffer.concat(chunks)

      // Upload to Cloudinary
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: audioBuffer.toString('base64'),
          type: 'audio',
          userId,
        }),
      })

      const { url } = await uploadResponse.json()

      // Log usage
      await prisma.aPIUsage.create({
        data: {
          userId,
          endpoint: '/api/voice',
          method: 'POST',
          status: 200,
        }
      })

      return { audioUrl: url }
    } catch (error) {
      console.error('Voice generation error:', error)
      throw new Error('Failed to generate voice')
    }
  }

  static async cloneVoice(audioUrl: string, name: string, userId: string) {
    try {
      // Download audio file
      const audioResponse = await fetch(audioUrl)
      const audioBlob = await audioResponse.blob()

      // Create voice clone with ElevenLabs
      const formData = new FormData()
      formData.append('name', name)
      formData.append('files', audioBlob, 'sample.mp3')

      const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        },
        body: formData,
      })

      const data = await response.json()

      // Save to database
      const voice = await prisma.voice.create({
        data: {
          name,
          voiceId: data.voice_id,
          isClone: true,
          userId,
        }
      })

      return voice
    } catch (error) {
      console.error('Voice cloning error:', error)
      throw new Error('Failed to clone voice')
    }
  }

  static async getVoices(userId: string) {
    const voices = await prisma.voice.findMany({
      where: {
        OR: [
          { userId },
          { isClone: false, userId: null },
        ],
      },
      orderBy: { createdAt: 'desc' },
    })

    return voices
  }
}