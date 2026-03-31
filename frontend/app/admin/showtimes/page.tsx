'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Search, Plus, Calendar, Clock, DollarSign, Users, CheckCircle, XCircle, Edit, Trash2, MoreVertical } from 'lucide-react'
import { Showtime } from '@/types'

export default function AdminShowtimesPage() {
  const { movies, showtimes, cinemas } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedMovie, setSelectedMovie] = useState('')
  const [selectedCinema, setSelectedCinema] = useState('')

  const filteredShowtimes = showtimes.filter(showtime => {
    const matchesSearch = !searchTerm || 
      movies.find(m => m.id === showtime.movieId)?.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMovie = !selectedMovie || showtime.movieId === selectedMovie
    const matchesCinema = !selectedCinema || showtime.cinemaId === selectedCinema
    const matchesDate = !selectedDate || showtime.date === selectedDate
    
    return matchesSearch && matchesMovie && matchesCinema && matchesDate
  })

  const getStatusBadge = (status: Showtime['status']) => {
    const styles = {
      scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      selling: 'bg-green-500/20 text-green-400 border-green-500/30',
      sold_out: 'bg-red-500/20 text-red-400 border-red-500/30',
      cancelled: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    }
    
    const labels = {
      scheduled: 'Scheduled',
      selling: 'Selling',
      sold_out: 'Sold Out',
      cancelled: 'Cancelled',
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Showtimes</h1>
          <p className="text-slate-400 mt-1">Manage movie schedules across all cinemas</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition">
          <Plus className="w-4 h-4" />
          <span>Add Showtime</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by movie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
            />
          </div>
          
          <div>
            <label className="block text-slate-400 text-sm mb-2">Movie</label>
            <select
              value={selectedMovie}
              onChange={(e) => setSelectedMovie(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-orange-500 transition"
            >
              <option value="">All Movies</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>{movie.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-2">Cinema</label>
            <select
              value={selectedCinema}
              onChange={(e) => setSelectedCinema(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-orange-500 transition"
            >
              <option value="">All Cinemas</option>
              {cinemas.map((cinema) => (
                <option key={cinema.id} value={cinema.id}>{cinema.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <Calendar className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Showtimes</p>
              <p className="text-2xl font-bold text-white">{filteredShowtimes.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Active Shows</p>
              <p className="text-2xl font-bold text-white">
                {filteredShowtimes.filter(s => s.status === 'selling').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Sold Out</p>
              <p className="text-2xl font-bold text-white">
                {filteredShowtimes.filter(s => s.status === 'sold_out').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Available Seats</p>
              <p className="text-2xl font-bold text-white">
                {filteredShowtimes.reduce((acc, s) => acc + s.availableSeats, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes Table */}
      <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-700/20">
                <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Movie</th>
                <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Cinema</th>
                <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Date</th>
                <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Time</th>
                <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Price</th>
                <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Seats</th>
                <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Status</th>
                <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShowtimes.map((showtime, index) => {
                const movie = movies.find(m => m.id === showtime.movieId)
                const cinema = cinemas.find(c => c.id === showtime.cinemaId)
                const occupancy = ((showtime.totalSeats - showtime.availableSeats) / showtime.totalSeats * 100).toFixed(0)
                
                return (
                  <tr 
                    key={showtime.id}
                    className={`${index % 2 === 0 ? "bg-slate-800/40" : "bg-slate-800/20"} border-b border-slate-700/30 hover:bg-slate-700/30 transition`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{movie?.title}</p>
                        <p className="text-slate-500 text-sm">Screen {showtime.screenId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-300">{cinema?.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-300">{new Date(showtime.date).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Clock className="w-4 h-4" />
                        {showtime.startTime}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-orange-400 font-semibold">${showtime.price}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-slate-300">{showtime.availableSeats} / {showtime.totalSeats}</p>
                        <div className="w-24 h-2 bg-slate-700 rounded-full mt-1">
                          <div 
                            className={`h-full rounded-full ${
                              parseInt(occupancy) > 80 ? 'bg-red-500' : 
                              parseInt(occupancy) > 50 ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${occupancy}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(showtime.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredShowtimes.length === 0 && (
          <div className="p-12 text-center">
            <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-medium">No showtimes found</p>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}