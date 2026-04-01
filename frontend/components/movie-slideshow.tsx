'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Movie } from '@/types'
import { useApp } from '@/context/AppContext'
import { ChevronLeft, ChevronRight, Play, Star, Clock, Calendar, Info, Pause, PlayCircle, Film, Heart, Share2 } from 'lucide-react'
import TrailerModal from '@/components/trailer-modal'

interface MovieSlideshowProps {
  movies: Movie[]
  autoPlayInterval?: number
}

export default function MovieSlideshow({ movies, autoPlayInterval = 5000 }: MovieSlideshowProps) {
  const { user, addFavoriteMovie, removeFavoriteMovie } = useApp()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progressKey, setProgressKey] = useState(0) // Key to force restart animation
  const [showTrailerModal, setShowTrailerModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const currentMovie = movies[currentIndex]

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % movies.length)
  }, [movies.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)
  }, [movies.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
    // Reset progress animation
    setProgressKey(prev => prev + 1)
  }, [])

  // Start the slideshow
  const startSlideshow = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    // Start new interval
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length)
      setProgressKey(prev => prev + 1) // Restart progress animation
    }, autoPlayInterval)
  }, [autoPlayInterval, movies.length])

  // Stop the slideshow
  const stopSlideshow = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Auto-play effect
  useEffect(() => {
    if (movies.length > 1 && !isPaused) {
      startSlideshow()
    } else {
      stopSlideshow()
    }
    
    return () => stopSlideshow()
  }, [isPaused, movies.length, startSlideshow, stopSlideshow])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrev, goToNext])

  // Touch/swipe support
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext()
      } else {
        goToPrev()
      }
    }
  }

  // Update favorite status when movie changes
  useEffect(() => {
    if (user && currentMovie) {
      setIsFavorite(user.favoriteMovies.includes(currentMovie.id))
    }
  }, [user, currentMovie])

  if (!currentMovie || movies.length === 0) {
    return (
      <div className="relative w-full h-[85vh] min-h-[600px] bg-slate-900 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <Film className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No movies available</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="relative w-full h-[85vh] min-h-[600px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides */}
      {movies.map((movie, index) => {
        const isActive = index === currentIndex
        return (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/40 z-10" />
            
            {/* Movie Poster Background */}
            <div className="absolute inset-0">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            </div>
          </div>
        )
      })}

      {/* Animated Background Effects */}
      <div className="absolute inset-0 z-5 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-orange-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            {/* Movie Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {currentMovie.genre.slice(0, 3).map((genre: string, i: number) => (
                <span 
                  key={i}
                  className="px-3 py-1 text-xs font-medium bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30"
                >
                  {genre}
                </span>
              ))}
              {currentMovie.ageRating && (
                <span className="px-3 py-1 text-xs font-medium bg-slate-800/80 text-white rounded-full border border-slate-700">
                  {currentMovie.ageRating}
                </span>
              )}
            </div>

            {/* Movie Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
              {currentMovie.title}
            </h1>

            {/* Movie Meta */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 text-slate-300">
              <span className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold text-white">{currentMovie.rating}</span>
                <span className="text-slate-500">/ 10</span>
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                <span>{currentMovie.duration} min</span>
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-400" />
                <span>{new Date(currentMovie.releaseDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}</span>
              </span>
            </div>

            {/* Synopsis */}
            <p className="text-lg md:text-xl text-slate-300 mb-8 line-clamp-3 max-w-2xl">
              {currentMovie.synopsis}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link 
                href={`/movies/${currentMovie.id}`}
                className="flex items-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
              >
                <Play className="w-5 h-5" />
                <span>Book Now</span>
              </Link>
              <Link 
                href={`/movies/${currentMovie.id}`}
                className="flex items-center gap-3 px-8 py-4 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-300"
              >
                <Info className="w-5 h-5" />
                <span>More Info</span>
              </Link>
              {/* Add to Favorites Button */}
              <button
                onClick={() => {
                  if (!user) {
                    alert('Please sign in to add favorites')
                    return
                  }
                  if (isFavorite) {
                    removeFavoriteMovie(currentMovie.id)
                    setIsFavorite(false)
                  } else {
                    addFavoriteMovie(currentMovie.id)
                    setIsFavorite(true)
                  }
                }}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-300 ${
                  isFavorite 
                    ? 'bg-red-500/20 border-red-500/30 text-red-400' 
                    : 'bg-slate-800/80 border-slate-700 text-white hover:border-red-500/50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
              </button>
              {/* Share Button */}
              <button
                onClick={async () => {
                  const url = `${window.location.origin}/movies/${currentMovie.id}`
                  try {
                    if (navigator.share) {
                      await navigator.share({
                        title: currentMovie.title,
                        text: `Check out ${currentMovie.title}`,
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
                className="flex items-center gap-3 px-6 py-4 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-300"
              >
                <Share2 className="w-5 h-5" />
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>
              {/* Watch Trailer Button */}
              {currentMovie.trailerUrl && (
                <button
                  onClick={() => setShowTrailerModal(true)}
                  className="flex items-center gap-3 px-6 py-4 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-semibold rounded-xl border border-orange-500/30 transition-all duration-300"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Trailer</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-slate-900/50 hover:bg-orange-500 text-white rounded-full border border-slate-700 hover:border-orange-500 transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous movie"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-slate-900/50 hover:bg-orange-500 text-white rounded-full border border-slate-700 hover:border-orange-500 transition-all duration-300 backdrop-blur-sm"
        aria-label="Next movie"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {movies.map((movie, index) => (
          <button
            key={movie.id}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-8 bg-orange-500' 
                : 'w-2 bg-slate-600 hover:bg-slate-500'
            }`}
            aria-label={`Go to ${movie.title}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800 z-30">
        <div 
          key={progressKey}
          className="h-full bg-orange-500 animate-progress"
          style={{
            animationDuration: `${autoPlayInterval}ms`,
            animationTimingFunction: 'linear',
            animationFillMode: 'forwards'
          }}
        />
      </div>

      {/* Counter */}
      <div className="absolute top-8 right-8 z-30 flex items-center gap-2 text-slate-400">
        <span className="text-2xl font-bold text-white">{String(currentIndex + 1).padStart(2, '0')}</span>
        <span className="text-lg">/</span>
        <span className="text-lg">{String(movies.length).padStart(2, '0')}</span>
      </div>

      {/* Play/Pause Indicator */}
      <div className="absolute top-8 left-8 z-30 flex items-center gap-2">
        {isPaused ? (
          <Pause className="w-4 h-4 text-slate-400" />
        ) : (
          <PlayCircle className="w-4 h-4 text-orange-500 animate-pulse" />
        )}
        <span className="text-sm text-slate-400">{isPaused ? 'Paused' : 'Auto'}</span>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation-name: progress;
        }
      `}</style>
      {showTrailerModal && currentMovie?.trailerUrl && (
        <TrailerModal
          isOpen={showTrailerModal}
          onClose={() => setShowTrailerModal(false)}
          trailerUrl={currentMovie.trailerUrl || ''}
          title={currentMovie.title}
        />
      )}
    </div>
  )
}
