'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar, ChevronLeft, Clock, Loader2, MapPin, Ticket } from 'lucide-react'
import EnhancedSeatMap from '@/components/enhanced-seat-map'
import { useApp } from '@/context/AppContext'

function BookingPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { getMovieById, getCinemaById, user } = useApp()

  const movieId = searchParams.get('movieId') || ''
  const showtimeId = searchParams.get('showtimeId') || ''
  const cinemaId = searchParams.get('cinemaId') || ''
  const date = searchParams.get('date') || ''
  const time = searchParams.get('time') || ''

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const movie = getMovieById(movieId)
  const cinema = getCinemaById(cinemaId)

  useEffect(() => {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    if ((!storedUser && !user) || !storedToken) {
      router.push(`/auth/login?redirect=/booking/new?movieId=${movieId}&showtimeId=${showtimeId}&cinemaId=${cinemaId}&date=${date}&time=${time}`)
      return
    }

    setIsAuthenticated(true)
  }, [user, router, movieId, showtimeId, cinemaId, date, time])

  if (!isAuthenticated || !movie) {
    return (
      <div className="cinema-page flex items-center justify-center pt-20">
        <div className="flex items-center gap-3 text-slate-300">
          <Loader2 className="h-5 w-5 animate-spin text-[#e50914]" />
          Preparing booking
        </div>
      </div>
    )
  }

  return (
    <div className="cinema-page pt-20">
      <div className="cinema-container pb-16">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white">
          <ChevronLeft className="h-4 w-4" />
          Back to showtimes
        </button>

        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span className="text-[#f5c451]">Movie</span>
          <span>/</span>
          <span className="text-[#f5c451]">Cinema</span>
          <span>/</span>
          <span className="text-[#f5c451]">Seats</span>
          <span>/</span>
          <span>Payment</span>
          <span>/</span>
          <span>Ticket</span>
        </div>

        <div className="cinema-card mb-8 overflow-hidden">
          <div className="grid gap-5 p-5 md:grid-cols-[96px_1fr_auto] md:items-center">
            <div className="h-36 w-24 overflow-hidden rounded-xl bg-[#1b1f26]">
              <img src={movie.poster} alt={movie.title} className="h-full w-full object-cover" />
            </div>

            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="cinema-chip">Seat Selection</span>
                {movie.ageRating && <span className="cinema-chip">{movie.ageRating}</span>}
              </div>
              <h1 className="text-2xl font-semibold text-white md:text-3xl">{movie.title}</h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-500" />{date ? new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Date'}</span>
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-500" />{time || 'Time'}</span>
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-500" />{cinema?.name || 'Cinema'}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#252a32] bg-[#101318] p-4 text-center">
              <Ticket className="mx-auto h-6 w-6 text-[#e50914]" />
              <p className="mt-2 text-xs text-slate-500">Base ticket</p>
              <p className="text-xl font-semibold text-white">$12.99</p>
            </div>
          </div>
        </div>

        <EnhancedSeatMap showtimeId={showtimeId} cinemaId={cinemaId} movieId={movieId} date={date} time={time} />
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={null}>
      <BookingPageContent />
    </Suspense>
  )
}
