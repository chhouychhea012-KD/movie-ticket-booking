'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit2, Trash2, X, Eye, Download, MapPin, Phone, Mail, Building2, Grid, Users, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Cinema {
  id: string
  name: string
  address: string
  city: string
  phone: string
  email: string
  image: string
  facilities: string[]
  screens: { id: string; name: string; capacity: number }[]
  status: 'active' | 'inactive'
}

// Generate initial cinemas
const generateInitialCinemas = (): Cinema[] => {
  return [
    {
      id: '1',
      name: 'Cineplex Downtown',
      address: '123 Main Street, Downtown',
      city: 'Bangkok',
      phone: '+66 2 123 4567',
      email: 'downtown@cineplex.com',
      image: '',
      facilities: ['Parking', 'Food Court', 'VIP Lounge', '3D Screens'],
      screens: [
        { id: '1', name: 'Screen 1', capacity: 150 },
        { id: '2', name: 'Screen 2', capacity: 120 },
        { id: '3', name: 'VIP Screen', capacity: 50 }
      ],
      status: 'active'
    },
    {
      id: '2',
      name: 'Cineplex Uptown',
      address: '456 Sukhumvit Road, Uptown',
      city: 'Bangkok',
      phone: '+66 2 234 5678',
      email: 'uptown@cineplex.com',
      image: '',
      facilities: ['Parking', 'IMAX', 'Bar', 'Gaming Zone'],
      screens: [
        { id: '1', name: 'IMAX Screen', capacity: 200 },
        { id: '2', name: 'Screen 2', capacity: 100 }
      ],
      status: 'active'
    },
    {
      id: '3',
      name: 'Cineplex Mall',
      address: '789 Siam Paragon, Pathum Wan',
      city: 'Bangkok',
      phone: '+66 2 345 6789',
      email: 'mall@cineplex.com',
      image: '',
      facilities: ['Parking', 'Food Court', '4DX', 'Dolby Atmos'],
      screens: [
        { id: '1', name: '4DX Screen', capacity: 80 },
        { id: '2', name: 'Dolby Screen', capacity: 120 },
        { id: '3', name: 'Screen 3', capacity: 100 }
      ],
      status: 'active'
    }
  ]
}

const allFacilities = ['Parking', 'Food Court', 'VIP Lounge', '3D Screens', 'IMAX', '4DX', 'Dolby Atmos', 'Bar', 'Gaming Zone', 'Wheelchair Access']

