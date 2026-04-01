'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit2, Trash2, X, Eye, Download, Calendar, Clock, DollarSign, Users, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dataStore } from '@/lib/data-store'
import { Showtime } from '@/types'

// Extended Showtime type for the UI (includes title info)
interface ExtendedShowtime {
  id: string
  movieId: string
  movieTitle: string
  cinemaId: string
  cinemaName: string
  screenName: string
  date: string
  startTime: string
  endTime: string
  price: number
  availableSeats: number
  totalSeats: number
  status: 'scheduled' | 'selling' | 'sold_out' | 'cancelled'
}

// Get showtimes from data store with movie/cinema info
const generateInitialShowtimes = (): ExtendedShowtime[] => {
  const showtimes = dataStore.showtimes.getAll()
  const movies = dataStore.movies.getAll()
  const cinemas = dataStore.cinemas.getAll()
  
  return showtimes.map(st => {
    const movie = movies.find(m => m.id === st.movieId)
    const cinema = cinemas.find(c => c.id === st.cinemaId)
    const screen = cinema?.screens.find(s => s.id === st.screenId)
    return {
      ...st,
      movieTitle: movie?.title || 'Unknown',
      cinemaName: cinema?.name || 'Unknown',
      screenName: screen?.name || 'Unknown'
    }
  })
}

// Get movies list
const getMoviesList = (): { id: string; title: string }[] => {
  return dataStore.movies.getAll().map(m => ({ id: m.id, title: m.title }))
}

// Get cinemas list
const getCinemasList = (): { id: string; name: string; screens: string[] }[] => {
  return dataStore.cinemas.getAll().map(c => ({
    id: c.id,
    name: c.name,
    screens: c.screens?.map((s: any) => s.name) || []
  }))
}

