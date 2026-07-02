'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Video, FileText, Mic, Upload, Sparkles } from 'lucide-react'

export function QuickActions() {
  const actions = [
    {
      title: 'New Video',
      description: 'Create a new AI avatar video',
      icon: Video,
      href: '/studio',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'Generate Script',
      description: 'Create a script with AI',
      icon: FileText,
      href: '/studio?tab=script',
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      title: 'Clone Voice',
      description: 'Upload audio to clone a voice',
      icon: Mic,
      href: '/studio?tab=voice',
      color: 'bg-green-500/10 text-green-500',
    },
    {
      title: 'Upload Avatar',
      description: 'Upload a new avatar image',
      icon: Upload,
      href: '/studio?tab=avatar',
      color: 'bg-orange-500/10 text-orange-500',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Jump straight into creating your next AI video
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:border-primary hover:bg-primary/5"
              >
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}