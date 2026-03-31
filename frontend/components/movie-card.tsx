'use client'

import Link from 'next/link'
import { Movie } from '@/types'
import { Star, Clock, Calendar } from 'lucide-react'

interface MovieCardProps {
  movie: Movie
  viewMode?: 'grid' | 'list'
}

export default function MovieCard({ movie, viewMode = 'grid' }: MovieCardProps) {
  if (viewMode === 'list') {
    return (
      <Link href={`/movies/${movie.id}`}>
        <div className="bg-slate-800 rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition duration-300 cursor-pointer flex">
          <div className="w-32 h-48 md:w-40 md:h-56 flex-shrink-0 bg-slate-700">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 p-4 md:p-6">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg md:text-xl font-bold text-white">{movie.title}</h3>
              <span className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                <Star className="w-4 h-4 fill-current" />
                {movie.rating}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {movie.genre.slice(0, 3).map((g, i) => (
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
    )
  }

  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="bg-slate-800 rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition duration-300 cursor-pointer group h-full">
        <div className="relative h-56 md:h-64 lg:h-72 overflow-hidden bg-slate-700">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />
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
        </div>
        
        <div className="p-4 md:p-5">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{movie.title}</h3>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {movie.genre.slice(0, 2).map((g, i) => (
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
      </div>
    </Link>
  )
}