export default function AdminShowtimesPage() {
  const [showtimes, setShowtimes] = useState<any[]>([])
  const [filteredShowtimes, setFilteredShowtimes] = useState<any[]>([])
  const [mockMovies, setMockMovies] = useState<{ id: string; title: string }[]>([])
  const [mockCinemas, setMockCinemas] = useState<{ id: string; name: string; screens: string[] }[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedMovie, setSelectedMovie] = useState('')
  const [selectedCinema, setSelectedCinema] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingShowtime, setEditingShowtime] = useState<ExtendedShowtime | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewShowtime, setViewShowtime] = useState<ExtendedShowtime | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    movieId: '',
    cinemaId: '',
    screenName: '',
    date: '',
    startTime: '',
    price: 15,
    status: 'scheduled' as Showtime['status']
  })

  useEffect(() => {
    dataStore.initialize()
    const initial = generateInitialShowtimes()
    setShowtimes(initial as ExtendedShowtime[])
    setFilteredShowtimes(initial as ExtendedShowtime[])
    setMockMovies(getMoviesList())
    setMockCinemas(getCinemasList())
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = showtimes.filter(showtime => {
      const matchesSearch = !searchTerm || 
        showtime.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        showtime.cinemaName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesMovie = !selectedMovie || showtime.movieId === selectedMovie
      const matchesCinema = !selectedCinema || showtime.cinemaId === selectedCinema
      const matchesDate = !selectedDate || showtime.date === selectedDate
      
      return matchesSearch && matchesMovie && matchesCinema && matchesDate
    })
    setFilteredShowtimes(filtered)
  }, [searchTerm, selectedMovie, selectedCinema, selectedDate, showtimes])

  // Save to localStorage
  const saveShowtimes = (updatedShowtimes: ExtendedShowtime[]) => {
    setShowtimes(updatedShowtimes)
    setFilteredShowtimes(updatedShowtimes)
    localStorage.setItem('showtimes', JSON.stringify(updatedShowtimes))
  }

  // Handle create/update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const movie = mockMovies.find(m => m.id === formData.movieId)
    const cinema = mockCinemas.find(c => c.id === formData.cinemaId)
    
    // Calculate duration based on movie (default 2 hours)
    const duration = 120 // minutes
    const endTime = calculateEndTime(formData.startTime, duration)
    
    if (editingShowtime) {
      const updated = showtimes.map(s =>
        s.id === editingShowtime.id
          ? {
              ...s,
              movieId: formData.movieId,
              movieTitle: movie?.title || s.movieTitle,
              cinemaId: formData.cinemaId,
              cinemaName: cinema?.name || s.cinemaName,
              screenName: formData.screenName,
              date: formData.date,
              startTime: formData.startTime,
              endTime,
              price: formData.price,
              status: formData.status
            }
          : s
      )
      saveShowtimes(updated)
    } else {
      const newShowtime: ExtendedShowtime = {
        id: Date.now().toString(),
        movieId: formData.movieId,
        movieTitle: movie?.title || '',
        cinemaId: formData.cinemaId,
        cinemaName: cinema?.name || '',
        screenName: formData.screenName,
        date: formData.date,
        startTime: formData.startTime,
        endTime,
        price: formData.price,
        availableSeats: 100,
        totalSeats: 100,
        status: formData.status
      }
      saveShowtimes([...showtimes, newShowtime])
    }
    
    setShowModal(false)
    setEditingShowtime(null)
  }

  // Helper to calculate end time
  // Build showtime with movie and cinema info
  const buildShowtimeInfo = (showtime: Showtime): ExtendedShowtime => {
    const movie = dataStore.movies.getById(showtime.movieId)
    const cinema = dataStore.cinemas.getById(showtime.cinemaId)
    return {
      ...showtime,
      movieTitle: movie?.title || 'Unknown',
      cinemaName: cinema?.name || 'Unknown',
      screenName: cinema?.screens.find(s => s.id === showtime.screenId)?.name || 'Unknown'
    }
  }

  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [time, period] = startTime.split(' ')
    const [hours, minutes] = time.split(':').map(Number)
    let hour = period === 'PM' && hours !== 12 ? hours + 12 : hours
    if (period === 'AM' && hours === 12) hour = 0
    
    const totalMinutes = hour * 60 + minutes + durationMinutes
    const endHour = Math.floor(totalMinutes / 60) % 24
    const endMinutes = totalMinutes % 60
    
    const displayHour = endHour === 0 ? 12 : endHour > 12 ? endHour - 12 : endHour
    const displayPeriod = endHour < 12 ? 'AM' : 'PM'
    
    return `${displayHour}:${endMinutes.toString().padStart(2, '0')} ${displayPeriod}`
  }

  // Handle delete
  const handleDelete = (id: string) => {
    const updated = showtimes.filter(s => s.id !== id)
    saveShowtimes(updated)
    setDeleteConfirm(null)
  }

  // Handle update status
  const handleUpdateStatus = (id: string, status: Showtime['status']) => {
    const updated = showtimes.map(s =>
      s.id === id ? { ...s, status } : s
    )
    saveShowtimes(updated)
  }

  // Open create modal
  const handleOpenCreate = () => {
    setEditingShowtime(null)
    setFormData({
      movieId: mockMovies[0].id,
      cinemaId: mockCinemas[0].id,
      screenName: mockCinemas[0].screens[0],
      date: new Date().toISOString().split('T')[0],
      startTime: '7:00 PM',
      price: 15,
      status: 'scheduled'
    })
    setShowModal(true)
  }

  // Open edit modal
  const handleOpenEdit = (showtime: ExtendedShowtime) => {
    setEditingShowtime(showtime)
    setFormData({
      movieId: showtime.movieId,
      cinemaId: showtime.cinemaId,
      screenName: showtime.screenName,
      date: showtime.date,
      startTime: showtime.startTime,
      price: showtime.price,
      status: showtime.status
    })
    setShowModal(true)
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      selling: 'bg-green-500/20 text-green-400 border-green-500/30',
      sold_out: 'bg-red-500/20 text-red-400 border-red-500/30',
      cancelled: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    }
    const labels: Record<string, string> = {
      scheduled: 'Scheduled',
      selling: 'Selling',
      sold_out: 'Sold Out',
      cancelled: 'Cancelled',
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.scheduled}`}>
        {labels[status] || status}
      </span>
    )
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Movie', 'Cinema', 'Screen', 'Date', 'Time', 'Price', 'Status']
    const rows = showtimes.map(s => [
      s.movieTitle,
      s.cinemaName,
      s.screenName,
      s.date,
      s.startTime,
      s.price,
      s.status
    ])
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'showtimes.csv'
    a.click()
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Showtimes</h1>
          <p className="text-slate-400 mt-1">Manage movie schedules across all cinemas</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-xl text-slate-300 text-sm transition">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition">
            <Plus className="w-4 h-4" />
            <span>Add Showtime</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by movie or cinema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
            />
          </div>
          
          <div>
            <label className="block text-slate-400 text-xs mb-2">Movie</label>
            <select
              value={selectedMovie}
              onChange={(e) => setSelectedMovie(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-orange-500 transition"
            >
              <option value="">All Movies</option>
              {mockMovies.map((movie) => (
                <option key={movie.id} value={movie.id}>{movie.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-2">Cinema</label>
            <select
              value={selectedCinema}
              onChange={(e) => setSelectedCinema(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-orange-500 transition"
            >
              <option value="">All Cinemas</option>
              {mockCinemas.map((cinema) => (
                <option key={cinema.id} value={cinema.id}>{cinema.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-2">Date</label>
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
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total Showtimes</p>
                <p className="text-xl font-bold text-white">{filteredShowtimes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Active Shows</p>
                <p className="text-xl font-bold text-white">
                  {filteredShowtimes.filter(s => s.status === 'selling').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Sold Out</p>
                <p className="text-xl font-bold text-white">
                  {filteredShowtimes.filter(s => s.status === 'sold_out').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Available Seats</p>
                <p className="text-xl font-bold text-white">
                  {filteredShowtimes.reduce((acc, s) => acc + s.availableSeats, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Showtimes Table */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-700/20">
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Movie</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Cinema</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Screen</th>
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
                  const occupancy = ((showtime.totalSeats - showtime.availableSeats) / showtime.totalSeats * 100).toFixed(0)
                  
                  return (
                    <tr 
                      key={showtime.id}
                      className={`${index % 2 === 0 ? "bg-slate-800/40" : "bg-slate-800/20"} border-b border-slate-700/30 hover:bg-slate-700/30 transition`}
                    >
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{showtime.movieTitle}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-300">{showtime.cinemaName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-300">{showtime.screenName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-300">{new Date(showtime.date).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock className="w-4 h-4" />
                          {showtime.startTime} - {showtime.endTime}
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
                          <button 
                            onClick={() => setViewShowtime(showtime)}
                            className="p-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleOpenEdit(showtime)}
                            className="p-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {deleteConfirm === showtime.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(showtime.id)}
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="p-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setDeleteConfirm(showtime.id)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                {editingShowtime ? 'Edit Showtime' : 'Create New Showtime'}
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Movie</label>
                  <select
                    value={formData.movieId}
                    onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  >
                    {mockMovies.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Cinema</label>
                  <select
                    value={formData.cinemaId}
                    onChange={(e) => {
                      const cinema = mockCinemas.find(c => c.id === e.target.value)
                      setFormData({ 
                        ...formData, 
                        cinemaId: e.target.value,
                        screenName: cinema?.screens[0] || ''
                      })
                    }}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  >
                    {mockCinemas.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Screen</label>
                  <select
                    value={formData.screenName}
                    onChange={(e) => setFormData({ ...formData, screenName: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  >
                    {mockCinemas.find(c => c.id === formData.cinemaId)?.screens.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Start Time</label>
                    <select
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    >
                      {['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Price ($)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="selling">Selling</option>
                      <option value="sold_out">Sold Out</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
                  >
                    {editingShowtime ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Modal */}
      {viewShowtime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Showtime Details
                <button onClick={() => setViewShowtime(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-xs">Movie</p>
                  <p className="text-white font-medium">{viewShowtime.movieTitle}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Cinema</p>
                  <p className="text-white font-medium">{viewShowtime.cinemaName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Screen</p>
                  <p className="text-white font-medium">{viewShowtime.screenName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Date</p>
                  <p className="text-white font-medium">{new Date(viewShowtime.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Time</p>
                  <p className="text-white font-medium">{viewShowtime.startTime} - {viewShowtime.endTime}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Price</p>
                  <p className="text-orange-400 font-medium">${viewShowtime.price}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Available Seats</p>
                  <p className="text-white font-medium">{viewShowtime.availableSeats} / {viewShowtime.totalSeats}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Status</p>
                  {getStatusBadge(viewShowtime.status)}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-700">
                {viewShowtime.status !== 'selling' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(viewShowtime.id, 'selling')
                      setViewShowtime(null)
                    }}
                    className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg transition"
                  >
                    Start Selling
                  </button>
                )}
                {viewShowtime.status === 'selling' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(viewShowtime.id, 'sold_out')
                      setViewShowtime(null)
                    }}
                    className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition"
                  >
                    Mark Sold Out
                  </button>
                )}
                <button
                  onClick={() => {
                    handleOpenEdit(viewShowtime)
                    setViewShowtime(null)
                  }}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
                >
                  Edit
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
