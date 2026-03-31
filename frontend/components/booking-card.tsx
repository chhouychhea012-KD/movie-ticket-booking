'use client'

import Link from 'next/link'
import { Booking } from '@/types/booking'

interface BookingCardProps {
  booking: Booking
  showActions?: boolean
}

export default function BookingCard({ booking, showActions = false }: BookingCardProps) {
  const bookingDate = new Date(booking.bookingDate).toLocaleDateString()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      case 'used': return 'bg-blue-500'
      case 'expired': return 'bg-slate-500'
      default: return 'bg-slate-500'
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-orange-500 transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{booking.movieTitle}</h3>
          <p className="text-slate-400 text-sm">Booked on {bookingDate}</p>
        </div>
        <span className={`${getStatusColor(booking.status)} text-white text-xs font-semibold px-3 py-1 rounded`}>
          {booking.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-slate-400 text-sm">Showtime</p>
          <p className="text-white font-semibold">{booking.showtime}</p>
        </div>
        <div>
          <p className="text-slate-400 text-sm">Seats</p>
          <p className="text-white font-semibold">{booking.seats.join(', ')}</p>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-4 flex justify-between items-center">
        <div>
          <p className="text-slate-400 text-sm">Total Amount</p>
          <p className="text-orange-500 font-bold text-lg">${booking.totalPrice.toFixed(2)}</p>
        </div>
        <Link 
          href={`/tickets/${booking.id}`}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-semibold transition"
        >
          View Ticket
        </Link>
      </div>
    </div>
  )
}
