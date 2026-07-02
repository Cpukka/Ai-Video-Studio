export async function triggerWebhooks(userId: string, event: string, data: any) {
  const webhooks = await prisma.webhook.findMany({
    where: { userId, events: { has: event } }
  });
  
  await Promise.all(webhooks.map(webhook =>
    fetch(webhook.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data, timestamp: new Date() })
    }).catch(console.error)
  ));
}