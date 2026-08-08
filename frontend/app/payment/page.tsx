'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Check, CreditCard, Loader2, ShieldCheck } from 'lucide-react'
import PaymentSummary from '@/components/payment-summary'
import { dataStore } from '@/lib/data-store'

const PaymentForm = dynamic(() => import('@/components/payment-form'), {
  ssr: false,
  loading: () => (
    <div className="cinema-card p-8">
      <div className="flex items-center gap-3 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin text-[#e50914]" />
        Loading payment methods
      </div>
    </div>
  ),
})

type PaymentMethod = 'visa' | 'bakong' | 'abapayway'

interface BookingData {
  movieTitle: string
  moviePoster?: string
  cinemaName: string
  hall: string
  showtime: string
  seats: string[]
  totalAmount: number
  ticketPrice: number
}

function PaymentPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isInitialized = useRef(false)
  const bookingId = searchParams.get('bookingId')

  const [bookingData, setBookingData] = useState<BookingData>({
    movieTitle: 'Movie Ticket',
    cinemaName: 'Cinema',
    hall: 'Hall 1',
    showtime: '7:00 PM',
    seats: [],
    totalAmount: 0,
    ticketPrice: 0,
  })
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true

    const urlMovieTitle = searchParams.get('movie') || ''
    const urlPoster = searchParams.get('poster') || ''
    const urlCinema = searchParams.get('cinema') || ''
    const urlHall = searchParams.get('hall') || ''
    const urlAmount = Number.parseFloat(searchParams.get('amount') || '0')
    const urlSeats = searchParams.get('seats')?.split(',').filter(Boolean) || []
    const urlShowtime = searchParams.get('showtime') || ''

    const pendingDraft = localStorage.getItem('pendingBookingPayment')
    if (pendingDraft) {
      const draft = JSON.parse(pendingDraft)
      if (!bookingId || draft.id === bookingId) {
        const draftSeats = Array.isArray(draft.seats) ? draft.seats : []
        const draftTotal = Number(draft.totalPrice || draft.totalAmount || 0)
        setBookingData({
          movieTitle: draft.movieTitle || urlMovieTitle || 'Movie Ticket',
          moviePoster: draft.moviePoster || urlPoster || undefined,
          cinemaName: draft.cinemaName || urlCinema || 'Cinema',
          hall: draft.hall || urlHall || 'Hall 1',
          showtime: draft.showtime || urlShowtime || '7:00 PM',
          seats: draftSeats.length ? draftSeats : urlSeats,
          totalAmount: draftTotal || urlAmount,
          ticketPrice: draft.ticketPrice || (draftSeats.length ? draftTotal / draftSeats.length : 0),
        })
        return
      }
    }

    if (bookingId) {
      const existingBookings = localStorage.getItem('bookings')
      if (existingBookings) {
        const bookings = JSON.parse(existingBookings)
        const booking = bookings.find((item: any) => item.id === bookingId)

        if (booking) {
          const seats = extractSeatNumbers(booking.seats)
          setBookingData({
            movieTitle: booking.movieTitle || 'Movie Ticket',
            moviePoster: booking.moviePoster,
            cinemaName: booking.cinemaName || urlCinema || 'Cinema',
            hall: booking.hall || urlHall || 'Hall 1',
            showtime: booking.showtime || '7:00 PM',
            seats,
            totalAmount: booking.totalPrice || 0,
            ticketPrice: booking.ticketPrice || (seats.length ? (booking.totalPrice || 0) / seats.length : 0),
          })
          return
        }
      }
    }

    setBookingData({
      movieTitle: urlMovieTitle || 'Movie Ticket',
      moviePoster: urlPoster || undefined,
      cinemaName: urlCinema || 'Cinema',
      hall: urlHall || 'Hall 1',
      showtime: urlShowtime || '7:00 PM',
      seats: urlSeats,
      totalAmount: urlAmount,
      ticketPrice: urlAmount > 0 && urlSeats.length > 0 ? urlAmount / urlSeats.length : 0,
    })
  }, [bookingId, searchParams])

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
      let apiEndpoint = '/api/payments/visa'
      if (paymentData.method === 'bakong') apiEndpoint = '/api/payments/bakong'
      if (paymentData.method === 'abapayway') apiEndpoint = '/api/payments/abaPayway'

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      if (!response.ok) throw new Error(result.error || 'Payment failed')

      const booking = {
        id: bookingId || Date.now().toString(),
        movieTitle: bookingData.movieTitle,
        moviePoster: bookingData.moviePoster,
        cinemaName: bookingData.cinemaName,
        hall: bookingData.hall,
        showtime: bookingData.showtime,
        seats: bookingData.seats,
        ticketPrice: bookingData.ticketPrice,
        totalPrice: bookingData.totalAmount,
        bookingDate: new Date().toISOString(),
        status: 'confirmed' as const,
        paymentMethod: paymentData.method,
        paymentId: result.paymentId,
      }

      const existingBookings = localStorage.getItem('bookings')
      const bookings = existingBookings ? JSON.parse(existingBookings) : []
      const filteredBookings = bookings.filter((item: any) => item.id !== booking.id)
      localStorage.setItem('bookings', JSON.stringify([...filteredBookings, booking]))
      localStorage.removeItem('pendingBookingPayment')

      try {
        dataStore.initialize()
        dataStore.bookings.create({
          userId: 'guest',
          movieId: '1',
          movieTitle: bookingData.movieTitle,
          cinemaId: '1',
          cinemaName: bookingData.cinemaName,
          screenId: bookingData.hall,
          showtimeId: bookingId || '1',
          showtime: bookingData.showtime,
          seats: bookingData.seats.map((seat) => ({
            seatId: seat,
            seatNumber: seat,
            seatType: 'regular' as const,
            price: bookingData.ticketPrice,
          })),
          ticketPrice: bookingData.ticketPrice,
          totalPrice: bookingData.totalAmount,
          paymentMethod: 'card',
          paymentStatus: 'completed' as const,
          status: 'confirmed' as const,
        })
      } catch (storeError) {
        console.warn('Failed to save to dataStore:', storeError)
      }

      router.push(`/booking-confirmation?bookingId=${booking.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="cinema-page pt-20">
      <div className="cinema-container pb-16">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span className="text-[#f5c451]">Seats</span>
          <span>/</span>
          <span className="text-[#f5c451]">Payment</span>
          <span>/</span>
          <span>Ticket</span>
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white md:text-4xl">Checkout</h1>
            <p className="cinema-muted mt-2">Confirm your order and choose a secure payment method.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#252a32] bg-[#14171c] px-4 py-3 text-sm text-slate-300">
            <ShieldCheck className="h-4 w-4 text-[#f5c451]" />
            Secure payment
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="cinema-card mb-4 flex items-center gap-3 p-4 text-sm text-slate-400">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#122016] text-emerald-400">
                <Check className="h-4 w-4" />
              </div>
              <span>Seats selected. Complete payment to generate your digital ticket.</span>
            </div>

            <PaymentForm onSubmit={handlePaymentSubmit} isProcessing={processing} totalAmount={bookingData.totalAmount} />

            {error && (
              <div className="mt-4 rounded-xl border border-[#e50914]/30 bg-[#e50914]/10 p-4 text-sm text-[#ff8f94]">
                {error}
              </div>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <PaymentSummary
              movieTitle={bookingData.movieTitle}
              moviePoster={bookingData.moviePoster}
              cinemaName={bookingData.cinemaName}
              hall={bookingData.hall}
              showtime={bookingData.showtime}
              seats={bookingData.seats}
              totalAmount={bookingData.totalAmount}
            />
            <div className="cinema-card-soft p-4 text-sm text-slate-400">
              <div className="mb-2 flex items-center gap-2 font-semibold text-white">
                <CreditCard className="h-4 w-4 text-[#e50914]" />
                Accepted Methods
              </div>
              Visa, Bakong QR, and ABA PayWay are available.
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function extractSeatNumbers(seats: any[]): string[] {
  if (!seats || !Array.isArray(seats)) return []
  return seats.map((seat) => {
    if (typeof seat === 'string') return seat
    if (typeof seat === 'object' && seat !== null) return seat.seatNumber || seat.seat_id || 'Unknown'
    return String(seat)
  })
}

export default function PaymentPage() {
  return (
    <Suspense fallback={null}>
      <PaymentPageContent />
    </Suspense>
  )
}
