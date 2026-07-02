// lib/cloudinary.ts

import { v2 as cloudinaryV2 } from 'cloudinary'

// Configure Cloudinary
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// Export the configured cloudinary instance
export const cloudinary = cloudinaryV2

// Export individual functions for convenience
export const uploadToCloudinary = async (
  file: Buffer | string,
  options: {
    folder?: string
    public_id?: string
    resource_type?: 'image' | 'video' | 'raw' | 'auto'
    transformation?: any
  } = {}
) => {
  try {
    const result = await cloudinaryV2.uploader.upload(file, {
      folder: options.folder || 'ai-avatar-studio',
      public_id: options.public_id,
      resource_type: options.resource_type || 'auto',
      transformation: options.transformation,
    })
    return result
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinaryV2.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw error
  }
}

export const getCloudinaryImageUrl = (
  publicId: string,
  options: {
    width?: number
    height?: number
    crop?: string
    quality?: number
    format?: string
  } = {}
) => {
  const { width, height, crop = 'fill', quality = 80, format } = options
  
  let url = cloudinaryV2.url(publicId, {
    crop,
    width,
    height,
    quality: `auto:${quality}`,
    format: format || 'auto',
    secure: true,
  })
  
  return url
}

export const getCloudinaryVideoUrl = (
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: string
  } = {}
) => {
  const { width, height, quality = 80, format = 'mp4' } = options
  
  let url = cloudinaryV2.url(publicId, {
    resource_type: 'video',
    width,
    height,
    quality: `auto:${quality}`,
    format: format || 'auto',
    secure: true,
  })
  
  return url
}

// Default export
export default cloudinaryV2