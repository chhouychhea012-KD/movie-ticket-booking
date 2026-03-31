'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Filter } from 'lucide-react'
import AdminStats from '@/components/admin-stats'
import AdminBookingsList from '@/components/admin-bookings-list'
import { Booking } from '@/types/booking'

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get bookings from localStorage
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
