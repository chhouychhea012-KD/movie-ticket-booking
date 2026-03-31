'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Seat, Showtime } from '@/types'
import { Check, X, Info, ChevronLeft, Loader2 } from 'lucide-react'

interface SeatMapProps {
  showtimeId: string
  cinemaId: string
  movieId: string
  date: string
  time: string
}

export default function EnhancedSeatMap({ showtimeId, cinemaId, movieId, date, time }: SeatMapProps) {
  const router = useRouter()
  const { getSeats, getMovieById, getCinemaById, createBooking } = useApp()
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const movie = getMovieById(movieId)
  const cinema = getCinemaById(cinemaId)

  useEffect(() => {
    const availableSeats = getSeats(showtimeId)
    setSeats(availableSeats)
  }, [showtimeId, getSeats])

  // Group seats by row
  const rows = Array.from(new Set(seats.map(s => s.seatNumber.charAt(0)))).sort()
  const seatsPerRow = 12

  const getSeatTypeInfo = (type: Seat['type']) => {
    switch (type) {
      case 'vip':
        return { label: 'VIP', color: 'bg-purple-500', priceMultiplier: 1.5, description: 'Premium seating with extra legroom' }
      case 'couple':
        return { label: 'Couple', color: 'bg-pink-500', priceMultiplier: 1.3, description: 'Double seats for couples' }
      case 'accessible':
        return { label: 'Accessible', color: 'bg-blue-500', priceMultiplier: 1, description: 'Wheelchair accessible' }
      default:
        return { label: 'Regular', color: 'bg-green-500', priceMultiplier: 1, description: 'Standard seating' }
    }
  }

  const handleSeatClick = (seat: Seat) => {
    if (seat.status !== 'available') return

    const isSelected = selectedSeats.some(s => s.id === seat.id)
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id))
    } else {
      setSelectedSeats([...selectedSeats, seat])
    }
  }

  const basePrice = 12.99
  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => {
      return total + (basePrice * seat.priceModifier)
    }, 0)
  }

  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0) return
    
    setIsProcessing(true)
    
    try {
      const booking = await createBooking({
        movieId,
        movieTitle: movie?.title || '',
        cinemaId,
        cinemaName: cinema?.name || '',
        screenId: '1',
        showtimeId,
        showtime: `${date} ${time}`,
        seats: selectedSeats.map(s => ({
          seatId: s.id,
          seatNumber: s.seatNumber,
          seatType: s.type,
          price: basePrice * s.priceModifier,
        })),
        ticketPrice: basePrice,
        totalPrice: calculateTotal(),
        paymentMethod: 'card',
      })
      
      router.push(`/payment?bookingId=${booking.id}`)
    } catch (error) {
      console.error('Booking failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getSeatStatusColor = (seat: Seat) => {
    if (seat.status === 'booked') return 'bg-slate-600 cursor-not-allowed opacity-50'
    if (selectedSeats.some(s => s.id === seat.id)) return 'bg-orange-500 hover:bg-orange-600'
    
    const typeInfo = getSeatTypeInfo(seat.type)
    return `${typeInfo.color} hover:opacity-80`
  }

  return (
    <div className="space-y-6">
      {/* Screen */}
      <div className="flex justify-center mb-8">
        <div className="relative w-80 lg:w-96">
          <div className="w-full h-2 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mb-2" />
          <p className="text-center text-slate-400 text-sm">SCREEN</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-green-500" />
          <span className="text-slate-300 text-sm">Regular - ${basePrice}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-purple-500" />
          <span className="text-slate-300 text-sm">VIP - ${(basePrice * 1.5).toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-pink-500" />
          <span className="text-slate-300 text-sm">Couple - ${(basePrice * 1.3).toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-orange-500" />
          <span className="text-slate-300 text-sm">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-slate-600 opacity-50" />
          <span className="text-slate-300 text-sm">Booked</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-max">
          {rows.map((row) => (
            <div key={row} className="flex items-center gap-2 mb-2">
              <span className="w-6 text-slate-400 flex items-center justify-center text-sm font-bold">
                {row}
              </span>
              
              {Array.from({ length: seatsPerRow }).map((_, i) => {
                const seatNumber = `${row}${i + 1}`
                const seat = seats.find(s => s.seatNumber === seatNumber)
                
                if (!seat) {
                  return <div key={i} className="w-7 h-7" />
                }

                return (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.status === 'booked'}
                    className={`w-7 h-7 rounded transition-all ${getSeatStatusColor(seat)}`}
                    title={`${seat.seatNumber} - ${getSeatTypeInfo(seat.type).label} - $${(basePrice * seat.priceModifier).toFixed(2)}`}
                  />
                )
              })}
              
              <span className="w-6 text-slate-400 flex items-center justify-center text-sm font-bold">
                {row}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Selection Summary */}
      <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Selected Seats</h3>
            {selectedSeats.length === 0 ? (
              <p className="text-slate-400">Click on available seats to select</p>
            ) : (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <span 
                      key={seat.id}
                      className={`px-3 py-1 rounded-full text-white text-sm ${getSeatTypeInfo(seat.type).color}`}
                    >
                      {seat.seatNumber}
                    </span>
                  ))}
                </div>
                <div className="text-slate-400 text-sm">
                  {selectedSeats.length} seat(s) • ${calculateTotal().toFixed(2)}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleProceedToPayment}
            disabled={selectedSeats.length === 0 || isProcessing}
            className={`px-8 py-3 rounded-xl font-semibold transition ${
              selectedSeats.length === 0 || isProcessing
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </span>
            ) : (
              `Proceed to Payment ($${calculateTotal().toFixed(2)})`
            )}
          </button>
        </div>
      </div>
    </div>
  )
}