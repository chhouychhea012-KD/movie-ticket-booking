'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Movie } from '@/types/movie'
import { Booking } from '@/types/booking'
import Link from 'next/link'

interface BookingSummaryProps {
  movie: Movie
  showtime: string
  selectedSeats: string[]
  ticketPrice: number
  totalPrice: number
}

export default function BookingSummary({
  movie,
  showtime,
  selectedSeats,
  ticketPrice,
  totalPrice,
}: BookingSummaryProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePayment = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat')
      return
    }

    const seatsParam = selectedSeats.join(',')
    router.push(
      `/payment?movie=${encodeURIComponent(movie.title)}&showtime=${encodeURIComponent(showtime)}&seats=${seatsParam}&amount=${totalPrice}`
    )
  }

  const handleQuickBooking = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat')
      return
    }

    setLoading(true)

    // Create booking without payment
    const booking: Booking = {
      id: Date.now().toString(),
      movieTitle: movie.title,
      showtime,
      seats: selectedSeats,
      ticketPrice,
      totalPrice,
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
    }

    const existingBookings = localStorage.getItem('bookings')
    const bookings = existingBookings ? JSON.parse(existingBookings) : []
    bookings.push(booking)
    localStorage.setItem('bookings', JSON.stringify(bookings))

    setTimeout(() => {
      setLoading(false)
      alert('Booking confirmed! Check your bookings page.')
      router.push('/bookings')
    }, 1500)
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 sticky top-24">
      <h3 className="text-xl font-bold text-white mb-6">Booking Summary</h3>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-slate-400 text-sm">Movie</p>
          <p className="text-white font-semibold">{movie.title}</p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Showtime</p>
          <p className="text-white font-semibold">{showtime}</p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Selected Seats</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedSeats.length === 0 ? (
              <p className="text-slate-500">No seats selected</p>
            ) : (
              selectedSeats.map((seat) => (
                <span key={seat} className="bg-orange-500 text-white text-sm px-3 py-1 rounded">
                  {seat}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-4 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-slate-400">Tickets ({selectedSeats.length})</span>
          <span className="text-white font-semibold">${(selectedSeats.length * ticketPrice).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-orange-500 font-bold">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={handlePayment}
          disabled={loading || selectedSeats.length === 0}
          className={`w-full py-3 rounded font-semibold transition ${
            loading || selectedSeats.length === 0
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          Pay Now
        </button>

        <button
          onClick={handleQuickBooking}
          disabled={loading || selectedSeats.length === 0}
          className={`w-full py-3 rounded font-semibold transition ${
            loading || selectedSeats.length === 0
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
              : 'bg-slate-700 hover:bg-slate-600 text-white'
          }`}
        >
          {loading ? 'Processing...' : 'Book Without Payment'}
        </button>
      </div>
    </div>
  )
}
