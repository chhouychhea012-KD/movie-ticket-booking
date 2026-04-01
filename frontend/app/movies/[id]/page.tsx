'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { Calendar, Clock, Star, MapPin, Ticket, Heart, Share2, Play, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Movie, Showtime } from '@/types'
import TrailerModal from '@/components/trailer-modal'

export default function MovieDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { movies, getShowtimes, addFavoriteMovie, removeFavoriteMovie, user, cinemas, cities } = useApp()
  
  const movieId = params.id as string
  const [movie, setMovie] = useState<Movie | undefined>()
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [showtimes, setShowtimes] = useState<Showtime[]>([])
  const [selectedCinema, setSelectedCinema] = useState<string>('')
  const [showTrailerModal, setShowTrailerModal] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (movieId) {
      const foundMovie = movies.find(m => m.id === movieId)
      setMovie(foundMovie)
    }
  }, [movieId, movies])

  useEffect(() => {
    if (movie) {
      const times = getShowtimes(movie.id, selectedCinema || undefined, selectedDate || undefined)
      setShowtimes(times)
    }
  }, [movie, selectedDate, selectedCinema, getShowtimes])

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Movie not found</p>
          <Link href="/" className="text-orange-500 hover:text-orange-400">
            Go back to movies
          </Link>
        </div>
      </div>
    )
  }

  const isFavorite = user?.favoriteMovies.includes(movie.id)

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      date: date.toISOString().split('T')[0],
      display: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
      isToday: i === 0
    }
  })

  const handleBookTicket = (showtime: Showtime) => {
    router.push(`/booking/new?movieId=${movie.id}&showtimeId=${showtime.id}&cinemaId=${showtime.cinemaId}&date=${showtime.date}&time=${showtime.startTime}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Hero Section with Backdrop */}
      <div className="relative">
        <div className="absolute inset-0 h-[500px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
          {movie.backdrop ? (
            <img src={movie.backdrop} alt={movie.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
          )}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-32 pb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="w-64 h-96 rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700/50">
                <img 
                  src={movie.poster} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {movie.ageRating && (
                  <span className="px-2 py-1 bg-slate-700/80 text-slate-300 text-sm rounded">
                    {movie.ageRating}
                  </span>
                )}
                <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-sm rounded">
                  {movie.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">{movie.title}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-slate-300">
                <div className="flex items-center gap-1">
                  <Clock className="w-5 h-5" />
                  <span>{movie.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span>{movie.rating}/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {(Array.isArray(movie.genre) ? movie.genre : String(movie.genre || '').split(',')).map((g, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm">
                    {g}
                  </span>
                ))}
              </div>

              <p className="text-slate-300 text-lg mb-6">{movie.synopsis}</p>

              {/* Director & Cast */}
              <div className="mb-6">
                <p className="text-slate-400 text-sm mb-2">Director: <span className="text-white">{movie.director}</span></p>
                <p className="text-slate-400 text-sm">Cast: <span className="text-white">{(Array.isArray(movie.cast) ? movie.cast : String(movie.cast || '').split(',')).join(', ')}</span></p>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => isFavorite ? removeFavoriteMovie(movie.id) : addFavoriteMovie(movie.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                    isFavorite 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Favorited' : 'Add to Favorites'}
                </button>
                <button 
                  onClick={async () => {
                    const url = `${window.location.origin}/movies/${movie.id}`
                    try {
                      if (navigator.share) {
                        await navigator.share({
                          title: movie.title,
                          text: `Check out ${movie.title} - ${movie.synopsis}`,
                          url
                        })
                      } else {
                        await navigator.clipboard.writeText(url)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                      }
                    } catch (err) {
                      await navigator.clipboard.writeText(url)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-slate-300 hover:bg-slate-700 rounded-xl transition"
                >
                  <Share2 className="w-5 h-5" />
                  {copied ? 'Copied!' : 'Share'}
                </button>
                {movie.trailerUrl && (
                  <button 
                    onClick={() => setShowTrailerModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30 rounded-xl transition"
                  >
                    <Play className="w-5 h-5" />
                    Watch Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showtime Selection */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white mb-6">Select Showtime</h2>

        {/* Date Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Select Date</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {dates.map((d) => (
              <button
                key={d.date}
                onClick={() => setSelectedDate(d.date)}
                className={`flex-shrink-0 px-4 py-3 rounded-xl border transition ${
                  selectedDate === d.date
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : d.isToday
                    ? 'bg-slate-700/50 border-slate-600 text-white hover:border-orange-500'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <span className="block text-sm font-medium">{d.display}</span>
                {d.isToday && <span className="block text-xs opacity-70">Today</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Cinema Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Select Cinema</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCinema('')}
              className={`px-4 py-2 rounded-xl border transition ${
                selectedCinema === ''
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              All Cinemas
            </button>
            {cinemas.map((cinema) => (
              <button
                key={cinema.id}
                onClick={() => setSelectedCinema(cinema.id)}
                className={`px-4 py-2 rounded-xl border transition ${
                  selectedCinema === cinema.id
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                {cinema.name}
              </button>
            ))}
          </div>
        </div>

        {/* Showtimes Grid */}
        {showtimes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showtimes.map((showtime) => {
              const cinema = cinemas.find(c => c.id === showtime.cinemaId)
              const isAvailable = showtime.availableSeats > 0
              
              return (
                <div 
                  key={showtime.id}
                  className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 hover:border-orange-500/50 transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-white font-semibold">{cinema?.name}</h4>
                      <p className="text-slate-400 text-sm flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {cinema?.city}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      isAvailable 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {isAvailable ? `${showtime.availableSeats} seats` : 'Sold Out'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-white">{showtime.startTime}</div>
                    <div className="text-orange-500 font-semibold">${showtime.price}</div>
                  </div>

                  <button
                    onClick={() => handleBookTicket(showtime)}
                    disabled={!isAvailable}
                    className={`w-full py-3 rounded-xl font-semibold transition ${
                      isAvailable
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isAvailable ? 'Book Now' : 'Sold Out'}
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <Ticket className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No showtimes available for this selection</p>
            <p className="text-slate-500 text-sm mt-2">Try selecting a different date or cinema</p>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailerModal && movie?.trailerUrl && (
        <TrailerModal
          isOpen={showTrailerModal}
          onClose={() => setShowTrailerModal(false)}
          trailerUrl={movie.trailerUrl}
          title={movie.title}
        />
      )}
    </div>
  )
}