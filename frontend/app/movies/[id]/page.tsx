'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, Heart, MapPin, Play, Share2, Star, Ticket } from 'lucide-react'
import TrailerModal from '@/components/trailer-modal'
import { useApp } from '@/context/AppContext'
import { Movie, Showtime } from '@/types'
import { formatPreviewList, normalizeStringArray } from '@/lib/utils'

export default function MovieDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { movies, getShowtimes, addFavoriteMovie, removeFavoriteMovie, user, cinemas } = useApp()
  const movieId = params.id as string
  const today = new Date().toISOString().split('T')[0]
  const [movie, setMovie] = useState<Movie | undefined>()
  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedCinema, setSelectedCinema] = useState('')
  const [showtimes, setShowtimes] = useState<Showtime[]>([])
  const [showTrailer, setShowTrailer] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setMovie(movies.find((item) => item.id === movieId))
  }, [movieId, movies])

  useEffect(() => {
    if (!movie) return
    setShowtimes(getShowtimes(movie.id, selectedCinema || undefined, selectedDate || undefined))
  }, [getShowtimes, movie, selectedCinema, selectedDate])

  if (!movie) {
    return (
      <div className="cinema-page flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-xl font-semibold text-white">Movie not found</p>
          <Link href="/movies" className="mt-4 inline-flex text-sm font-semibold text-[#f23b43]">Back to movies</Link>
        </div>
      </div>
    )
  }

  const dates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() + index)
    const value = date.toISOString().split('T')[0]
    return {
      value,
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      day: date.toLocaleDateString('en-US', { day: '2-digit' }),
      active: selectedDate === value,
    }
  })

  const groupedShowtimes = cinemas
    .filter((cinema) => !selectedCinema || cinema.id === selectedCinema)
    .map((cinema) => ({
      cinema,
      times: showtimes.filter((showtime) => showtime.cinemaId === cinema.id),
    }))
    .filter((group) => group.times.length > 0)

  const genres = normalizeStringArray(movie.genre)
  const cast = normalizeStringArray(movie.cast).slice(0, 5)
  const isFavorite = Boolean(user?.favoriteMovies.includes(movie.id))

  const book = (showtime: Showtime) => {
    router.push(`/booking/new?movieId=${movie.id}&showtimeId=${showtime.id}&cinemaId=${showtime.cinemaId}&date=${showtime.date}&time=${showtime.startTime}`)
  }

  return (
    <div className="cinema-page">
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 h-[620px]">
          <img src={movie.backdrop || movie.poster} alt={movie.title} className="h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0b0d10_0%,rgba(11,13,16,0.92)_40%,rgba(11,13,16,0.58)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,#0b0d10_0%,rgba(11,13,16,0)_100%)]" />
        </div>

        <div className="cinema-container relative z-10 grid gap-8 py-16 lg:grid-cols-[280px_1fr] lg:py-24">
          <div className="aspect-[2/3] max-w-[280px] overflow-hidden rounded-2xl border border-[#252a32] bg-[#14171c] shadow-2xl shadow-black/50">
            <img src={movie.poster} alt={movie.title} className="h-full w-full object-cover" />
          </div>

          <div className="max-w-3xl self-end">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="cinema-chip border-[#e50914]/40 text-[#f23b43]">{movie.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}</span>
              {movie.ageRating && <span className="cinema-chip">{movie.ageRating}</span>}
              <span className="cinema-chip">
                <Star className="h-3.5 w-3.5 fill-[#f5c451] text-[#f5c451]" />
                {movie.rating}/10
              </span>
            </div>

            <h1 className="max-w-4xl line-clamp-2 text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">{movie.title}</h1>

            <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-300">
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-500" />{movie.duration} min</span>
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-500" />{new Date(movie.releaseDate).toLocaleDateString()}</span>
              <span>{genres.join(' / ')}</span>
            </div>

              <p className="mt-6 max-w-2xl line-clamp-3 text-base leading-7 text-slate-300">{movie.synopsis}</p>

            <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-slate-500">Director</p>
                <p className="mt-1 line-clamp-1 font-medium text-white" title={movie.director}>{movie.director}</p>
              </div>
              <div>
                <p className="text-slate-500">Cast</p>
                <p className="mt-1 line-clamp-2 font-medium text-white" title={cast.join(', ')}>{formatPreviewList(cast, 3)}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {movie.trailerUrl && (
                <button onClick={() => setShowTrailer(true)} className="cinema-button-secondary">
                  <Play className="h-4 w-4 fill-current" />
                  Trailer
                </button>
              )}
              <button
                onClick={() => {
                  if (!user) return router.push('/auth/login')
                  if (isFavorite) {
                    removeFavoriteMovie(movie.id)
                  } else {
                    addFavoriteMovie(movie.id)
                  }
                }}
                className="cinema-button-secondary"
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-[#e50914] text-[#e50914]' : ''}`} />
                {isFavorite ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(`${window.location.origin}/movies/${movie.id}`)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1600)
                }}
                className="cinema-button-secondary"
              >
                <Share2 className="h-4 w-4" />
                {copied ? 'Copied' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="cinema-container pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="cinema-section-title">Showtimes</h2>
            <p className="cinema-muted mt-2">Pick a date, cinema, and time.</p>
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {dates.map((date) => (
            <button
              key={date.value}
              onClick={() => setSelectedDate(date.value)}
              className={`min-w-20 rounded-2xl border px-4 py-3 text-center transition ${date.active ? 'border-[#e50914] bg-[#e50914] text-white' : 'border-[#252a32] bg-[#14171c] text-slate-400 hover:text-white'}`}
            >
              <span className="block text-xs">{date.weekday}</span>
              <span className="mt-1 block text-lg font-semibold">{date.day}</span>
            </button>
          ))}
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          <button onClick={() => setSelectedCinema('')} className={`rounded-xl border px-4 py-2 text-sm transition ${!selectedCinema ? 'border-[#e50914] bg-[#e50914] text-white' : 'border-[#252a32] bg-[#14171c] text-slate-400 hover:text-white'}`}>All Cinemas</button>
          {cinemas.map((cinema) => (
            <button key={cinema.id} onClick={() => setSelectedCinema(cinema.id)} className={`whitespace-nowrap rounded-xl border px-4 py-2 text-sm transition ${selectedCinema === cinema.id ? 'border-[#e50914] bg-[#e50914] text-white' : 'border-[#252a32] bg-[#14171c] text-slate-400 hover:text-white'}`}>{cinema.name}</button>
          ))}
        </div>

        {groupedShowtimes.length > 0 ? (
          <div className="space-y-4">
            {groupedShowtimes.map(({ cinema, times }) => (
              <div key={cinema.id} className="cinema-card p-5">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{cinema.name}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="h-4 w-4" />
                      {cinema.city}
                    </p>
                  </div>
                  <span className="cinema-chip">{times.length} showtimes</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {times.map((showtime) => {
                    const available = showtime.availableSeats > 0
                    return (
                      <button
                        key={showtime.id}
                        onClick={() => book(showtime)}
                        disabled={!available}
                        className={`rounded-xl border px-4 py-3 text-left transition ${available ? 'border-[#252a32] bg-[#101318] hover:border-[#e50914]' : 'cursor-not-allowed border-[#252a32] bg-[#101318] opacity-45'}`}
                      >
                        <span className="block font-semibold text-white">{showtime.startTime}</span>
                        <span className="mt-1 block text-xs text-slate-500">${showtime.price} - {available ? `${showtime.availableSeats} seats` : 'Sold out'}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cinema-card flex min-h-56 flex-col items-center justify-center p-8 text-center">
            <Ticket className="h-10 w-10 text-slate-600" />
            <p className="mt-4 font-semibold text-white">No showtimes available</p>
            <p className="cinema-muted mt-2">Try another date or cinema.</p>
          </div>
        )}
      </section>

      {showTrailer && movie.trailerUrl && (
        <TrailerModal isOpen={showTrailer} onClose={() => setShowTrailer(false)} trailerUrl={movie.trailerUrl} title={movie.title} />
      )}
    </div>
  )
}
