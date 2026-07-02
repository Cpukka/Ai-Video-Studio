// lib/elevenlabs.ts

// If using ElevenLabs Node.js SDK
// First install: npm install elevenlabs-node

// Option 1: Using the official SDK
import { ElevenLabsClient } from 'elevenlabs-node'

export const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY || '',
})

// Option 2: Using fetch directly (if you prefer not to use SDK)
export const elevenlabs = {
  async textToSpeech(voiceId: string, options: {
    text: string
    model_id?: string
    voice_settings?: {
      stability: number
      similarity_boost: number
    }
  }) {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        },
        body: JSON.stringify({
          text: options.text,
          model_id: options.model_id || 'eleven_monolingual_v1',
          voice_settings: options.voice_settings || {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`)
    }

    return response.body // Returns a ReadableStream
  },

  async cloneVoice(name: string, audioFile: File) {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('files', audioFile)

    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Voice cloning failed: ${response.statusText}`)
    }

    return response.json()
  },

  async getVoices() {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.statusText}`)
    }

    return response.json()
  },
}