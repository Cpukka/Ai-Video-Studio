// prisma/seed.ts
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient, Prisma } from '../generated/prisma/client'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL!

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables")
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting database seed...')

  try {
    // Test connection
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connected successfully')

    // 1. Create admin user
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
    console.log('✅ Admin user created')

    // 2. Create test user
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
    console.log('✅ Test user created')

    // 3. Create default voices
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
    console.log(`✅ ${defaultVoices.length} default voices added`)

    console.log('\n🎉 Seed completed successfully!')
    console.log('\n🔑 Login Credentials:')
    console.log('  Admin: admin@aiavatar.com / admin123')
    console.log('  Test User: test@example.com / test123')
    console.log(`  ${defaultVoices.length} default voices available`)

  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('🔄 Database connection closed')
  })