'use client'

import { useState } from 'react'
import { Movie } from '@/types/movie'
import { Search, Plus, Edit, Trash2, Star, Calendar, Clock, Film } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminMoviesPage() {
  const [movies] = useState<Movie[]>([
    {
      id: '1',
      title: 'The Quantum Paradox',
      genre: 'Sci-Fi',
      rating: 8.5,
      duration: 148,
      poster: '/placeholder.svg?key=2mhpa',
      releaseDate: '2024-12-15',
      synopsis: 'A thrilling journey through time and space.',
      showtimes: ['10:00 AM', '1:30 PM', '4:00 PM', '7:00 PM', '9:30 PM'],
    },
    {
      id: '2',
      title: 'Love in Paris',
      genre: 'Romance',
      rating: 7.8,
      duration: 125,
      poster: '/placeholder.svg?key=k54ad',
      releaseDate: '2024-12-10',
      synopsis: 'A heartwarming tale of love and discovery.',
      showtimes: ['11:00 AM', '2:00 PM', '5:00 PM', '8:00 PM'],
    },
    {
      id: '3',
      title: 'Dark Shadows',
      genre: 'Thriller',
      rating: 8.2,
      duration: 135,
      poster: '/placeholder.svg?key=e3cxe',
      releaseDate: '2024-12-12',
      synopsis: 'A suspenseful mystery that will keep you on edge.',
      showtimes: ['12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'],
    },
    {
      id: '4',
      title: 'Laugh Out Loud',
      genre: 'Comedy',
      rating: 7.5,
      duration: 110,
      poster: '/placeholder.svg?key=kvr04',
      releaseDate: '2024-12-14',
      synopsis: 'Hilarious adventures that will make you laugh.',
      showtimes: ['1:00 PM', '4:00 PM', '7:00 PM'],
    },
    {
      id: '5',
      title: 'Dragon Legends',
      genre: 'Fantasy',
      rating: 8.7,
      duration: 155,
      poster: '/placeholder.svg?key=lg3i7',
      releaseDate: '2024-12-16',
      synopsis: 'An epic adventure in a world of magic.',
      showtimes: ['10:30 AM', '2:00 PM', '5:30 PM', '8:30 PM'],
    },
    {
      id: '6',
      title: 'Space Force',
      genre: 'Action',
      rating: 8.1,
      duration: 140,
      poster: '/placeholder.svg?key=1hm9p',
      releaseDate: '2024-12-13',
      synopsis: 'Intense action sequences in the final frontier.',
      showtimes: ['11:00 AM', '2:30 PM', '6:00 PM', '9:00 PM'],
    },
  ])

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Movies</h1>
          <p className="text-slate-400 mt-1">Manage your movie catalog</p>
        </div>
        
        {/* Search and Add */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search movies..."
              className="pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition">
            <Plus className="w-4 h-4" />
            <span>Add Movie</span>
          </button>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map((movie, index) => (
          <div 
            key={movie.id} 
            className="group relative bg-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300"
          >
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Poster */}
            <div className="relative h-56 overflow-hidden bg-slate-700/50">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
              <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                <span className="px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded-lg text-yellow-400 text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  {movie.rating}
                </span>
              </div>
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-600">
                <Film className="w-16 h-16 text-slate-500" />
              </div>
            </div>

            {/* Content */}
            <div className="relative p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-bold text-white line-clamp-1">{movie.title}</h3>
                <span className="shrink-0 px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs font-medium">
                  {movie.genre}
                </span>
              </div>
              
              <p className="text-slate-400 text-sm line-clamp-2 mb-4">{movie.synopsis}</p>
              
              {/* Meta Info */}
              <div className="flex items-center gap-4 text-slate-500 text-xs mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {movie.duration} min
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(movie.releaseDate).toLocaleDateString()}
                </span>
              </div>

              {/* Showtimes */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {movie.showtimes.slice(0, 4).map((time, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">
                    {time}
                  </span>
                ))}
                {movie.showtimes.length > 4 && (
                  <span className="px-2 py-1 text-slate-500 text-xs">
                    +{movie.showtimes.length - 4} more
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl text-sm transition">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="px-3 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
