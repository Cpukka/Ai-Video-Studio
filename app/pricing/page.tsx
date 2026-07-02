'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Container } from '@/components/shared/container'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Check, Zap, Sparkles, Crown, HelpCircle } from 'lucide-react'
import Link from 'next/link'

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

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for trying out the platform',
      price: { monthly: 0, annual: 0 },
      features: [
        '5 video minutes/month',
        '10+ basic voices',
        'Standard avatars',
        '720p export',
        'Basic support',
        'Community access'
      ],
      limitations: [
        'Watermarked videos',
        'No commercial use',
        'Limited API access'
      ],
      cta: 'Get Started',
      ctaLink: '/register',
      popular: false,
      icon: Sparkles
    },
    {
      name: 'Pro',
      description: 'For serious content creators',
      price: { monthly: 29, annual: 23 },
      features: [
        '100 video minutes/month',
        '50+ premium voices',
        'Custom avatars',
        '1080p export',
        'Voice cloning',
        'Priority support',
        'No watermark',
        'Commercial license'
      ],
      limitations: [],
      cta: 'Start Pro Trial',
      ctaLink: '/register?plan=pro',
      popular: true,
      icon: Zap
    },
    {
      name: 'Enterprise',
      description: 'For large teams and businesses',
      price: { monthly: 'Custom', annual: 'Custom' },
      features: [
        'Unlimited minutes',
        'Custom voice training',
        'API access',
        '4K export',
        'SLA guarantee',
        'Dedicated support',
        'SSO integration',
        'Custom contracts'
      ],
      limitations: [],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      popular: false,
      icon: Crown
    }
  ]

  const comparisons = [
    { feature: 'Video minutes/month', free: '5 min', pro: '100 min', enterprise: 'Unlimited' },
    { feature: 'Voice options', free: '10+', pro: '50+', enterprise: 'Custom' },
    { feature: 'Custom avatars', free: '❌', pro: '✅', enterprise: '✅' },
    { feature: 'Voice cloning', free: '❌', pro: '✅', enterprise: '✅' },
    { feature: 'Maximum resolution', free: '720p', pro: '1080p', enterprise: '4K' },
    { feature: 'Watermark removal', free: '❌', pro: '✅', enterprise: '✅' },
    { feature: 'API access', free: '❌', pro: 'Limited', enterprise: 'Full' },
    { feature: 'Priority support', free: '❌', pro: '✅', enterprise: 'Dedicated' },
    { feature: 'SLA guarantee', free: '❌', pro: '❌', enterprise: '✅' },
    { feature: 'Commercial license', free: '❌', pro: '✅', enterprise: '✅' },
  ]

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background">
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
                Simple, Transparent Pricing
              </motion.h1>
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
              >
                Choose the plan that works best for you. All plans include a 14-day free trial.
              </motion.p>

              {/* Billing Toggle */}
              <motion.div 
                variants={fadeInUp}
                className="flex items-center justify-center gap-4 mb-12"
              >
                <Label htmlFor="billing-toggle" className={!isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground'}>
                  Monthly
                </Label>
                <Switch
                  id="billing-toggle"
                  checked={isAnnual}
                  onCheckedChange={setIsAnnual}
                />
                <Label htmlFor="billing-toggle" className={isAnnual ? 'text-foreground font-semibold' : 'text-muted-foreground'}>
                  Annual
                  <span className="ml-2 text-xs text-green-500 font-normal">Save 20%</span>
                </Label>
              </motion.div>
            </motion.div>
          </Container>
        </section>

        {/* Pricing Cards */}
        <section className="py-20">
          <Container>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
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
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${plan.popular ? 'bg-primary/10' : 'bg-muted'}`}>
                      <plan.icon className={`h-6 w-6 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    {typeof plan.price.monthly === 'number' ? (
                      <>
                        <span className="text-4xl font-bold">
                          ${isAnnual ? plan.price.annual : plan.price.monthly}
                        </span>
                        <span className="text-muted-foreground">/month</span>
                        {isAnnual && (
                          <p className="text-sm text-green-500 mt-1">Billed annually (${plan.price.annual * 12}/year)</p>
                        )}
                      </>
                    ) : (
                      <span className="text-4xl font-bold">{plan.price.monthly}</span>
                    )}
                  </div>
                  
                  <Link href={plan.ctaLink}>
                    <Button className="w-full mb-8" variant={plan.popular ? 'default' : 'outline'}>
                      {plan.cta}
                    </Button>
                  </Link>
                  
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">What's included:</p>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <HelpCircle className="h-4 w-4 shrink-0" />
                        <span>{limitation}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-20 bg-muted/30">
          <Container>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-12"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
                Compare All Features
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-muted-foreground">
                See exactly what each plan includes
              </motion.p>
            </motion.div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-semibold">Free</th>
                    <th className="text-center p-4 font-semibold bg-primary/5">Pro</th>
                    <th className="text-center p-4 font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4 font-medium">{item.feature}</td>
                      <td className="text-center p-4">{item.free}</td>
                      <td className="text-center p-4 bg-primary/5 font-medium">{item.pro}</td>
                      <td className="text-center p-4">{item.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <Container>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-12"
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-muted-foreground">
                Everything you need to know about our plans
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 rounded-lg border bg-card"
                >
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm">{faq.answer}</p>
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
                Still have questions?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Can't find what you're looking for? Contact our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">
                  Contact Sales
                </a>
                <a href="/docs" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                  Read Documentation
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

const faqs = [
  {
    question: 'Can I switch plans later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal.'
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required.'
  },
  {
    question: 'Can I cancel my subscription?',
    answer: 'You can cancel anytime. No long-term contracts or hidden fees.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee for all annual subscriptions.'
  },
  {
    question: 'What happens to my videos after cancellation?',
    answer: 'Your videos remain accessible, but you won\'t be able to create new ones until you resubscribe.'
  }
]