export default function AdminCinemasPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([])
  const [filteredCinemas, setFilteredCinemas] = useState<Cinema[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCinema, setEditingCinema] = useState<Cinema | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewCinema, setViewCinema] = useState<Cinema | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: 'Bangkok',
    phone: '',
    email: '',
    facilities: [] as string[],
    status: 'active' as Cinema['status'],
    screens: ''
  })

  useEffect(() => {
    const storedCinemas = localStorage.getItem('cinemas')
    if (storedCinemas) {
      const parsed = JSON.parse(storedCinemas)
      setCinemas(parsed)
      setFilteredCinemas(parsed)
    } else {
      const initial = generateInitialCinemas()
      setCinemas(initial)
      setFilteredCinemas(initial)
      localStorage.setItem('cinemas', JSON.stringify(initial))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const filtered = cinemas.filter(cinema =>
      cinema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cinema.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cinema.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCinemas(filtered)
  }, [searchTerm, cinemas])

  // Save to localStorage
  const saveCinemas = (updatedCinemas: Cinema[]) => {
    setCinemas(updatedCinemas)
    setFilteredCinemas(updatedCinemas)
    localStorage.setItem('cinemas', JSON.stringify(updatedCinemas))
  }

  // Handle create/update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const facilitiesArray = formData.facilities
    const screensArray = formData.screens.split(',').map(s => {
      const parts = s.trim().split(':')
      return {
        id: Date.now().toString() + Math.random(),
        name: parts[0] || 'Screen',
        capacity: parseInt(parts[1]) || 100
      }
    }).filter(s => s.name)
    
    if (editingCinema) {
      const updated = cinemas.map(c =>
        c.id === editingCinema.id
          ? {
              ...c,
              name: formData.name,
              address: formData.address,
              city: formData.city,
              phone: formData.phone,
              email: formData.email,
              facilities: facilitiesArray,
              status: formData.status,
              screens: screensArray
            }
          : c
      )
      saveCinemas(updated)
    } else {
      const newCinema: Cinema = {
        id: Date.now().toString(),
        name: formData.name,
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
        image: '',
        facilities: facilitiesArray,
        status: formData.status,
        screens: screensArray
      }
      saveCinemas([...cinemas, newCinema])
    }
    
    setShowModal(false)
    setEditingCinema(null)
  }

  // Handle delete
  const handleDelete = (id: string) => {
    const updated = cinemas.filter(c => c.id !== id)
    saveCinemas(updated)
    setDeleteConfirm(null)
  }

  // Toggle facility
  const toggleFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }))
  }

  // Open create modal
  const handleOpenCreate = () => {
    setEditingCinema(null)
    setFormData({
      name: '',
      address: '',
      city: 'Bangkok',
      phone: '',
      email: '',
      facilities: [],
      status: 'active',
      screens: 'Screen 1:150, Screen 2:120'
    })
    setShowModal(true)
  }

  // Open edit modal
  const handleOpenEdit = (cinema: Cinema) => {
    setEditingCinema(cinema)
    setFormData({
      name: cinema.name,
      address: cinema.address,
      city: cinema.city,
      phone: cinema.phone,
      email: cinema.email,
      facilities: cinema.facilities,
      status: cinema.status,
      screens: cinema.screens.map(s => `${s.name}:${s.capacity}`).join(', ')
    })
    setShowModal(true)
  }

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'City', 'Address', 'Phone', 'Email', 'Screens', 'Status']
    const rows = cinemas.map(c => [
      c.name,
      c.city,
      c.address,
      c.phone,
      c.email,
      c.screens.length,
      c.status
    ])
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cinemas.csv'
    a.click()
  }

  const totalScreens = cinemas.reduce((acc, c) => acc + c.screens.length, 0)
  const totalCapacity = cinemas.reduce((acc, c) => acc + c.screens.reduce((s, screen) => s + screen.capacity, 0), 0)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Cinemas</h1>
          <p className="text-slate-400 mt-1">Manage cinema locations and screens</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-xl text-slate-300 text-sm transition">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition">
            <Plus className="w-4 h-4" />
            <span>Add Cinema</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search cinemas by name, city or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Building2 className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total Cinemas</p>
                <p className="text-xl font-bold text-white">{cinemas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Grid className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total Screens</p>
                <p className="text-xl font-bold text-white">{totalScreens}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Users className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total Capacity</p>
                <p className="text-xl font-bold text-white">{totalCapacity}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Cities</p>
                <p className="text-xl font-bold text-white">{new Set(cinemas.map(c => c.city)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cinemas Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCinemas.map((cinema) => (
            <div 
              key={cinema.id}
              className="group bg-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300"
            >
              {/* Cinema Image */}
              <div className="relative h-36 bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center">
                <Building2 className="w-14 h-14 text-slate-500" />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className="px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
                    {cinema.city}
                  </span>
                  <span className={`px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded-lg text-xs border ${getStatusColor(cinema.status)}`}>
                    {cinema.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2">{cinema.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{cinema.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{cinema.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Mail className="w-4 h-4" />
                    <span className="line-clamp-1">{cinema.email}</span>
                  </div>
                </div>

                {/* Facilities */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cinema.facilities.slice(0, 4).map((facility, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">
                      {facility}
                    </span>
                  ))}
                  {cinema.facilities.length > 4 && (
                    <span className="px-2 py-1 text-slate-500 text-xs">
                      +{cinema.facilities.length - 4} more
                    </span>
                  )}
                </div>

                {/* Screens Info */}
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Grid className="w-4 h-4" />
                    {cinema.screens.length} Screens
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {cinema.screens.reduce((s, screen) => s + screen.capacity, 0)} seats
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => setViewCinema(cinema)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl text-sm transition"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button 
                    onClick={() => handleOpenEdit(cinema)}
                    className="px-3 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {deleteConfirm === cinema.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(cinema.id)}
                        className="px-3 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setDeleteConfirm(cinema.id)}
                      className="px-3 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredCinemas.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No cinemas found</p>
          <p className="text-slate-500 text-sm mt-2">Try adjusting your search</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl bg-slate-800 border-slate-700 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                {editingCinema ? 'Edit Cinema' : 'Create New Cinema'}
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Cinema Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Facilities</label>
                  <div className="flex flex-wrap gap-2">
                    {allFacilities.map(facility => (
                      <button
                        key={facility}
                        type="button"
                        onClick={() => toggleFacility(facility)}
                        className={`px-3 py-1 rounded-lg text-sm transition ${
                          formData.facilities.includes(facility)
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                            : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                        }`}
                      >
                        {facility}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Screens (format: Name:Capacity, comma separated)</label>
                  <input
                    type="text"
                    value={formData.screens}
                    onChange={(e) => setFormData({ ...formData, screens: e.target.value })}
                    placeholder="Screen 1:150, Screen 2:120"
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
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
                    {editingCinema ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Modal */}
      {viewCinema && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                {viewCinema.name}
                <button onClick={() => setViewCinema(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 rounded-lg text-xs border ${getStatusColor(viewCinema.status)}`}>
                  {viewCinema.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{viewCinema.address}, {viewCinema.city}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>{viewCinema.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>{viewCinema.email}</span>
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-xs mb-2">Facilities</p>
                <div className="flex flex-wrap gap-2">
                  {viewCinema.facilities.map((facility, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-xs mb-2">Screens</p>
                <div className="space-y-2">
                  {viewCinema.screens.map((screen, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-700/30 p-2 rounded-lg">
                      <span className="text-white">{screen.name}</span>
                      <span className="text-slate-400 text-sm">{screen.capacity} seats</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => {
                    handleOpenEdit(viewCinema)
                    setViewCinema(null)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Cinema
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
