// services/video-service.ts

import prisma from '@/lib/prisma'
import { VoiceService } from './voice-service'
import { tavus } from '@/lib/tavus'
import { cloudinary, uploadToCloudinary } from '@/lib/cloudinary'  // ← Updated import
import { exec } from 'child_process'
import { promisify } from 'util'
import ffmpeg from 'ffmpeg-static'

const execAsync = promisify(exec)

export class VideoService {
  static async generateVideo(videoId: string, data: any) {
    try {
      // Update status
      await prisma.video.update({
        where: { id: videoId },
        data: { status: 'PROCESSING' }
      })

      // Generate voice audio
      const { audioUrl } = await VoiceService.generateSpeech(
        data.script,
        data.voiceId,
        data.userId
      )

      // Generate talking avatar video
      const avatarVideo = await tavus.generateVideo({
        avatarId: data.avatarId,
        script: data.script,
        audioUrl: audioUrl,
        background: data.settings?.background,
        resolution: data.settings?.resolution,
      })

      let finalVideoUrl = avatarVideo.url

      // Add subtitles if enabled
      if (data.settings?.subtitle) {
        const subtitledVideo = await this.addSubtitles(
          avatarVideo.url,
          data.script
        )
        finalVideoUrl = subtitledVideo
      }

      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(finalVideoUrl, {
        resource_type: 'video',
        folder: 'ai-avatar-videos',
        public_id: videoId,
      })

      // Update video record
      await prisma.video.update({
        where: { id: videoId },
        data: {
          url: uploadResult.secure_url,
          thumbnail: uploadResult.thumbnail_url,
          status: 'COMPLETED',
          duration: avatarVideo.duration,
        }
      })

      return { url: uploadResult.secure_url }
    } catch (error) {
      console.error('Video generation error:', error)
      
      await prisma.video.update({
        where: { id: videoId },
        data: { status: 'FAILED' }
      })

      throw error
    }
  }

  static async addSubtitles(videoUrl: string, script: string) {
    try {
      // Generate subtitle file
      const subtitlePath = `/tmp/subtitles-${Date.now()}.srt`
      const subtitleContent = this.generateSRT(script)
      
      // Add subtitles with ffmpeg
      const outputPath = `/tmp/output-${Date.now()}.mp4`
      await execAsync(
        `${ffmpeg} -i ${videoUrl} -vf subtitles=${subtitlePath} ${outputPath}`
      )

      return outputPath
    } catch (error) {
      console.error('Subtitle addition error:', error)
      return videoUrl
    }
  }

  static generateSRT(script: string): string {
    const words = script.split(' ')
    const duration = words.length * 0.3
    const chunks = []
    const chunkSize = 15
    
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).join(' ')
      const startTime = (i / words.length) * duration
      const endTime = ((i + chunkSize) / words.length) * duration
      
      chunks.push({
        index: chunks.length + 1,
        start: this.formatTime(startTime),
        end: this.formatTime(endTime),
        text: chunk,
      })
    }
    
    return chunks.map(chunk => 
      `${chunk.index}\n${chunk.start} --> ${chunk.end}\n${chunk.text}\n`
    ).join('\n')
  }

  static formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 1000)
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`
  }
}