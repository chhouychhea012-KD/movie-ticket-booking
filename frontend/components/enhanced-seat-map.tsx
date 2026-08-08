'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, ShieldCheck, Ticket } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Seat } from '@/types'

interface SeatMapProps {
  showtimeId: string
  cinemaId: string
  movieId: string
  date: string
  time: string
}

const basePrice = 12.99

export default function EnhancedSeatMap({ showtimeId, cinemaId, movieId, date, time }: SeatMapProps) {
  const router = useRouter()
  const { getSeats, getMovieById, getCinemaById, createBooking } = useApp()
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const movie = getMovieById(movieId)
  const cinema = getCinemaById(cinemaId)

  useEffect(() => {
    setSeats(getSeats(showtimeId))
  }, [showtimeId, getSeats])

  const rows = useMemo(() => Array.from(new Set(seats.map((seat) => seat.seatNumber.charAt(0)))).sort(), [seats])

  const seatPrice = (seat: Seat) => basePrice * seat.priceModifier
  const total = selectedSeats.reduce((sum, seat) => sum + seatPrice(seat), 0)
  const selectedNumbers = selectedSeats.map((seat) => seat.seatNumber)

  const seatTypeLabel = (type: Seat['type']) => {
    if (type === 'vip') return 'VIP'
    if (type === 'couple') return 'Couple'
    if (type === 'accessible') return 'Accessible'
    return 'Standard'
  }

  const handleSeatClick = (seat: Seat) => {
    if (seat.status !== 'available') return
    setError('')
    setSelectedSeats((current) => (
      current.some((item) => item.id === seat.id)
        ? current.filter((item) => item.id !== seat.id)
        : [...current, seat]
    ))
  }

  const seatClasses = (seat: Seat) => {
    const isSelected = selectedSeats.some((item) => item.id === seat.id)
    const isUnavailable = seat.status !== 'available'

    if (isUnavailable) return 'cursor-not-allowed border-[#252a32] bg-[#252a32] text-slate-600 opacity-55'
    if (isSelected) return 'border-[#e50914] bg-[#e50914] text-white shadow-lg shadow-[#e50914]/25'
    if (seat.type === 'vip') return 'border-[#f5c451]/70 bg-[#2a2313] text-[#f5c451] hover:border-[#f5c451]'
    if (seat.type === 'couple') return 'border-[#505763] bg-[#1f2631] text-slate-200 hover:border-[#e50914]'
    if (seat.type === 'accessible') return 'border-[#3f6f8f] bg-[#132131] text-slate-200 hover:border-[#e50914]'
    return 'border-[#2f3540] bg-[#151a21] text-slate-300 hover:border-[#e50914] hover:text-white'
  }

  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0 || !movie || !cinema) return

    setIsProcessing(true)
    setError('')

    try {
      const booking = await createBooking({
        movieId,
        movieTitle: movie.title,
        cinemaId,
        cinemaName: cinema.name,
        screenId: '1',
        showtimeId,
        showtime: `${date} ${time}`,
        seats: selectedSeats.map((seat) => ({
          seatId: seat.id,
          seatNumber: seat.seatNumber,
          seatType: seat.type,
          price: seatPrice(seat),
        })),
        ticketPrice: basePrice,
        totalPrice: total,
        paymentMethod: 'card',
      })

      const paymentDraft = {
        id: booking.id,
        movieTitle: movie.title,
        moviePoster: movie.poster,
        cinemaName: cinema.name,
        hall: 'Hall 1',
        showtime: `${date} ${time}`,
        seats: selectedNumbers,
        ticketPrice: basePrice,
        totalPrice: total,
      }
      localStorage.setItem('pendingBookingPayment', JSON.stringify(paymentDraft))

      const params = new URLSearchParams({
        bookingId: booking.id,
        movie: movie.title,
        poster: movie.poster,
        cinema: cinema.name,
        hall: 'Hall 1',
        showtime: `${date} ${time}`,
        seats: selectedNumbers.join(','),
        amount: total.toFixed(2),
      })

      router.push(`/payment?${params.toString()}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="cinema-card p-5 sm:p-6">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 h-2 w-full max-w-xl rounded-full bg-white shadow-[0_0_28px_rgba(255,255,255,0.28)]" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Screen</p>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-3 text-xs text-slate-400">
          <Legend color="bg-[#151a21] border-[#2f3540]" label="Standard" />
          <Legend color="bg-[#2a2313] border-[#f5c451]" label="VIP" />
          <Legend color="bg-[#1f2631] border-[#505763]" label="Couple" />
          <Legend color="bg-[#e50914] border-[#e50914]" label="Selected" />
          <Legend color="bg-[#252a32] border-[#252a32] opacity-60" label="Reserved" />
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="mx-auto w-max space-y-2">
            {rows.map((row) => (
              <div key={row} className="grid grid-cols-[24px_repeat(12,34px)_24px] items-center gap-2">
                <span className="text-center text-xs font-semibold text-slate-500">{row}</span>
                {Array.from({ length: 12 }).map((_, index) => {
                  const seatNumber = `${row}${index + 1}`
                  const seat = seats.find((item) => item.seatNumber === seatNumber)

                  if (!seat) return <div key={seatNumber} className="h-8 w-8" />

                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.status !== 'available'}
                      title={`${seat.seatNumber} - ${seatTypeLabel(seat.type)} - $${seatPrice(seat).toFixed(2)}`}
                      className={`flex h-8 w-8 items-center justify-center rounded-t-xl rounded-b-md border text-[10px] font-semibold transition ${index === 3 || index === 9 ? 'ml-4' : ''} ${seatClasses(seat)}`}
                    >
                      {selectedSeats.some((item) => item.id === seat.id) ? <Check className="h-3.5 w-3.5" /> : index + 1}
                    </button>
                  )
                })}
                <span className="text-center text-xs font-semibold text-slate-500">{row}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="cinema-card h-fit p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1b1f26] text-[#e50914]">
            <Ticket className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Ticket Summary</h3>
            <p className="text-xs text-slate-500">Review before payment</p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <SummaryRow label="Movie" value={movie?.title || 'Movie'} />
          <SummaryRow label="Cinema" value={cinema?.name || 'Cinema'} />
          <SummaryRow label="Date & Time" value={`${date || 'Date'} ${time || ''}`.trim()} />
          <div>
            <p className="text-slate-500">Seats</p>
            {selectedSeats.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <span key={seat.id} className="rounded-lg bg-[#e50914] px-2.5 py-1 text-xs font-semibold text-white">
                    {seat.seatNumber}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-white">Select your seats</p>
            )}
          </div>
        </div>

        <div className="my-5 border-t border-[#252a32]" />

        <div className="space-y-3 text-sm">
          <SummaryRow label="Tickets" value={`${selectedSeats.length}`} />
          <SummaryRow label="Subtotal" value={`$${total.toFixed(2)}`} />
          <div className="flex items-center justify-between pt-2">
            <span className="font-semibold text-white">Total</span>
            <span className="text-2xl font-semibold text-[#f5c451]">${total.toFixed(2)}</span>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-[#e50914]/30 bg-[#e50914]/10 p-3 text-sm text-[#ff8f94]">
            {error}
          </div>
        )}

        <button
          onClick={handleProceedToPayment}
          disabled={selectedSeats.length === 0 || isProcessing}
          className={`mt-5 w-full ${selectedSeats.length === 0 || isProcessing ? 'cursor-not-allowed rounded-xl bg-[#252a32] px-5 py-3 font-semibold text-slate-500' : 'cinema-button-primary'}`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Preparing
            </span>
          ) : (
            'Continue to Payment'
          )}
        </button>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-[#f5c451]" />
          Seats are held while you complete checkout.
        </div>
      </aside>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`h-4 w-4 rounded-t-md rounded-b-sm border ${color}`} />
      {label}
    </span>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-white">{value}</p>
    </div>
  )
}
