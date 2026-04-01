'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Movie } from '@/types'
import { useApp } from '@/context/AppContext'
import { Star, Clock, Calendar, Heart, Share2, Play, X, Eye, MoreVertical } from 'lucide-react'
import MovieQuickView from './movie-quick-view'

interface MovieCardProps {
  movie: Movie
  viewMode?: 'grid' | 'list'
}

export default function MovieCard({ movie, viewMode = 'grid' }: MovieCardProps) {
  const router = useRouter()
  const { user, addFavoriteMovie, removeFavoriteMovie } = useApp()
  const [isFavorite, setIsFavorite] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (user) {
      setIsFavorite(user.favoriteMovies.includes(movie.id))
    }
  }, [user, movie.id])

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/movies/${movie.id}`
    try {
      if (navigator.share) {
        await navigator.share({
          title: movie.title,
          text: `Check out ${movie.title}`,
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

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowQuickView(true)
  }

  const handleWatchTrailer = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowQuickView(true)
  }

  // Extract YouTube thumbnail
  const getYouTubeThumbnail = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) return match[1]
    }
    return null
  }

  const videoId = movie.trailerUrl ? getYouTubeThumbnail(movie.trailerUrl) : null
  const trailerThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null

  if (viewMode === 'list') {
    return (
      <>
        <Link href={`/movies/${movie.id}`}>
          <div className="bg-slate-800 rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition duration-300 cursor-pointer flex group">
            <div className="relative w-32 h-48 md:w-40 md:h-56 flex-shrink-0 bg-slate-700 overflow-hidden">
              {!imageError ? (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                  <span className="text-slate-500 text-xs">No Image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              
              {/* Play button overlay */}
              {movie.trailerUrl && (
                <button
                  onClick={handleWatchTrailer}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-orange-500/90 hover:bg-orange-500 text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <Play className="w-4 h-4 ml-0.5 fill-current" />
                </button>
              )}
            </div>
            
            <div className="flex-1 p-4 md:p-6 relative">
              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-lg transition ${
                    isFavorite 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-slate-700/80 text-slate-400 hover:text-red-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg bg-slate-700/80 text-slate-400 hover:text-white transition"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-start justify-between gap-2 pr-16">
                <h3 className="text-lg md:text-xl font-bold text-white">{movie.title}</h3>
                <span className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                  <Star className="w-4 h-4 fill-current" />
                  {movie.rating}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {(Array.isArray(movie.genre) ? movie.genre : String(movie.genre || '').split(',')).slice(0, 3).map((g, i) => (
                  <span key={i} className="text-xs text-orange-500">{g}</span>
                ))}
              </div>

              <p className="text-slate-400 text-sm mt-3 line-clamp-2">{movie.synopsis}</p>

              <div className="flex items-center gap-4 mt-4 text-slate-400 text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {movie.duration} min
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(movie.releaseDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Quick View Modal */}
        <MovieQuickView
          movie={showQuickView ? movie : null}
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
        />
      </>
    )
  }

  return (
    <>
      <div className="relative bg-slate-800 rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition duration-300 cursor-pointer group h-full">
        <Link href={`/movies/${movie.id}`}>
          <div className="relative h-56 md:h-64 lg:h-72 overflow-hidden bg-slate-700">
            {!imageError ? (
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                <span className="text-slate-500">No Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            
            {/* Rating Badge */}
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded-lg text-yellow-400 text-sm font-medium">
                <Star className="w-3 h-3 fill-current" />
                {movie.rating}
              </span>
            </div>

            {/* Age Rating */}
            {movie.ageRating && (
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded text-white text-xs font-medium">
                  {movie.ageRating}
                </span>
              </div>
            )}

            {/* Hover Overlay with Actions */}
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
              {movie.trailerUrl && (
                <button
                  onClick={handleWatchTrailer}
                  className="w-14 h-14 flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-all transform hover:scale-110 shadow-lg shadow-orange-500/30"
                >
                  <Play className="w-6 h-6 ml-1 fill-current" />
                </button>
              )}
              <button
                onClick={handleQuickView}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-all transform hover:scale-110"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions (visible on hover) */}
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-lg backdrop-blur-sm transition ${
                  isFavorite 
                    ? 'bg-red-500/90 text-white' 
                    : 'bg-slate-900/80 text-slate-400 hover:text-red-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg bg-slate-900/80 backdrop-blur-sm text-slate-400 hover:text-white transition"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowMenu(!showMenu)
                  }}
                  className="p-2 rounded-lg bg-slate-900/80 backdrop-blur-sm text-slate-400 hover:text-white transition"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute top-16 right-3 w-40 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-slate-700/50 shadow-xl overflow-hidden z-10">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleQuickView(e as any)
                    setShowMenu(false)
                  }}
                  className="w-full px-4 py-2.5 text-left text-slate-300 hover:bg-slate-700/50 flex items-center gap-2 transition"
                >
                  <Eye className="w-4 h-4" />
                  Quick View
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    router.push(`/movies/${movie.id}`)
                    setShowMenu(false)
                  }}
                  className="w-full px-4 py-2.5 text-left text-slate-300 hover:bg-slate-700/50 flex items-center gap-2 transition"
                >
                  <Calendar className="w-4 h-4" />
                  Showtimes
                </button>
              </div>
            )}
          </div>
        </Link>
        
        <Link href={`/movies/${movie.id}`}>
          <div className="p-4 md:p-5">
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{movie.title}</h3>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {(Array.isArray(movie.genre) ? movie.genre : String(movie.genre || '').split(',')).slice(0, 2).map((g, i) => (
                <span key={i} className="text-xs text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                  {g}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {movie.duration} min
              </span>
              <span>{new Date(movie.releaseDate).toLocaleDateString('en-US')}</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick View Modal */}
      <MovieQuickView
        movie={showQuickView ? movie : null}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />

      {/* Copy feedback toast */}
      {copied && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-800 text-white rounded-lg shadow-xl z-50 flex items-center gap-2">
          <Heart className="w-4 h-4 text-green-400" />
          Link copied to clipboard!
        </div>
      )}
    </>
  )
}
