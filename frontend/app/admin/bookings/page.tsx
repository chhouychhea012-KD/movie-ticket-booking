'use client'

import { useState, useEffect } from 'react'
import { Booking } from '@/types/booking'
import { Search, Filter, Download, Plus, X } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AdminBookingsDetailPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedBookings = localStorage.getItem('bookings')
    if (storedBookings) {
      const parsed = JSON.parse(storedBookings)
      setBookings(parsed)
      setFilteredBookings(parsed)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = bookings.filter(booking =>
      booking.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.showtime.includes(searchTerm) ||
      booking.seats.some(seat => seat.includes(searchTerm))
    )

    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }, [searchTerm, statusFilter, bookings])

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      const updated = bookings.map(b =>
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
      )
      setBookings(updated)
      setFilteredBookings(updated)
      localStorage.setItem('bookings', JSON.stringify(updated))
      alert('Booking cancelled successfully')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Bookings</h1>
          <p className="text-slate-400 mt-1">Search and manage all customer bookings</p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-slate-300 text-sm transition">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition">
            <Plus className="w-4 h-4" />
            <span>Add Booking</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by movie, showtime, or seat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-orange-500 transition"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-700/20">
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Movie</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Showtime</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Seats</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Total</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Date</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Status</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <tr 
                    key={booking.id} 
                    className={`${index % 2 === 0 ? "bg-slate-800/40" : "bg-slate-800/20"} border-b border-slate-700/30 hover:bg-slate-700/30 transition`}
                  >
                    <td className="px-6 py-4 text-white font-medium">{booking.movieTitle}</td>
                    <td className="px-6 py-4 text-slate-300">{booking.showtime}</td>
                    <td className="px-6 py-4 text-slate-300">{booking.seats.join(', ')}</td>
                    <td className="px-6 py-4 text-orange-400 font-semibold">${booking.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-300">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm transition"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-slate-400 text-lg font-medium">No bookings found</p>
              <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
