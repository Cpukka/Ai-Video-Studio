# AI Avatar Studio - Complete Setup Guide

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Redis (for rate limiting)
- FFmpeg installed on your system

## Installation Steps

### 1. Clone and Install Dependencies

\`\`\`bash
git clone <your-repo-url>
cd ai-avatar-studio
npm install
\`\`\`

### 2. Environment Setup

Copy the environment variables file:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Update the `.env.local` file with your actual API keys and configuration.

### 3. Database Setup

Start PostgreSQL and create the database:

\`\`\`bash
createdb ai_avatar_studio
\`\`\`

Push the Prisma schema:

\`\`\`bash
npx prisma db push
\`\`\`

Seed the database with initial data:

\`\`\`bash
npm run db:seed
\`\`\`

### 4. Install FFmpeg

**macOS:**
\`\`\`bash
brew install ffmpeg
\`\`\`

**Ubuntu/Debian:**
\`\`\`bash
sudo apt-get install ffmpeg
\`\`\`

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html)

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## API Services Setup

### Anthropic (Claude) API
1. Sign up at [Anthropic](https://console.anthropic.com/)
2. Generate API key
3. Add to `.env.local`: `ANTHROPIC_API_KEY=your_key`

### ElevenLabs API
1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Get API key from dashboard
3. Add to `.env.local`: `ELEVENLABS_API_KEY=your_key`

### Tavus API
1. Sign up at [Tavus](https://tavus.io/)
2. Request API access
3. Add to `.env.local`: `TAVUS_API_KEY=your_key`

### Cloudinary
1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get cloud name, API key, and secret
3. Add to `.env.local`

### Stripe
1. Create Stripe account
2. Get publishable and secret keys
3. Set up webhook endpoint: `https://your-domain.com/api/webhook/stripe`

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project on Vercel
3. Add all environment variables
4. Deploy!

### Production Database

Use managed PostgreSQL:
- Railway
- Supabase
- AWS RDS
- Vercel Postgres

## Troubleshooting

### Common Issues

**Prisma errors:**
\`\`\`bash
npx prisma generate
npx prisma db push --force-reset
\`\`\`

**FFmpeg not found:**
Ensure FFmpeg is in your PATH or set `FFMPEG_PATH` environment variable.

**Upload errors:**
Check UploadThing/C