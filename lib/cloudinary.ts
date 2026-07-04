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
  file: Buffer | string | File,
  options: {
    folder?: string
    public_id?: string
    resource_type?: 'image' | 'video' | 'raw' | 'auto'
    transformation?: any
  } = {}
) => {
  try {
    let uploadData: string | Buffer = file as string | Buffer
    
    // If it's a File object, convert to Buffer
    if (file instanceof File) {
      const bytes = await file.arrayBuffer()
      uploadData = Buffer.from(bytes)
    }

    // If it's a Buffer, convert to base64 string
    // This is the key fix - Cloudinary accepts base64 strings
    let uploadString: string
    if (Buffer.isBuffer(uploadData)) {
      // Convert Buffer to base64 string
      // Determine MIME type based on context
      const mimeType = options.resource_type === 'video' ? 'video/mp4' : 'image/jpeg'
      uploadString = `data:${mimeType};base64,${uploadData.toString('base64')}`
    } else {
      uploadString = uploadData
    }

    const result = await cloudinaryV2.uploader.upload(uploadString, {
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
  
  const url = cloudinaryV2.url(publicId, {
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
  
  const url = cloudinaryV2.url(publicId, {
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