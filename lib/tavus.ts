// lib/tavus.ts

// Tavus API Integration for Video Generation

interface TavusConfig {
  apiKey: string
  baseUrl?: string
}

interface GenerateVideoOptions {
  avatarId: string
  script: string
  audioUrl?: string
  background?: string
  resolution?: '720p' | '1080p' | '4k'
  subtitles?: boolean
}

interface VideoResponse {
  id: string
  url: string
  duration: number
  status: 'processing' | 'completed' | 'failed'
}

class TavusClient {
  private apiKey: string
  private baseUrl: string

  constructor(config: TavusConfig) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl || 'https://api.tavus.io/v1'
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Tavus API error (${response.status}): ${error}`)
    }

    return response.json()
  }

  /**
   * Generate a talking avatar video
   */
  async generateVideo(options: GenerateVideoOptions): Promise<VideoResponse> {
    const { avatarId, script, audioUrl, background, resolution, subtitles } =
      options

    // Check if we have enough credits
    // This would be handled by your billing system

    const payload = {
      avatar_id: avatarId,
      script: script,
      audio_url: audioUrl,
      background: background || 'default',
      resolution: resolution || '1080p',
      subtitles: subtitles || false,
      // Additional Tavus-specific options
      persona_id: avatarId,
      video_settings: {
        format: 'mp4',
        aspect_ratio: '16:9',
      },
    }

    const response = await this.request<{
      video_id: string
      url: string
      duration: number
      status: string
    }>('/videos', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    return {
      id: response.video_id,
      url: response.url,
      duration: response.duration,
      status: response.status as 'processing' | 'completed' | 'failed',
    }
  }

  /**
   * Get video status by ID
   */
  async getVideoStatus(videoId: string): Promise<VideoResponse> {
    const response = await this.request<{
      video_id: string
      url: string
      duration: number
      status: string
    }>(`/videos/${videoId}`)

    return {
      id: response.video_id,
      url: response.url,
      duration: response.duration,
      status: response.status as 'processing' | 'completed' | 'failed',
    }
  }

  /**
   * List all videos
   */
  async listVideos(limit: number = 10, offset: number = 0) {
    return this.request(`/videos?limit=${limit}&offset=${offset}`)
  }

  /**
   * Delete a video
   */
  async deleteVideo(videoId: string): Promise<{ success: boolean }> {
    await this.request(`/videos/${videoId}`, {
      method: 'DELETE',
    })
    return { success: true }
  }

  /**
   * Create a new avatar
   */
  async createAvatar(
    name: string,
    imageUrl: string,
    options?: Record<string, any>
  ) {
    const payload = {
      name,
      image_url: imageUrl,
      persona_settings: options || {},
    }

    const response = await this.request<{
      avatar_id: string
      name: string
      image_url: string
    }>('/avatars', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    return {
      id: response.avatar_id,
      name: response.name,
      imageUrl: response.image_url,
    }
  }

  /**
   * List available avatars
   */
  async listAvatars() {
    return this.request('/avatars')
  }

  /**
   * Get avatar by ID
   */
  async getAvatar(avatarId: string) {
    return this.request(`/avatars/${avatarId}`)
  }

  /**
   * Delete an avatar
   */
  async deleteAvatar(avatarId: string): Promise<{ success: boolean }> {
    await this.request(`/avatars/${avatarId}`, {
      method: 'DELETE',
    })
    return { success: true }
  }
}

// Export singleton instance
export const tavus = new TavusClient({
  apiKey: process.env.TAVUS_API_KEY || '',
  baseUrl: process.env.TAVUS_API_URL || 'https://api.tavus.io/v1',
})

// Export the client class for custom instances
export { TavusClient }

// Export types
export type { GenerateVideoOptions, VideoResponse, TavusConfig }