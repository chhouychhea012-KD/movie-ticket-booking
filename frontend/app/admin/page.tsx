'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Filter, TrendingUp, Ticket, Users, DollarSign, Activity, BarChart3 } from 'lucide-react'
import AdminStats from '@/components/admin-stats'
import AdminBookingsList from '@/components/admin-bookings-list'
import { Booking } from '@/types/booking'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

// Dashboard mock data
const weeklyRevenue = [
  { day: 'Mon', revenue: 4500, bookings: 45, expenses: 1200 },
  { day: 'Tue', revenue: 3200, bookings: 32, expenses: 1100 },
  { day: 'Wed', revenue: 5100, bookings: 51, expenses: 1300 },
  { day: 'Thu', revenue: 4800, bookings: 48, expenses: 1250 },
  { day: 'Fri', revenue: 7200, bookings: 72, expenses: 1800 },
  { day: 'Sat', revenue: 8900, bookings: 89, expenses: 2100 },
  { day: 'Sun', revenue: 7600, bookings: 76, expenses: 1900 }
]

const hourlyBookings = [
  { hour: '10 AM', bookings: 12 },
  { hour: '11 AM', bookings: 18 },
  { hour: '12 PM', bookings: 25 },
  { hour: '1 PM', bookings: 22 },
  { hour: '2 PM', bookings: 28 },
  { hour: '3 PM', bookings: 24 },
  { hour: '4 PM', bookings: 32 },
  { hour: '5 PM', bookings: 45 },
  { hour: '6 PM', bookings: 68 },
  { hour: '7 PM', bookings: 85 },
  { hour: '8 PM', bookings: 92 },
  { hour: '9 PM', bookings: 78 },
  { hour: '10 PM', bookings: 54 },
  { hour: '11 PM', bookings: 28 }
]

const bookingsByStatus = [
  { name: 'Confirmed', value: 650, color: '#10b981' },
  { name: 'Pending', value: 85, color: '#f59e0b' },
  { name: 'Cancelled', value: 45, color: '#ef4444' },
  { name: 'Used', value: 320, color: '#3b82f6' }
]

const revenueByGenre = [
  { name: 'Action', value: 45000, color: '#ef4444' },
  { name: 'Drama', value: 32000, color: '#3b82f6' },
  { name: 'Comedy', value: 28000, color: '#f59e0b' },
  { name: 'Sci-Fi', value: 38000, color: '#8b5cf6' },
  { name: 'Horror', value: 15000, color: '#10b981' }
]

const topMovies = [
  { title: 'Dune: Part Two', bookings: 342, revenue: 34200, rating: 4.8 },
  { title: 'The Batman', bookings: 287, revenue: 28700, rating: 4.6 },
  { title: 'Oppenheimer', bookings: 256, revenue: 25600, rating: 4.7 },
  { title: 'Barbie', bookings: 234, revenue: 23400, rating: 4.4 },
  { title: 'Spider-Man: ATSV', bookings: 198, revenue: 19800, rating: 4.5 }
]

const topGenres = [
  { genre: 'Action', bookings: 320, percentage: 28, color: '#ef4444' },
  { genre: 'Drama', bookings: 245, percentage: 21, color: '#3b82f6' },
  { genre: 'Comedy', bookings: 198, percentage: 17, color: '#f59e0b' },
  { genre: 'Sci-Fi', bookings: 156, percentage: 14, color: '#8b5cf6' },
  { genre: 'Horror', bookings: 112, percentage: 10, color: '#10b981' }
]

// Monthly trend data
const monthlyTrend = [
  { month: 'Jan', revenue: 18500, bookings: 185 },
  { month: 'Feb', revenue: 22300, bookings: 223 },
  { month: 'Mar', revenue: 19800, bookings: 198 },
  { month: 'Apr', revenue: 24500, bookings: 245 }
]

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedBookings = localStorage.getItem('bookings')
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings))
    }
    setLoading(false)
  }, [])

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0)
  const totalBookings = bookings.length

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
