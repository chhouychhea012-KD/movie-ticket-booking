'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import PaymentSummary from '@/components/payment-summary'

// Dynamic import for PaymentForm to avoid SSR issues
const PaymentForm = dynamic(() => import('@/components/payment-form'), {
  ssr: false,
  loading: () => (
    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-slate-700 rounded w-1/4"></div>
        <div className="h-20 bg-slate-700 rounded"></div>
        <div className="h-12 bg-slate-700 rounded"></div>
      </div>
    </div>
  )
})

type PaymentMethod = 'visa' | 'bakong' | 'abapayway'

interface BookingData {
  movieTitle: string
  showtime: string
  seats: string[]
  totalAmount: number
  ticketPrice: number
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isInitialized = useRef(false)
  
  // Check if we have a bookingId in the URL
  const bookingId = searchParams.get('bookingId')
  
  // State for booking data
  const [bookingData, setBookingData] = useState<BookingData>({
    movieTitle: 'Movie Ticket',
    showtime: '7:00 PM',
    seats: [],
    totalAmount: 0,
    ticketPrice: 12.99
  })
  
  // Try to get params from URL
  const urlMovieTitle = searchParams.get('movie') || ''
  const urlAmount = parseFloat(searchParams.get('amount') || '0')
  const urlSeats = searchParams.get('seats')?.split(',').filter(Boolean) || []
  const urlShowtime = searchParams.get('showtime') || ''

  // Helper function to extract seat numbers from various formats
  const extractSeatNumbers = (seats: any[]): string[] => {
    if (!seats || !Array.isArray(seats)) return []
    return seats.map(seat => {
      if (typeof seat === 'string') return seat
      if (typeof seat === 'object' && seat !== null) {
        return seat.seatNumber || seat.seat_id || 'Unknown'
      }
      return String(seat)
    })
  }

  // Load booking data from localStorage if bookingId exists, otherwise use URL params
  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true
    
    if (bookingId) {
      // Try to get booking from localStorage
      const existingBookings = localStorage.getItem('bookings')
      if (existingBookings) {
        const bookings = JSON.parse(existingBookings)
        const booking = bookings.find((b: any) => b.id === bookingId)
        
        if (booking) {
          // Handle seats - could be string[] or objects
          const extractedSeats = extractSeatNumbers(booking.seats)
          setBookingData({
            movieTitle: booking.movieTitle || 'Movie Ticket',
            showtime: booking.showtime || '7:00 PM',
            seats: extractedSeats,
            totalAmount: booking.totalPrice || 0,
            ticketPrice: booking.ticketPrice || 12.99
          })
          return
        }
      }
    }
    
    // Use URL params if no booking found
    if (urlMovieTitle || urlAmount > 0 || urlSeats.length > 0) {
      setBookingData({
        movieTitle: urlMovieTitle || 'Movie Ticket',
        showtime: urlShowtime || '7:00 PM',
        seats: urlSeats.length > 0 ? urlSeats : ['A3'],
        totalAmount: urlAmount > 0 ? urlAmount : 19.48,
        ticketPrice: urlAmount > 0 && urlSeats.length > 0 ? urlAmount / urlSeats.length : 12.99
      })
    } else {
      // Default demo data
      setBookingData({
        movieTitle: 'The Quantum Paradox',
        showtime: '7:00 PM',
        seats: ['A3'],
        totalAmount: 19.48,
        ticketPrice: 19.48
      })
    }
  }, [bookingId, urlMovieTitle, urlAmount, urlSeats, urlShowtime])

  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const handlePaymentSubmit = async (paymentData: {
    method: PaymentMethod
    amount: number
    cardNumber?: string
    expiryDate?: string
    cvv?: string
    cardholderName?: string
    phoneNumber?: string
    accountName?: string
  }) => {
    setError('')
    setProcessing(true)

    try {
      // Determine which API endpoint to call based on payment method
      let apiEndpoint = '/api/payments/visa'
      if (paymentData.method === 'bakong') {
        apiEndpoint = '/api/payments/bakong'
      } else if (paymentData.method === 'abapayway') {
        apiEndpoint = '/api/payments/abaPayway'
      }

      // Make API call
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          orderId: `ORD_${Date.now()}`,
          customerName: paymentData.cardholderName || paymentData.accountName || 'Customer',
          customerEmail: 'customer@example.com',
          cardNumber: paymentData.cardNumber,
          expiryDate: paymentData.expiryDate,
          cvv: paymentData.cvv,
          phoneNumber: paymentData.phoneNumber,
          returnUrl: typeof window !== 'undefined' ? `${window.location.origin}/payment/success` : 'http://localhost:3000/payment/success',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Payment failed')
      }

      // Create booking
      const booking = {
        id: Date.now().toString(),
        movieTitle: bookingData.movieTitle,
        showtime: bookingData.showtime,
        seats: bookingData.seats,
        ticketPrice: bookingData.ticketPrice,
        totalPrice: bookingData.totalAmount,
        bookingDate: new Date().toISOString(),
        status: 'confirmed' as const,
        paymentMethod: paymentData.method,
        paymentId: result.paymentId,
      }

      // Save to localStorage
      const existingBookings = localStorage.getItem('bookings')
      const bookings = existingBookings ? JSON.parse(existingBookings) : []
      bookings.push(booking)
      localStorage.setItem('bookings', JSON.stringify(bookings))

      setProcessing(false)
      router.push(`/booking-confirmation?bookingId=${booking.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.')
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Payment</h1>
          <p className="text-slate-400 text-lg">Complete your booking securely</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-500 text-sm font-medium">Seats</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-600"></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full">
              <span className="text-orange-500 text-sm font-medium">2</span>
              <span className="text-orange-500 text-sm font-medium">Payment</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-600"></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-full">
              <span className="text-slate-400 text-sm">3</span>
              <span className="text-slate-400 text-sm">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <PaymentForm 
              onSubmit={handlePaymentSubmit} 
              isProcessing={processing}
              totalAmount={bookingData.totalAmount}
            />
            {error && (
              <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PaymentSummary
                movieTitle={bookingData.movieTitle}
                showtime={bookingData.showtime}
                seats={bookingData.seats}
                totalAmount={bookingData.totalAmount}
              />
              
              {/* Security Info */}
              <div className="mt-4 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Secure Payment</p>
                    <p className="text-slate-500">256-bit SSL encryption</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
