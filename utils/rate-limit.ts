export async function rateLimit(identifier: string) {
  // Simple rate limit - allows 10 requests per minute
  // For production, use Redis or Upstash
  
  const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
  const now = Date.now()
  const windowInSeconds = 60
  const limit = 10
  const resetTime = now + windowInSeconds * 1000
  
  const current = rateLimitMap.get(identifier)
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime })
    return { success: true }
  }
  
  if (current.count >= limit) {
    return { success: false }
  }
  
  current.count++
  rateLimitMap.set(identifier, current)
  return { success: true }
}