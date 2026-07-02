'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/shared/container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { 
  FiUser, 
  FiBell, 
  FiShield, 
  FiCreditCard, 
  FiGlobe,
  FiSave,
  FiLoader,
  FiUpload,
  FiTrash2
} from 'react-icons/fi'

export default function SettingsPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    marketingEmails: false,
    videoCompleteAlerts: true,
    creditAlerts: true,
  })

  // Appearance settings
  const [appearance, setAppearance] = useState({
    language: 'en',
    timezone: 'UTC',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || '',
        email: session.user.email || '',
      })
    }
  }, [session])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        await update()
        toast({
          title: 'Profile updated',
          description: 'Your profile has been successfully updated.',
        })
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

 const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  setIsUploading(true)
  const formData = new FormData()
  formData.append('avatar', file)

  try {
    const response = await fetch('/api/user/avatar', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      const data = await response.json()
      
      // Force session update
      await update()
      
      // Also update local state to immediately show the image
      if (data.imageUrl) {
        setProfileData(prev => ({ ...prev, image: data.imageUrl }))
      }
      
      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated.',
      })
      
      // Optional: Refresh the page to ensure everything syncs
      // setTimeout(() => window.location.reload(), 500)
    } else {
      const error = await response.json()
      throw new Error(error.error || 'Failed to upload avatar')
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to upload avatar',
      variant: 'destructive',
    })
  } finally {
    setIsUploading(false)
  }
}

  const handleNotificationUpdate = async (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
    
    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...notifications, [key]: value }),
      })

      if (response.ok) {
        toast({
          title: 'Settings saved',
          description: 'Your notification preferences have been updated.',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings.',
        variant: 'destructive',
      })
    }
  }

  if (status === 'loading') {
    return (
      <Container className="py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <FiLoader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Container>
    )
  }

  if (!session) {
    return null
  }

  return (
    <Container className="py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="profile" className="gap-2">
            <FiUser className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <FiBell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <FiShield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <FiCreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={session.user?.image || ''} />
                  <AvatarFallback className="text-2xl">
                    {session.user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label htmlFor="avatar-upload">
                    <Button variant="outline" asChild>
                      <span className="cursor-pointer">
                        <FiUpload className="mr-2 h-4 w-4" />
                        {isUploading ? 'Uploading...' : 'Change Avatar'}
                      </span>
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications about your account
                  </p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(val) => handleNotificationUpdate('emailNotifications', val)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about new features and promotions
                  </p>
                </div>
                <Switch
                  checked={notifications.marketingEmails}
                  onCheckedChange={(val) => handleNotificationUpdate('marketingEmails', val)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Video Complete Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your video generation is complete
                  </p>
                </div>
                <Switch
                  checked={notifications.videoCompleteAlerts}
                  onCheckedChange={(val) => handleNotificationUpdate('videoCompleteAlerts', val)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Credit Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when you're running low on credits
                  </p>
                </div>
                <Switch
                  checked={notifications.creditAlerts}
                  onCheckedChange={(val) => handleNotificationUpdate('creditAlerts', val)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm new password" />
              </div>
              <Button>Update Password</Button>

              <div className="pt-6 border-t">
                <Label className="text-red-600">Danger Zone</Label>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Permanently delete your account and all associated data
                </p>
                <Button variant="destructive">
                  <FiTrash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Manage your subscription and payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Current Plan</span>
                  <span className="text-primary font-semibold">{session.user?.plan || 'FREE'}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {session.user?.plan === 'FREE' 
                    ? 'Upgrade to Pro for more features and higher limits'
                    : 'You are on the Pro plan. Thank you for your support!'}
                </p>
                {session.user?.plan === 'FREE' && (
                  <Button className="mt-4" onClick={() => router.push('/pricing')}>
                    Upgrade to Pro
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label>Payment Methods</Label>
                <div className="p-4 rounded-lg border text-center text-muted-foreground">
                  No payment methods added yet
                </div>
                <Button variant="outline" className="mt-2">
                  Add Payment Method
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Billing History</Label>
                <div className="p-4 rounded-lg border text-center text-muted-foreground">
                  No billing history available
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  )
}