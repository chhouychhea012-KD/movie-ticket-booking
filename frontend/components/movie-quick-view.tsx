'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Play, Star, Clock, Calendar, MapPin, Heart, Share2, Ticket, ChevronRight, Film } from 'lucide-react'
import { Movie } from '@/types'
import { useApp } from '@/context/AppContext'

interface MovieQuickViewProps {
  movie: Movie | null
  isOpen: boolean
  onClose: () => void
}

export default function MovieQuickView({ movie, isOpen, onClose }: MovieQuickViewProps) {
  const { user, addFavoriteMovie, removeFavoriteMovie, getShowtimes, cinemas, selectedCity } = useApp()
  const [isFavorite, setIsFavorite] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (movie && user) {
      setIsFavorite(user.favoriteMovies.includes(movie.id))
    }
  }, [movie, user])

  useEffect(() => {
    if (!isOpen) {
      setShowTrailer(false)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showTrailer) {
          setShowTrailer(false)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, showTrailer])

  if (!isOpen || !movie) return null

  const toggleFavorite = () => {
    if (!user) {
      alert('Please sign in to add favorites')
      return
    }
    if (isFavorite) {
      removeFavoriteMovie(movie.id)
      setIsFavorite(false)
    } else {
      addFavoriteMovie(movie.id)
      setIsFavorite(true)
    }
  }

  const handleShare = async () => {
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
  }

  const handleWatchTrailer = () => {
    if (movie.trailerUrl) {
      setShowTrailer(true)
    }
  }

  // Extract YouTube video ID
  const getYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) return match[1]
    }
    return null
  }

  const videoId = movie.trailerUrl ? getYouTubeId(movie.trailerUrl) : null
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 animate-modalIn">
        
        {/* Hero Section with Backdrop */}
        <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
          {/* Background Image */}
          <div className="absolute inset-0">
            {thumbnailUrl ? (
              <img src={thumbnailUrl} alt={movie.title} className="w-full h-full object-cover" />
            ) : (
              <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/30" />
          </div>

          {/* Play Button Overlay */}
          {movie.trailerUrl && (
            <button
              onClick={handleWatchTrailer}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center rounded-full bg-orange-500/90 hover:bg-orange-500 text-white transition-all transform hover:scale-110 shadow-lg shadow-orange-500/30"
            >
              <Play className="w-8 h-8 ml-1 fill-current" />
            </button>
          )}

          {/* Rating Badge */}
          <div className="absolute top-4 left-4">
            <span className="flex items-center gap-1 px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm rounded-lg text-yellow-400 font-bold">
              <Star className="w-4 h-4 fill-current" />
              {movie.rating}/10
            </span>
          </div>

          {/* Age Rating */}
          {movie.ageRating && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm rounded-lg text-white font-medium">
                {movie.ageRating}
              </span>
            </div>
          )}
        </div>

        {/* Trailer Embed */}
        {showTrailer && movie.trailerUrl && (
          <div className="relative aspect-video bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={movie.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Content Section */}
        <div className="p-6">
          {/* Title & Meta */}
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-white mb-2">{movie.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {movie.duration} min
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(movie.releaseDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1">
                <Film className="w-4 h-4" />
                {movie.language}
              </span>
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(Array.isArray(movie.genre) ? movie.genre : String(movie.genre || '').split(',')).map((g, i) => (
              <span key={i} className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
                {g}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <p className="text-slate-300 mb-6">{movie.synopsis}</p>

          {/* Director & Cast */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Director</p>
              <p className="text-white font-medium">{movie.director}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Cast</p>
              <p className="text-white font-medium">{(Array.isArray(movie.cast) ? movie.cast : String(movie.cast || '').split(',')).join(', ')}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={toggleFavorite}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                isFavorite 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Favorited' : 'Add to Favorites'}
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 text-slate-300 hover:bg-slate-700 rounded-xl transition-all border border-slate-600/50"
            >
              <Share2 className="w-5 h-5" />
              {copied ? 'Copied!' : 'Share'}
            </button>
            
            {movie.trailerUrl && (
              <button
                onClick={handleWatchTrailer}
                className="flex items-center gap-2 px-4 py-2.5 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30 rounded-xl transition-all"
              >
                <Play className="w-5 h-5" />
                {showTrailer ? 'Close Trailer' : 'Watch Trailer'}
              </button>
            )}
          </div>

          {/* Quick Book Button */}
          <Link
            href={`/movies/${movie.id}`}
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/25"
          >
            <Ticket className="w-5 h-5" />
            Book Now
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalIn {
          from { 
            opacity: 0; 
            transform: scale(0.95) translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        .animate-modalIn {
          animation: modalIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}