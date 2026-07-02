'use client'

import { motion } from 'framer-motion'
import { Container } from '@/components/shared/container'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { 
  Sparkles, 
  Mic, 
  Video, 
  Languages, 
  Download, 
  Shield,
  Zap,
  Users,
  Cloud,
  Edit3,
  Music,
  Image,
  Globe,
  Clock,
  BarChart,
  Heart
} from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function FeaturesPage() {
  const mainFeatures = [
    {
      title: 'AI Script Generator',
      description: 'Generate engaging scripts with Claude AI. Choose tone, length, and language to match your brand voice.',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      benefits: ['Multiple tones & styles', 'Multi-language support', 'Keyword optimization']
    },
    {
      title: 'Voice Cloning',
      description: 'Clone any voice with just 30 seconds of audio using ElevenLabs technology. Create unique brand voices.',
      icon: Mic,
      color: 'from-blue-500 to-cyan-500',
      benefits: ['30-second sample needed', 'Realistic results', 'Multiple voice models']
    },
    {
      title: 'Talking Avatars',
      description: 'Create realistic talking avatars with perfect lip sync and natural movements.',
      icon: Video,
      color: 'from-green-500 to-emerald-500',
      benefits: ['Perfect lip sync', 'Natural expressions', 'Custom backgrounds']
    },
    {
      title: 'Multi-Language Support',
      description: 'Generate videos in 50+ languages with perfect pronunciation and cultural nuances.',
      icon: Languages,
      color: 'from-orange-500 to-red-500',
      benefits: ['50+ languages', 'Accurate pronunciation', 'Localized content']
    },
    {
      title: 'HD & 4K Export',
      description: 'Export your videos in 1080p or 4K quality for professional use across all platforms.',
      icon: Download,
      color: 'from-indigo-500 to-purple-500',
      benefits: ['1080p & 4K options', 'Multiple formats', 'Optimized for social media']
    },
    {
      title: 'Enterprise Security',
      description: 'Bank-level security with SSO, encryption, and compliance for your peace of mind.',
      icon: Shield,
      color: 'from-red-500 to-orange-500',
      benefits: ['End-to-end encryption', 'SSO integration', 'GDPR compliant']
    }
  ]

  const advancedFeatures = [
    {
      title: 'Real-time Collaboration',
      description: 'Work together with your team in real-time. Share projects, leave comments, and iterate faster.',
      icon: Users
    },
    {
      title: 'Cloud Storage',
      description: 'All your projects are automatically saved and synced across all your devices.',
      icon: Cloud
    },
    {
      title: 'Custom Backgrounds',
      description: 'Upload your own backgrounds or choose from our library of professional scenes.',
      icon: Image
    },
    {
      title: 'Subtitle Generation',
      description: 'Auto-generate accurate subtitles in multiple languages for better accessibility.',
      icon: Edit3
    },
    {
      title: 'Background Music',
      description: 'Add royalty-free background music to enhance your video engagement.',
      icon: Music
    },
    {
      title: 'API Access',
      description: 'Integrate our AI video generation into your own applications with our powerful API.',
      icon: Globe
    },
    {
      title: 'Fast Processing',
      description: 'Get your videos in minutes with our optimized rendering pipeline.',
      icon: Clock
    },
    {
      title: 'Analytics Dashboard',
      description: 'Track video performance, engagement metrics, and audience insights.',
      icon: BarChart
    },
    {
      title: 'Priority Support',
      description: 'Get help when you need it with our dedicated support team.',
      icon: Heart
    }
  ]

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
          
          <Container>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center"
            >
              <motion.h1 
                variants={fadeInUp}
                className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
              >
                Powerful Features for
                <br />
                Professional Creators
              </motion.h1>
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-muted-foreground max-w-3xl mx-auto"
              >
                Everything you need to create stunning AI-powered avatar videos
              </motion.p>
            </motion.div>
          </Container>
        </section>

        {/* Main Features Grid */}
        <section className="py-20">
          <Container>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mainFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative p-6 rounded-2xl bg-card border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} p-2.5 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Advanced Features Section */}
        <section className="py-20 bg-muted/30">
          <Container>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
                Advanced Features for Power Users
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-muted-foreground">
                Take your video creation to the next level
              </motion.p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {advancedFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <Container>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of creators already using AI Avatar Studio
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/register" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">
                  Start Free Trial
                </a>
                <a href="/pricing" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                  View Pricing
                </a>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}