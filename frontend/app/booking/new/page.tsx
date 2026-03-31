'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import EnhancedSeatMap from '@/components/enhanced-seat-map'
import { ChevronLeft, Calendar, Clock, MapPin, Ticket, Film, Loader2 } from 'lucide-react'

export default function BookingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { getMovieById, getCinemaById } = useApp()
  
  const movieId = searchParams.get('movieId') || ''
  const showtimeId = searchParams.get('showtimeId') || ''
  const cinemaId = searchParams.get('cinemaId') || ''
  const date = searchParams.get('date') || ''
  const time = searchParams.get('time') || ''

  const [movie, setMovie] = useState<any>(null)
  const [cinema, setCinema] = useState<any>(null)

  useEffect(() => {
    if (movieId) {
      const foundMovie = getMovieById(movieId)
      setMovie(foundMovie)
    }
    if (cinemaId) {
      const foundCinema = getCinemaById(cinemaId)
      setCinema(foundCinema)
    }
  }, [movieId, cinemaId, getMovieById, getCinemaById])

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          <span className="text-white">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Movie Details
        </button>

        {/* Movie Info Header */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-24 h-36 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
              <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">{movie.title}</h1>
              
              <div className="flex flex-wrap gap-4 text-slate-400">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {date ? new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Not selected'}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {time || 'Not selected'}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {cinema?.name || 'Not selected'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {movie.genre.map((g: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Seat Selection */}
        <EnhancedSeatMap 
          showtimeId={showtimeId}
          cinemaId={cinemaId}
          movieId={movieId}
          date={date}
          time={time}
        />
      </div>
    </div>
  )
}