'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import PaymentForm from '@/components/payment-form'
import PaymentSummary from '@/components/payment-summary'

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const movieTitle = searchParams.get('movie') || 'Movie Ticket'
  const totalAmount = parseFloat(searchParams.get('amount') || '0')
  const seats = searchParams.get('seats')?.split(',') || []
  const showtime = searchParams.get('showtime') || ''

  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const handlePaymentSubmit = async (cardDetails: {
    cardNumber: string
    expiryDate: string
    cvv: string
    cardholderName: string
  }) => {
    setError('')
    setProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create booking
      const booking = {
        id: Date.now().toString(),
        movieTitle,
        showtime,
        seats,
        ticketPrice: totalAmount / seats.length,
        totalPrice: totalAmount,
        bookingDate: new Date().toISOString(),
        status: 'confirmed' as const,
      }

      // Save to localStorage
      const existingBookings = localStorage.getItem('bookings')
      const bookings = existingBookings ? JSON.parse(existingBookings) : []
      bookings.push(booking)
      localStorage.setItem('bookings', JSON.stringify(bookings))

      setProcessing(false)
      router.push(`/booking-confirmation?bookingId=${booking.id}`)
    } catch (err) {
      setError('Payment failed. Please try again.')
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Payment</h1>
          <p className="text-slate-400">Complete your booking securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PaymentForm onSubmit={handlePaymentSubmit} isProcessing={processing} />
            {error && (
              <div className="mt-4 bg-red-500 text-white p-4 rounded">
                {error}
              </div>
            )}
          </div>

          <div>
            <PaymentSummary
              movieTitle={movieTitle}
              showtime={showtime}
              seats={seats}
              totalAmount={totalAmount}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
