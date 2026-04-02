'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Filter, TrendingUp, Ticket, Users, DollarSign, Activity, BarChart3, Loader2 } from 'lucide-react'
import AdminStats from '@/components/admin-stats'
import AdminBookingsList from '@/components/admin-bookings-list'
import { Booking } from '@/types/booking'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { analyticsAPI, bookingsAPI } from '@/lib/api'
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
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts'

interface DashboardData {
  weeklyRevenue: Array<{ day: string; revenue: number; bookings: number; expenses: number }>
  hourlyBookings: Array<{ hour: string; bookings: number }>
  bookingsByStatus: Array<{ name: string; value: number; color: string }>
  revenueByGenre: Array<{ name: string; value: number; color: string }>
  topMovies: Array<{ title: string; bookings: number; revenue: number; rating: number }>
  topGenres: Array<{ genre: string; bookings: number; percentage: number; color: string }>
  monthlyTrend: Array<{ month: string; revenue: number; bookings: number }>
  totalRevenue: number
  totalBookings: number
  totalUsers: number
}

const defaultData: DashboardData = {
  weeklyRevenue: [
    { day: 'Mon', revenue: 0, bookings: 0, expenses: 0 },
    { day: 'Tue', revenue: 0, bookings: 0, expenses: 0 },
    { day: 'Wed', revenue: 0, bookings: 0, expenses: 0 },
    { day: 'Thu', revenue: 0, bookings: 0, expenses: 0 },
    { day: 'Fri', revenue: 0, bookings: 0, expenses: 0 },
    { day: 'Sat', revenue: 0, bookings: 0, expenses: 0 },
    { day: 'Sun', revenue: 0, bookings: 0, expenses: 0 }
  ],
  hourlyBookings: [
    { hour: '10 AM', bookings: 0 }, { hour: '11 AM', bookings: 0 }, { hour: '12 PM', bookings: 0 },
    { hour: '1 PM', bookings: 0 }, { hour: '2 PM', bookings: 0 }, { hour: '3 PM', bookings: 0 },
    { hour: '4 PM', bookings: 0 }, { hour: '5 PM', bookings: 0 }, { hour: '6 PM', bookings: 0 },
    { hour: '7 PM', bookings: 0 }, { hour: '8 PM', bookings: 0 }, { hour: '9 PM', bookings: 0 },
    { hour: '10 PM', bookings: 0 }, { hour: '11 PM', bookings: 0 }
  ],
  bookingsByStatus: [
    { name: 'Confirmed', value: 0, color: '#10b981' },
    { name: 'Pending', value: 0, color: '#f59e0b' },
    { name: 'Cancelled', value: 0, color: '#ef4444' },
    { name: 'Used', value: 0, color: '#3b82f6' }
  ],
  revenueByGenre: [
    { name: 'Action', value: 0, color: '#ef4444' },
    { name: 'Drama', value: 0, color: '#3b82f6' },
    { name: 'Comedy', value: 0, color: '#f59e0b' },
    { name: 'Sci-Fi', value: 0, color: '#8b5cf6' },
    { name: 'Horror', value: 0, color: '#10b981' }
  ],
  topMovies: [],
  topGenres: [
    { genre: 'Action', bookings: 0, percentage: 0, color: '#ef4444' },
    { genre: 'Drama', bookings: 0, percentage: 0, color: '#3b82f6' },
    { genre: 'Comedy', bookings: 0, percentage: 0, color: '#f59e0b' },
    { genre: 'Sci-Fi', bookings: 0, percentage: 0, color: '#8b5cf6' },
    { genre: 'Horror', bookings: 0, percentage: 0, color: '#10b981' }
  ],
  monthlyTrend: [
    { month: 'Jan', revenue: 0, bookings: 0 },
    { month: 'Feb', revenue: 0, bookings: 0 },
    { month: 'Mar', revenue: 0, bookings: 0 },
    { month: 'Apr', revenue: 0, bookings: 0 }
  ],
  totalRevenue: 0,
  totalBookings: 0,
  totalUsers: 0
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData>(defaultData)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        const [analyticsRes, bookingsRes] = await Promise.all([
          analyticsAPI.getDashboard(),
          bookingsAPI.getAll({ limit: 100 })
        ])

        if (analyticsRes.success && analyticsRes.data) {
          const data = analyticsRes.data
          setDashboardData({
            weeklyRevenue: data.weeklyRevenue || defaultData.weeklyRevenue,
            hourlyBookings: data.hourlyBookings || defaultData.hourlyBookings,
            bookingsByStatus: data.bookingsByStatus || defaultData.bookingsByStatus,
            revenueByGenre: data.revenueByGenre || defaultData.revenueByGenre,
            topMovies: data.topMovies || defaultData.topMovies,
            topGenres: data.topGenres || defaultData.topGenres,
            monthlyTrend: data.monthlyTrend || defaultData.monthlyTrend,
            totalRevenue: data.totalRevenue || 0,
            totalBookings: data.totalBookings || 0,
            totalUsers: data.totalUsers || 0
          })
        }

        if (bookingsRes.success && bookingsRes.data?.bookings) {
          setBookings(bookingsRes.data.bookings)
        } else {
          const storedBookings = localStorage.getItem('bookings')
          if (storedBookings) {
            setBookings(JSON.parse(storedBookings))
          }
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        const storedBookings = localStorage.getItem('bookings')
        if (storedBookings) {
          setBookings(JSON.parse(storedBookings))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const { weeklyRevenue, hourlyBookings, bookingsByStatus, revenueByGenre, topMovies, topGenres, monthlyTrend } = dashboardData
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0) + dashboardData.totalRevenue
  const totalBookings = bookings.length + dashboardData.totalBookings

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back! Here's what's happening with your cinema.</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-slate-300 text-sm transition">
            <Calendar className="w-4 h-4" />
            <span>Last 30 days</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-slate-300 text-sm transition">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <AdminStats totalBookings={totalBookings} totalRevenue={totalRevenue} />

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Revenue Composed Chart */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={weeklyRevenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickFormatter={(value) => `$${value/1000}k`}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Revenue ($)"
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="bookings" 
                    fill="#f97316" 
                    radius={[4, 4, 0, 0]}
                    name="Bookings"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hourly Bookings Bar Chart */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Hourly Bookings Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyBookings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#94a3b8"
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: number) => [value, 'Bookings']}
                  />
                  <Bar 
                    dataKey="bookings" 
                    radius={[4, 4, 0, 0]}
                    name="Bookings"
                  >
                    {hourlyBookings.map((entry, index) => {
                      let fillColor = '#3b82f6'
                      if (entry.bookings >= 80) fillColor = '#ef4444'
                      else if (entry.bookings >= 50) fillColor = '#f97316'
                      else if (entry.bookings >= 30) fillColor = '#f59e0b'
                      return <Cell key={`cell-${index}`} fill={fillColor} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Status Pie */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-orange-500" />
              Bookings Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {bookingsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: number) => [value, 'Bookings']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {bookingsByStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-400 text-sm">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Genre */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Revenue by Genre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByGenre}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {revenueByGenre.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {revenueByGenre.map((item, index) => (
                <Badge key={index} variant="outline" className="text-xs" style={{ borderColor: item.color, color: item.color }}>
                  {item.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Movies */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" />
              Top Movies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMovies.map((movie, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center font-bold text-xs">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium truncate max-w-[120px]">{movie.title}</p>
                      <p className="text-slate-500 text-xs">{movie.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-500 text-sm font-medium">${movie.revenue.toLocaleString()}</p>
                    <p className="text-yellow-500 text-xs">★ {movie.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Genres Chart */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Popular Genres Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topGenres} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                <XAxis 
                  type="number"
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <YAxis 
                  type="category"
                  dataKey="genre"
                  stroke="#94a3b8"
                  fontSize={12}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: number) => [`${value} bookings`, 'Bookings']}
                />
                <Bar 
                  dataKey="bookings" 
                  radius={[0, 4, 4, 0]}
                  name="Bookings"
                >
                  {topGenres.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend Line Chart */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Monthly Trend Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="month" 
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                  name="Revenue"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={{ fill: '#f97316', strokeWidth: 2, r: 6 }}
                  name="Bookings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <AdminBookingsList bookings={bookings} />
        )}
      </div>
    </div>
  )
}
