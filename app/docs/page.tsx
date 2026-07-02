'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Container } from '@/components/shared/container'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  BookOpen, 
  Video, 
  Mic, 
  Image, 
  Settings, 
  Code, 
  HelpCircle,
  ChevronRight,
  Sparkles,
  Zap,
  Shield,
  Cloud,
  Terminal,
  Globe,
  Lock,
  Users,
  BarChart
} from 'lucide-react'
import Link from 'next/link'

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    {
      title: 'Getting Started',
      icon: Sparkles,
      articles: [
        { title: 'Quick Start Guide', description: 'Create your first AI avatar video in 5 minutes', duration: '5 min' },
        { title: 'Account Setup', description: 'Set up your account and preferences', duration: '3 min' },
        { title: 'Understanding Credits', description: 'How credits work and how to manage them', duration: '4 min' },
      ]
    },
    {
      title: 'Video Creation',
      icon: Video,
      articles: [
        { title: 'Script Generation', description: 'Use AI to generate engaging scripts', duration: '10 min' },
        { title: 'Voice Selection & Cloning', description: 'Choose or clone voices for your videos', duration: '8 min' },
        { title: 'Avatar Creation', description: 'Create custom avatars from photos', duration: '6 min' },
        { title: 'Video Export Settings', description: 'Optimize your video exports', duration: '5 min' },
      ]
    },
    {
      title: 'AI Features',
      icon: Zap,
      articles: [
        { title: 'AI Script Generation Tips', description: 'Get the best results from our AI', duration: '7 min' },
        { title: 'Voice Cloning Best Practices', description: 'Tips for perfect voice clones', duration: '6 min' },
        { title: 'Lip Sync Optimization', description: 'Improve avatar lip synchronization', duration: '5 min' },
      ]
    },
    {
      title: 'API & Integration',
      icon: Code,
      articles: [
        { title: 'API Overview', description: 'Introduction to our API', duration: '5 min' },
        { title: 'Authentication', description: 'API key management and security', duration: '4 min' },
        { title: 'API Endpoints', description: 'Complete API reference', duration: '15 min' },
        { title: 'Webhooks', description: 'Set up real-time notifications', duration: '6 min' },
      ]
    },
    {
      title: 'Account & Billing',
      icon: Settings,
      articles: [
        { title: 'Managing Your Subscription', description: 'Upgrade, downgrade, or cancel', duration: '4 min' },
        { title: 'Billing & Invoicing', description: 'Understanding your invoices', duration: '3 min' },
        { title: 'Team Management', description: 'Add and manage team members', duration: '5 min' },
      ]
    },
    {
      title: 'Security & Compliance',
      icon: Shield,
      articles: [
        { title: 'Data Security', description: 'How we protect your data', duration: '4 min' },
        { title: 'GDPR Compliance', description: 'Our GDPR practices', duration: '3 min' },
        { title: 'SSO Integration', description: 'Set up single sign-on', duration: '6 min' },
      ]
    }
  ]

  const quickLinks = [
    { title: 'API Reference', icon: Code, href: '/docs/api' },
    { title: 'Video Tutorials', icon: Video, href: '/docs/tutorials' },
    { title: 'FAQ', icon: HelpCircle, href: '/docs/faq' },
    { title: 'SDK Downloads', icon: Cloud, href: '/docs/sdk' },
  ]

  const filteredCategories = searchQuery
    ? categories.map(cat => ({
        ...cat,
        articles: cat.articles.filter(article => 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.articles.length > 0)
    : categories

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-primary/5 via-background to-background border-b">
          <Container>
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4" variant="outline">Documentation</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to the
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> AI Avatar Studio</span> Docs
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Everything you need to create amazing AI avatar videos
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search documentation..."
                  className="pl-10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Quick Links */}
        <section className="py-12 border-b">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => (
                <Link key={index} href={link.href}>
                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent transition-colors group">
                    <link.icon className="h-5 w-5 text-primary" />
                    <span className="font-medium">{link.title}</span>
                    <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        {/* Documentation Content */}
        <section className="py-12">
          <Container>
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24">
                  <h3 className="font-semibold mb-4">Documentation</h3>
                  <nav className="space-y-2">
                    {categories.map((category, index) => (
                      <div key={index}>
                        <button 
                          className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-accent transition-colors text-left"
                          onClick={() => document.getElementById(category.title)?.scrollIntoView({ behavior: 'smooth' })}
                        >
                          <category.icon className="h-4 w-4 text-primary" />
                          <span className="text-sm">{category.title}</span>
                        </button>
                      </div>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-12">
                {filteredCategories.map((category, index) => (
                  <section key={index} id={category.title}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <category.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold">{category.title}</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {category.articles.map((article, idx) => (
                        <Link key={idx} href={`/docs/${article.title.toLowerCase().replace(/\s+/g, '-')}`}>
                          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader>
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary" className="text-xs">{article.duration} read</Badge>
                              </div>
                              <CardTitle className="text-lg">{article.title}</CardTitle>
                              <CardDescription>{article.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center text-sm text-primary">
                                Read more
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}

                {/* No results */}
                {filteredCategories.length === 0 && (
                  <div className="text-center py-12">
                    <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground">
                      We couldn't find any documentation matching "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>

        {/* Help Section */}
        <section className="py-20 bg-muted/30">
          <Container>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="default">
                  Contact Support
                </Button>
                <Button size="lg" variant="outline">
                  Join Discord Community
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}