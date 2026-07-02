// lib/redis.ts

import Redis from 'ioredis'

const getRedisUrl = () => {
  const url = process.env.REDIS_URL
  if (url) {
    return url
  }
  return null
}

const redisUrl = getRedisUrl()

export const redis = redisUrl
  ? new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        if (times > 3) {
          console.warn('Redis connection failed after 3 retries')
          return null
        }
        return Math.min(times * 50, 2000)
      },
    })
  : null

// Test Redis connection if available
if (redis) {
  redis.on('connect', () => {
    console.log('✅ Redis connected successfully')
  })

  redis.on('error', (error) => {
    console.warn('⚠️ Redis connection error:', error.message)
  })
}

export default redis