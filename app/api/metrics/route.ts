// Add monitoring endpoints
import { NextResponse } from 'next/server';
import { getDailyActiveUsers, getAvgProcessingTime, getRequestRate, getDbConnections, getTotalStorage } from '@/lib/metrics';

export async function GET() {
  return NextResponse.json({
    dailyActiveUsers: await getDailyActiveUsers(),
    avgVideoProcessingTime: await getAvgProcessingTime(),
    apiRequestRate: await getRequestRate(),
    databaseConnections: await getDbConnections(),
    storageUsed: await getTotalStorage(),
  });
}