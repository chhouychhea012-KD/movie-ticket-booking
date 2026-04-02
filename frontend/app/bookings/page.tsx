'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BookingCard from '@/components/booking-card'
import { Booking } from '@/types/booking'
import { useApp } from '@/context/AppContext'

export default function BookingsPage() {
  const router = useRouter()
  const { user } = useApp()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    
    if (!storedUser && !user) {
      router.push(`/auth/login?redirect=/bookings`)
      return
    }

    const storedBookings = localStorage.getItem('bookings')
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings))
    }
    setLoading(false)
  }, [user, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Bookings</h1>
          <p className="text-slate-400">View and manage your movie tickets</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-12 text-center">
            <p className="text-slate-400 text-lg">No bookings yet</p>
            <p className="text-slate-500 mt-2">Start booking tickets to see them here</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
