'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Booking } from '@/types/booking'

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedBookings = localStorage.getItem('bookings')
    if (storedBookings && bookingId) {
      const bookings: Booking[] = JSON.parse(storedBookings)
      const found = bookings.find(b => b.id === bookingId)
      setBooking(found || null)
    }
    setLoading(false)
  }, [bookingId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Booking not found</p>
          <Link href="/" className="text-orange-500 hover:text-orange-600">
            Go back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-slate-800 rounded-lg p-12 border-2 border-green-500 text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">Booking Confirmed</h1>
          <p className="text-slate-400 mb-8">Your movie ticket has been successfully booked!</p>

          <div className="bg-slate-700 rounded p-6 mb-8 text-left">
            <div className="mb-4">
              <p className="text-slate-400 text-sm">Movie</p>
              <p className="text-white text-lg font-semibold">{booking.movieTitle}</p>
            </div>

            <div className="mb-4">
              <p className="text-slate-400 text-sm">Showtime</p>
              <p className="text-white text-lg font-semibold">{booking.showtime}</p>
            </div>

            <div className="mb-4">
              <p className="text-slate-400 text-sm">Seats</p>
              <p className="text-white text-lg font-semibold">{booking.seats.join(', ')}</p>
            </div>

            <div className="border-t border-slate-600 pt-4">
              <p className="text-slate-400 text-sm">Total Amount Paid</p>
              <p className="text-orange-500 text-2xl font-bold">${booking.totalPrice.toFixed(2)}</p>
            </div>

            <div className="mt-4 p-4 bg-slate-800 rounded text-center">
              <p className="text-slate-400 text-sm">Booking ID</p>
              <p className="text-white font-mono text-sm">{booking.id}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href="/bookings"
              className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded font-semibold transition"
            >
              View All Bookings
            </Link>
            <Link
              href="/"
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded font-semibold transition"
            >
              Book More
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Important Information</h2>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>✓ Please arrive 15 minutes before the showtime</li>
            <li>✓ Bring a valid ID for verification</li>
            <li>✓ Your booking confirmation has been sent to your email</li>
            <li>✓ Cancellations must be made at least 2 hours before showtime</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
