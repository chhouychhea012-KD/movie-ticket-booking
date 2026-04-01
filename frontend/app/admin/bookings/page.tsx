'use client'

import { useState, useEffect } from 'react'
import { Booking } from '@/types/booking'
import { bookingsAPI } from '@/lib/api'
import { Search, Download, Plus, X, Edit2, Trash2, Eye, Check, Ticket, Clock, DollarSign, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Generate initial bookings
const generateInitialBookings = (): Booking[] => {
  return [
    {
      id: '1',
      movieTitle: 'Dune: Part Two',
      showtime: '2024-03-15 7:00 PM',
      seats: ['A1', 'A2'],
      ticketPrice: 12,
      totalPrice: 24,
      bookingDate: '2024-03-10T10:30:00Z',
      status: 'confirmed'
    },
    {
      id: '2',
      movieTitle: 'The Batman',
      showtime: '2024-03-15 9:30 PM',
      seats: ['B5'],
      ticketPrice: 18,
      totalPrice: 18,
      bookingDate: '2024-03-11T14:20:00Z',
      status: 'confirmed'
    },
    {
      id: '3',
      movieTitle: 'Oppenheimer',
      showtime: '2024-03-16 6:00 PM',
      seats: ['C3', 'C4'],
      ticketPrice: 12,
      totalPrice: 24,
      bookingDate: '2024-03-12T09:15:00Z',
      status: 'confirmed'
    },
    {
      id: '4',
      movieTitle: 'Barbie',
      showtime: '2024-03-17 8:00 PM',
      seats: ['D1'],
      ticketPrice: 25,
      totalPrice: 25,
      bookingDate: '2024-03-13T16:45:00Z',
      status: 'cancelled'
    },
    {
      id: '5',
      movieTitle: 'Spider-Man: ATSV',
      showtime: '2024-03-18 7:00 PM',
      seats: ['E1', 'E2', 'E3'],
      ticketPrice: 12,
      totalPrice: 36,
      bookingDate: '2024-03-14T11:00:00Z',
      status: 'used'
    }
  ]
}

export default function AdminBookingsDetailPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewBooking, setViewBooking] = useState<Booking | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    movieTitle: '',
    showtime: '',
    seats: '',
    ticketPrice: 12,
    totalPrice: 12,
    status: 'confirmed' as 'confirmed' | 'cancelled' | 'used' | 'expired'
  })

  useEffect(() => {
    const loadBookings = async () => {
      try {
        // Try to load from API first
        const response = await bookingsAPI.getAll({ limit: 100 })
        if (response.success && response.data?.bookings) {
          // Transform API data to match local Booking type
          const transformedBookings = response.data.bookings.map((b: any) => ({
            ...b,
            seats: Array.isArray(b.seats) ? b.seats.map((s: any) => s.seatNumber || s) : b.seats || [],
          }))
          setBookings(transformedBookings)
          setFilteredBookings(transformedBookings)
        } else {
          // Fallback to localStorage
          const storedBookings = localStorage.getItem('bookings')
          if (storedBookings) {
            const parsed = JSON.parse(storedBookings)
            setBookings(parsed)
            setFilteredBookings(parsed)
          } else {
            const initial = generateInitialBookings()
            setBookings(initial)
            setFilteredBookings(initial)
            localStorage.setItem('bookings', JSON.stringify(initial))
          }
        }
      } catch (error) {
        // Fallback to localStorage on error
        const storedBookings = localStorage.getItem('bookings')
        if (storedBookings) {
          const parsed = JSON.parse(storedBookings)
          setBookings(parsed)
          setFilteredBookings(parsed)
        } else {
          const initial = generateInitialBookings()
          setBookings(initial)
          setFilteredBookings(initial)
          localStorage.setItem('bookings', JSON.stringify(initial))
        }
      } finally {
        setLoading(false)
      }
    }
    loadBookings()
  }, [])

  useEffect(() => {
    let filtered = bookings.filter(booking =>
      booking.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.showtime.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }, [searchTerm, statusFilter, bookings])

  // Save to localStorage
  const saveBookings = (updatedBookings: Booking[]) => {
    setBookings(updatedBookings)
    setFilteredBookings(updatedBookings)
    localStorage.setItem('bookings', JSON.stringify(updatedBookings))
  }

  // Handle create/update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const seatsArray = formData.seats.split(',').map(s => s.trim()).filter(s => s)
    
    if (editingBooking) {
      // Update existing
      const updated = bookings.map(b =>
        b.id === editingBooking.id
          ? {
              ...b,
              movieTitle: formData.movieTitle,
              showtime: formData.showtime,
              seats: seatsArray,
              ticketPrice: formData.ticketPrice,
              totalPrice: formData.totalPrice,
              status: formData.status
            }
          : b
      )
      saveBookings(updated)
    } else {
      // Create new
      const newBooking: Booking = {
        id: Date.now().toString(),
        movieTitle: formData.movieTitle,
        showtime: formData.showtime,
        seats: seatsArray,
        ticketPrice: formData.ticketPrice,
        totalPrice: formData.totalPrice,
        bookingDate: new Date().toISOString(),
        status: formData.status
      }
      saveBookings([...bookings, newBooking])
    }
    
    setShowModal(false)
    setEditingBooking(null)
  }

  // Handle delete
  const handleDelete = (id: string) => {
    const updated = bookings.filter(b => b.id !== id)
    saveBookings(updated)
    setDeleteConfirm(null)
  }

  // Handle cancel
  const handleCancelBooking = (bookingId: string) => {
    const updated = bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
    )
    saveBookings(updated)
  }

  // Open create modal
  const handleOpenCreate = () => {
    setEditingBooking(null)
    setFormData({
      movieTitle: '',
      showtime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      seats: '',
      ticketPrice: 12,
      totalPrice: 12,
      status: 'confirmed'
    })
    setShowModal(true)
  }

  // Open edit modal
  const handleOpenEdit = (booking: Booking) => {
    setEditingBooking(booking)
    setFormData({
      movieTitle: booking.movieTitle,
      showtime: booking.showtime,
      seats: booking.seats.join(', '),
      ticketPrice: booking.ticketPrice,
      totalPrice: booking.totalPrice,
      status: booking.status
    })
    setShowModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'used':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Movie', 'Showtime', 'Seats', 'Total Price', 'Status', 'Date']
    const rows = bookings.map(b => [
      b.movieTitle,
      b.showtime,
      b.seats.join(', '),
      b.totalPrice,
      b.status,
      b.bookingDate
    ])
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bookings.csv'
    a.click()
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Bookings</h1>
          <p className="text-slate-400 mt-1">Search and manage all customer bookings</p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-slate-300 text-sm transition">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition">
            <Plus className="w-4 h-4" />
            <span>Add Booking</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by movie or showtime..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-orange-500 transition"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="used">Used</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Ticket className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total Bookings</p>
                <p className="text-xl font-bold text-white">{bookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Check className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Confirmed</p>
                <p className="text-xl font-bold text-white">{bookings.filter(b => b.status === 'confirmed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total Revenue</p>
${bookings.reduce((s, b) => s + (Number(b.totalPrice) || 0), 0)}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Pending</p>
                <p className="text-xl font-bold text-white">{bookings.filter(b => b.status === 'expired').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
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
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Showtime</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Seats</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Total</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Date</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Status</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <tr 
                    key={booking.id} 
                    className={`${index % 2 === 0 ? "bg-slate-800/40" : "bg-slate-800/20"} border-b border-slate-700/30 hover:bg-slate-700/30 transition`}
                  >
                    <td className="px-6 py-4 text-white font-medium">{booking.movieTitle}</td>
                    <td className="px-6 py-4 text-slate-300">{booking.showtime}</td>
                    <td className="px-6 py-4 text-slate-300">{booking.seats.join(', ')}</td>
                    <td className="px-6 py-4 text-orange-400 font-semibold">${booking.totalPrice}</td>
                    <td className="px-6 py-4 text-slate-300">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewBooking(booking)}
                          className="p-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(booking)}
                          className="p-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {deleteConfirm === booking.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(booking.id)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
                            >
                              <Check className="w-4 h-4" />
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
                            onClick={() => setDeleteConfirm(booking.id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-slate-400 text-lg font-medium">No bookings found</p>
              <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                {editingBooking ? 'Edit Booking' : 'Create New Booking'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Movie Title</label>
                  <input
                    type="text"
                    value={formData.movieTitle}
                    onChange={(e) => setFormData({ ...formData, movieTitle: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Showtime</label>
                  <input
                    type="text"
                    value={formData.showtime}
                    onChange={(e) => setFormData({ ...formData, showtime: e.target.value })}
                    placeholder="2024-03-15 7:00 PM"
                    required
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Seats (comma separated)</label>
                  <input
                    type="text"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                    placeholder="A1, A2, B3"
                    required
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Ticket Price</label>
                    <input
                      type="number"
                      value={formData.ticketPrice}
                      onChange={(e) => setFormData({ ...formData, ticketPrice: parseFloat(e.target.value), totalPrice: parseFloat(e.target.value) * formData.seats.split(',').length })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Total Price</label>
                    <input
                      type="number"
                      value={formData.totalPrice}
                      onChange={(e) => setFormData({ ...formData, totalPrice: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="used">Used</option>
                    <option value="expired">Expired</option>
                  </select>
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
                    {editingBooking ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Modal */}
      {viewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Booking Details
                <button onClick={() => setViewBooking(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-xs">Movie</p>
                  <p className="text-white font-medium">{viewBooking.movieTitle}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Showtime</p>
                  <p className="text-white font-medium">{viewBooking.showtime}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Seats</p>
                  <p className="text-white font-medium">{viewBooking.seats.join(', ')}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Total Price</p>
                  <p className="text-orange-400 font-medium">${viewBooking.totalPrice}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Booking Date</p>
                  <p className="text-white font-medium">{new Date(viewBooking.bookingDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(viewBooking.status)}`}>
                    {viewBooking.status}
                  </span>
                </div>
              </div>
              {viewBooking.status === 'confirmed' && (
                <div className="pt-4 border-t border-slate-700">
                  <button
                    onClick={() => {
                      handleCancelBooking(viewBooking.id)
                      setViewBooking(null)
                    }}
                    className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
