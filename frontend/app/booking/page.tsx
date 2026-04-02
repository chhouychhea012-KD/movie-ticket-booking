'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import SeatMap from '@/components/seat-map'
import BookingSummary from '@/components/booking-summary'
import { Movie } from '@/types/movie'
import { useApp } from '@/context/AppContext'

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useApp()
  const movieId = searchParams.get('movieId')
  const showtime = searchParams.get('showtime')
  
  const [movie, setMovie] = useState<Movie | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  useEffect(() => {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    
    if (!storedUser && !user) {
      router.push(`/auth/login?redirect=/booking?movieId=${movieId}&showtime=${showtime}`)
      return
    }

    const mockMovies: Record<string, Movie> = {
      '1': {
        id: '1',
        title: 'The Quantum Paradox',
        genre: 'Sci-Fi',
        rating: 8.5,
        duration: 148,
        poster: '/sci-fi-movie-poster.png',
        releaseDate: '2024-12-15',
        synopsis: 'A thrilling journey through time and space.',
        showtimes: ['10:00 AM', '1:30 PM', '4:00 PM', '7:00 PM', '9:30 PM'],
      },
    }

    if (movieId && mockMovies[movieId]) {
      setMovie(mockMovies[movieId])
    }
  }, [movieId, showtime, user, router])

  const ticketPrice = 12.99
  const totalPrice = selectedSeats.length * ticketPrice

  if (!movie) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Loading movie details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
          <p className="text-slate-400">Showtime: {showtime || 'Not selected'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SeatMap 
              movieId={movieId || ''} 
              showtime={showtime || ''} 
              onSeatsChange={setSelectedSeats}
            />
          </div>
          
          <div>
            <BookingSummary 
              movie={movie}
              showtime={showtime || ''}
              selectedSeats={selectedSeats}
              ticketPrice={ticketPrice}
              totalPrice={totalPrice}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
