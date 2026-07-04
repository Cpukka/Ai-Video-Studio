import { redis } from './redis'

export async function invalidateUserCache(userId: string) {
  // Clear Redis cache for this user
  await redis?.del(`user:${userId}:videos`);
  await redis?.del(`user:${userId}:stats`);
  await redis?.del(`user:${userId}:dashboard`);
  
  // Trigger cache rebuild for related queries
  await rebuildDashboardCache(userId);
}

// Helper function to rebuild cache
async function rebuildDashboardCache(userId: string) {
  // Only rebuild if Redis is available
  if (!redis) return;
  
  // Rebuild the dashboard cache
  const freshData = await fetchDashboardData(userId);
  await redis.set(
    `user:${userId}:dashboard`, 
    JSON.stringify(freshData), 
    'EX', 
    3600 // 1 hour TTL
  );
}

// Mock function - replace with actual data fetching
async function fetchDashboardData(userId: string) {
  // In a real implementation, this would fetch from your database
  return {
    stats: {
      totalVideos: 0,
      totalMinutes: 0,
      creditsLeft: 0,
    }
  };
}