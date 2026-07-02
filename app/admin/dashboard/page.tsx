'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FiUsers, 
  FiVideo, 
  FiCreditCard, 
  FiTrendingUp,
  FiCalendar,
  FiDollarSign,
  FiLoader,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalVideos: number
  totalRevenue: number
  monthlyRevenue: number
  revenueChange: number
  usersChange: number
  videosChange: number
  recentActivity: Activity[]
  userGrowth: GrowthData[]
  revenueData: RevenueData[]
  planDistribution: PlanDistribution[]
}

interface Activity {
  id: string
  type: 'user' | 'video' | 'subscription'
  action: string
  user: string
  timestamp: string
}

interface GrowthData {
  month: string
  users: number
}

interface RevenueData {
  month: string
  revenue: number
}

interface PlanDistribution {
  name: string
  value: number
  color: string
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
    } else {
      fetchDashboardStats()
    }
  }, [status, session, router])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <FiLoader className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your AI Avatar Studio platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <FiUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {stats.usersChange >= 0 ? (
                <>
                  <FiArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">{stats.usersChange}%</span>
                  <span className="ml-1">from last month</span>
                </>
              ) : (
                <>
                  <FiArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{Math.abs(stats.usersChange)}%</span>
                  <span className="ml-1">from last month</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <FiTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <FiVideo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVideos.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {stats.videosChange >= 0 ? (
                <>
                  <FiArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">{stats.videosChange}%</span>
                  <span className="ml-1">from last month</span>
                </>
              ) : (
                <>
                  <FiArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{Math.abs(stats.videosChange)}%</span>
                  <span className="ml-1">from last month</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <FiDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {stats.revenueChange >= 0 ? (
                <>
                  <FiArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">{stats.revenueChange}%</span>
                  <span className="ml-1">from last month</span>
                </>
              ) : (
                <>
                  <FiArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{Math.abs(stats.revenueChange)}%</span>
                  <span className="ml-1">from last month</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New users over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.1} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Distribution & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Plan Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plans</CardTitle>
            <CardDescription>Distribution of user subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.planDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(0)}%`}  // ← Fixed: added fallback for percent
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">by {activity.user}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}