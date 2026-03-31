'use client'

import { Booking } from '@/types/booking'
import { Ticket, Clock, Users, DollarSign, Calendar, ChevronRight, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminBookingsListProps {
  bookings: Booking[]
}

export default function AdminBookingsList({ bookings }: AdminBookingsListProps) {
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
    <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
          <p className="text-slate-400 text-sm">Manage and track customer bookings</p>
        </div>
        <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition flex items-center gap-2">
          View All <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
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
            {bookings.slice(0, 5).map((booking, index) => (
              <tr 
                key={booking.id} 
                className={cn(
                  "border-b border-slate-700/30 hover:bg-slate-700/30 transition",
                  index % 2 === 0 ? "bg-slate-800/40" : "bg-slate-800/20"
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/30 to-orange-600/20 flex items-center justify-center">
                      <Ticket className="w-5 h-5 text-orange-400" />
                    </div>
                    <span className="text-white font-medium">{booking.movieTitle}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>{booking.showtime}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>{booking.seats.join(', ')}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-orange-400 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    <span>{booking.totalPrice.toFixed(2)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold border",
                    getStatusColor(booking.status)
                  )}>
                    {booking.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {bookings.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
            <Ticket className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-400 text-lg font-medium">No bookings yet</p>
          <p className="text-slate-500 text-sm mt-1">Customer bookings will appear here</p>
        </div>
      )}
    </div>
  )
}
