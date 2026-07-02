// lib/elevenlabs.ts

// Using fetch directly (no SDK needed)
// No installation required - uses native fetch

export const elevenlabs = {
  async textToSpeech(voiceId: string, options: {
    text: string
    model_id?: string
    voice_settings?: {
      stability: number
      similarity_boost: number
    }
  }) {
    try {
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
        const errorText = await response.text()
        throw new Error(`ElevenLabs API error (${response.status}): ${errorText}`)
      }

      return response.body // Returns a ReadableStream
    } catch (error) {
      console.error('ElevenLabs textToSpeech error:', error)
      throw error
    }
  },

  async cloneVoice(name: string, audioFile: File) {
    try {
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
        const errorText = await response.text()
        throw new Error(`Voice cloning failed (${response.status}): ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error('ElevenLabs cloneVoice error:', error)
      throw error
    }
  },

  async getVoices() {
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch voices (${response.status}): ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error('ElevenLabs getVoices error:', error)
      return { voices: [] } // Return empty array on error
    }
  },
}

// Default export for convenience
export default elevenlabs