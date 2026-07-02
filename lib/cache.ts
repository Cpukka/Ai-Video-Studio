export async function invalidateUserCache(userId: string) {
  // Clear Redis cache for this user
  await redis.del(`user:${userId}:videos`);
  await redis.del(`user:${userId}:stats`);
  await redis.del(`user:${userId}:dashboard`);
  
  // Trigger cache rebuild for related queries
  await rebuildDashboardCache(userId);
}