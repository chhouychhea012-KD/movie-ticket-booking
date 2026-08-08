'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Calendar, ChevronLeft, ChevronRight, Clock, Play, Star } from 'lucide-react'
import { Movie } from '@/types'
import TrailerModal from '@/components/trailer-modal'

interface MovieSlideshowProps {
  movies: Movie[]
  autoPlayInterval?: number
}

export default function MovieSlideshow({ movies, autoPlayInterval = 6000 }: MovieSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTrailer, setShowTrailer] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const currentMovie = movies[currentIndex]

  const goTo = useCallback((index: number) => {
    if (!movies.length) return
    setCurrentIndex((index + movies.length) % movies.length)
  }, [movies.length])

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo])
  const previous = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo])

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (movies.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((index) => (index + 1) % movies.length)
      }, autoPlayInterval)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [autoPlayInterval, movies.length])

  if (!currentMovie) {
    return (
      <section className="cinema-container pt-24">
        <div className="cinema-card flex min-h-[420px] items-center justify-center text-slate-400">
          No movies available
        </div>
      </section>
    )
  }

  const genres = (Array.isArray(currentMovie.genre) ? currentMovie.genre : String(currentMovie.genre || '').split(',')).slice(0, 3)

  return (
    <>
      <section className="relative min-h-[650px] overflow-hidden bg-[#0b0d10] pt-16">
        <div className="absolute inset-0">
          <img
            src={currentMovie.backdrop || currentMovie.poster}
            alt={currentMovie.title}
            className="h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0b0d10_0%,rgba(11,13,16,0.92)_34%,rgba(11,13,16,0.42)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,#0b0d10_0%,rgba(11,13,16,0)_100%)]" />
        </div>

        <div className="cinema-container relative z-10 flex min-h-[590px] items-center">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="cinema-chip border-[#e50914]/40 text-[#f23b43]">Now Showing</span>
                {currentMovie.ageRating && <span className="cinema-chip">{currentMovie.ageRating}</span>}
                <span className="cinema-chip">
                  <Star className="h-3.5 w-3.5 fill-[#f5c451] text-[#f5c451]" />
                  {currentMovie.rating}
                </span>
              </div>

              <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-white md:text-7xl">
                {currentMovie.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  {currentMovie.duration} min
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  {new Date(currentMovie.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span>{genres.join(' / ')}</span>
              </div>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
                {currentMovie.synopsis}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/movies/${currentMovie.id}`} className="cinema-button-primary">
                  <Play className="h-4 w-4 fill-current" />
                  Book Now
                </Link>
                {currentMovie.trailerUrl && (
                  <button onClick={() => setShowTrailer(true)} className="cinema-button-secondary">
                    Watch Trailer
                  </button>
                )}
              </div>
            </div>

            <div className="hidden justify-end lg:flex">
              <div className="relative aspect-[2/3] w-full max-w-sm overflow-hidden rounded-2xl border border-[#252a32] bg-[#14171c] shadow-2xl shadow-black/60">
                <img src={currentMovie.poster} alt={currentMovie.title} className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {movies.length > 1 && (
          <div className="cinema-container absolute inset-x-0 bottom-9 z-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {movies.slice(0, 5).map((movie, index) => (
                <button
                  key={movie.id}
                  onClick={() => goTo(index)}
                  className={`h-1.5 rounded-full transition-all ${index === currentIndex ? 'w-10 bg-[#e50914]' : 'w-5 bg-white/25 hover:bg-white/50'}`}
                  aria-label={`Show ${movie.title}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={previous} className="rounded-xl border border-[#252a32] bg-[#14171c]/90 p-3 text-white transition hover:bg-[#1b1f26]" aria-label="Previous movie">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={next} className="rounded-xl border border-[#252a32] bg-[#14171c]/90 p-3 text-white transition hover:bg-[#1b1f26]" aria-label="Next movie">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {showTrailer && currentMovie.trailerUrl && (
        <TrailerModal
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
          trailerUrl={currentMovie.trailerUrl}
          title={currentMovie.title}
        />
      )}
    </>
  )
}
