'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Calendar, Clock, Heart, Star } from 'lucide-react'
import { Movie } from '@/types'
import { useApp } from '@/context/AppContext'

interface MovieCardProps {
  movie: Movie
  viewMode?: 'grid' | 'list'
}

export default function MovieCard({ movie, viewMode = 'grid' }: MovieCardProps) {
  const { user, addFavoriteMovie, removeFavoriteMovie } = useApp()
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setIsFavorite(Boolean(user?.favoriteMovies.includes(movie.id)))
  }, [movie.id, user])

  const genres = (Array.isArray(movie.genre) ? movie.genre : String(movie.genre || '').split(',')).filter(Boolean)

  const toggleFavorite = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (!user) return
    if (isFavorite) {
      removeFavoriteMovie(movie.id)
      setIsFavorite(false)
    } else {
      addFavoriteMovie(movie.id)
      setIsFavorite(true)
    }
  }

  if (viewMode === 'list') {
    return (
      <Link href={`/movies/${movie.id}`} className="cinema-card group grid grid-cols-[104px_1fr] overflow-hidden transition hover:-translate-y-0.5 hover:border-[#343a46] sm:grid-cols-[136px_1fr]">
        <Poster movie={movie} imageError={imageError} setImageError={setImageError} className="h-full min-h-44 rounded-none" />
        <div className="flex min-w-0 flex-col justify-between p-4 sm:p-5">
          <div>
            <div className="mb-2 flex items-start justify-between gap-3">
              <h3 className="line-clamp-2 text-lg font-semibold text-white">{movie.title}</h3>
              <Rating value={movie.rating} />
            </div>
            <p className="line-clamp-2 text-sm leading-6 text-slate-400">{movie.synopsis}</p>
          </div>
          <CardMeta movie={movie} genres={genres} />
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/movies/${movie.id}`} className="cinema-card group block h-full overflow-hidden transition hover:-translate-y-1 hover:border-[#343a46] hover:shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="relative aspect-[2/3] overflow-hidden bg-[#101318]">
        <Poster movie={movie} imageError={imageError} setImageError={setImageError} />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,rgba(11,13,16,0.92),rgba(11,13,16,0))]" />
        <div className="absolute left-3 top-3">
          <Rating value={movie.rating} />
        </div>
        {movie.ageRating && (
          <div className="absolute right-3 top-3 rounded-lg bg-black/55 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
            {movie.ageRating}
          </div>
        )}
        {user && (
          <button
            onClick={toggleFavorite}
            className={`absolute bottom-3 right-3 rounded-xl border border-white/10 p-2 backdrop-blur transition ${isFavorite ? 'bg-[#e50914] text-white' : 'bg-black/50 text-white hover:bg-[#1b1f26]'}`}
            aria-label={isFavorite ? 'Remove favorite' : 'Add favorite'}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div className="min-h-[3.4rem]">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-white">{movie.title}</h3>
          <p className="mt-1 line-clamp-1 text-xs text-slate-500">{genres.slice(0, 2).join(' / ')}</p>
        </div>
        <CardMeta movie={movie} genres={genres} />
        <span className="cinema-button-primary h-10 w-full py-0">Book Now</span>
      </div>
    </Link>
  )
}

function Poster({
  movie,
  imageError,
  setImageError,
  className = '',
}: {
  movie: Movie
  imageError: boolean
  setImageError: (value: boolean) => void
  className?: string
}) {
  if (imageError) {
    return (
      <div className={`flex h-full w-full items-center justify-center bg-[#1b1f26] text-sm text-slate-500 ${className}`}>
        No poster
      </div>
    )
  }

  return (
    <img
      src={movie.poster}
      alt={movie.title}
      onError={() => setImageError(true)}
      className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${className}`}
    />
  )
}

function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-black/55 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
      <Star className="h-3.5 w-3.5 fill-[#f5c451] text-[#f5c451]" />
      {value}
    </span>
  )
}

function CardMeta({ movie }: { movie: Movie; genres: string[] }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
      <span className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-slate-500" />
        {movie.duration} min
      </span>
      <span className="flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5 text-slate-500" />
        {new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </span>
    </div>
  )
}
