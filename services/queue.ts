import { Queue, Worker } from 'bullmq';

export const videoQueue = new Queue('video-generation', {
  connection: { host: 'localhost', port: 6379 }
});

// 1. Add job to queue
export async function startVideoGeneration(videoId: string) {
  await videoQueue.add('generate-video', { videoId });
}

// 2. Process job in background
const worker = new Worker('video-generation', async (job) => {
  const { videoId } = job.data;
  
  // Update status
  await prisma.video.update({
    where: { id: videoId },
    data: { status: 'PROCESSING' }
  });
  
  // Generate video (takes 30-120 seconds)
  const videoUrl = await generateVideoWithAI(videoId);
  
  // Update final status
  await prisma.video.update({
    where: { id: videoId },
    data: { 
      status: 'COMPLETED', 
      url: videoUrl,
      completedAt: new Date()
    }
  });
  
  // Notify user
  await notifyVideoReady(videoId);
});