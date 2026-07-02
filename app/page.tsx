'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { motion, useAnimation, useInView } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/shared/container'
import { 
  FiStar, 
  FiMic, 
  FiVideo, 
  FiGlobe, 
  FiDownload, 
  FiShield,
  FiChevronRight,
  FiUsers,
  FiClock,
  FiZap
} from 'react-icons/fi'
import { MdOutlineAutoAwesome } from 'react-icons/md'

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
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

export default function LandingPage() {
  const { status } = useSession()
  // Remove useRouter - no redirect needed
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref)

  // REMOVED: The redirect that was causing the loop
  // Users can now view the landing page even when logged in

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  // Show loading while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
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
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                <MdOutlineAutoAwesome className="w-4 h-4" />
                <span>AI-Powered Video Creation</span>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
              >
                Create Talking Avatars
                <br />
                Powered by AI
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
              >
                Generate professional talking avatar videos in minutes. 
                Perfect for content creators, educators, and businesses.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                {status === 'authenticated' ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="gap-2">
                      Go to Dashboard
                      <FiChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <Button size="lg" className="gap-2">
                      Start Creating Free
                      <FiChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
                <Link href="#features">
                  <Button size="lg" variant="outline">
                    Watch Demo
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div 
                variants={fadeInUp}
                className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <FiStar className="w-4 h-4 text-yellow-500" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers className="w-4 h-4 text-primary" />
                  <span>10K+ Active Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-primary" />
                  <span>Minute Generation</span>
                </div>
              </motion.div>
            </motion.div>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30" id="features">
          <Container>
            <motion.div
              ref={ref}
              initial="hidden"
              animate={controls}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-4">
                Everything You Need to Create
                <br />
                Professional AI Avatars
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful features to bring your ideas to life
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Pricing Section */}
        <section className="py-20" id="pricing">
          <Container>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-4">
                Simple, Transparent Pricing
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-muted-foreground">
                Choose the plan that works for you
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-8 rounded-2xl border ${
                    plan.popular ? 'border-primary shadow-xl bg-gradient-to-b from-primary/5 to-background' : 'border-border bg-card'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  <div className="mb-6">
                    {typeof plan.price === 'number' ? (
                      <>
                        <span className="text-4xl font-bold">${plan.price}</span>
                        <span className="text-muted-foreground">/month</span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold">{plan.price}</span>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.ctaLink}>
                    <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                      {plan.ctaText}
                    </Button>
                  </Link>
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
                Ready to Create Amazing AI Videos?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of creators already using AI Avatar Studio
              </p>
              {status === 'authenticated' ? (
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2">
                    Go to Dashboard
                    <FiZap className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Start Your Free Trial
                    <FiZap className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}

const features = [
  {
    title: 'AI Script Generator',
    description: 'Generate engaging scripts with Anthropic AI. Choose tone, length, and language.',
    icon: MdOutlineAutoAwesome
  },
  {
    title: 'Voice Cloning',
    description: 'Clone any voice with just 30 seconds of audio using ElevenLabs technology.',
    icon: FiMic
  },
  {
    title: 'Talking Avatars',
    description: 'Create realistic talking avatars with perfect lip sync and natural movements.',
    icon: FiVideo
  },
  {
    title: 'Multi-Language Support',
    description: 'Generate videos in 50+ languages with perfect pronunciation.',
    icon: FiGlobe
  },
  {
    title: 'HD Export',
    description: 'Export your videos in 1080p or 4K quality for professional use.',
    icon: FiDownload
  },
  {
    title: 'Enterprise Security',
    description: 'Bank-level security with SSO, encryption, and compliance.',
    icon: FiShield
  }
]

const pricingPlans = [
  {
    name: 'Free',
    description: 'Perfect for trying out the platform',
    price: 0,
    features: [
      '5 video minutes/month',
      '10+ basic voices',
      'Standard avatars',
      '720p export',
      'Basic support'
    ],
    ctaText: 'Get Started',
    ctaLink: '/register',
    popular: false
  },
  {
    name: 'Pro',
    description: 'For serious content creators',
    price: 29,
    features: [
      '100 video minutes/month',
      '50+ premium voices',
      'Custom avatars',
      '1080p export',
      'Voice cloning',
      'Priority support'
    ],
    ctaText: 'Start Pro Trial',
    ctaLink: '/register?plan=pro',
    popular: true
  },
  {
    name: 'Enterprise',
    description: 'For large teams and businesses',
    price: 'Custom',
    features: [
      'Unlimited minutes',
      'Custom voice training',
      'API access',
      '4K export',
      'SLA guarantee',
      'Dedicated support'
    ],
    ctaText: 'Contact Sales',
    ctaLink: '/contact',
    popular: false
  }
]