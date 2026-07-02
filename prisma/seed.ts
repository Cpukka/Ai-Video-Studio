import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1. Create users
  const adminPassword = await bcrypt.hash('admin123', 10)
  
  await prisma.user.upsert({
    where: { email: 'admin@aiavatar.com' },
    update: {},
    create: {
      email: 'admin@aiavatar.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      credits: 1000,
      plan: 'ENTERPRISE',
    },
  })

  const testPassword = await bcrypt.hash('test123', 10)
  
  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: testPassword,
      role: 'USER',
      credits: 50,
      plan: 'PRO',
    },
  })

  // 2. Create default voices
  const defaultVoices = [
    { name: 'Sarah - Professional', voiceId: '21m00Tcm4TlvDq8ikWAM', isClone: false },
    { name: 'Michael - Narration', voiceId: 'AZnzlk1XvdvUeBnXmlld', isClone: false },
    { name: 'Emma - Friendly', voiceId: 'EXAVITQu4L4GjE1FgRE', isClone: false },
    { name: 'David - Deep', voiceId: 'ErXwobaYiN19PQLjKkM', isClone: false },
    { name: 'Jessica - Energetic', voiceId: 'MF3mGyEYCl7XYWbV9V6O', isClone: false },
  ]

  for (const voice of defaultVoices) {
    await prisma.voice.upsert({
      where: { voiceId: voice.voiceId },
      update: {},
      create: voice,
    })
  }

  console.log('✅ Seed completed successfully!')
  console.log('📧 Admin: admin@aiavatar.com / admin123')
  console.log('📧 Test User: test@example.com / test123')
  console.log('🎤 Default voices added:', defaultVoices.length)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })