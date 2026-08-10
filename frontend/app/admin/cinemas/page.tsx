'use client'

import { useRef, useState, useEffect } from 'react'
import { cinemasAPI } from '@/lib/api'
import { Search, Plus, Edit2, Trash2, X, Eye, Download, MapPin, Phone, Mail, Building2, Grid, Users, Loader2, CheckCircle, Upload, Image as ImageIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Cinema } from '@/types'

interface ExtendedCinema extends Cinema {
  screens?: Array<{ id: string; name: string; capacity: number; screenType?: string }>
}

const allFacilities = ['Parking', 'Food Court', 'VIP Lounge', '3D Screens', 'IMAX', '4DX', 'Dolby Atmos', 'Bar', 'Gaming Zone', 'Wheelchair Access']

const safeJsonArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[]
  if (typeof value !== 'string') return []
  try {
    const parsed = JSON.parse(value || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const createSeatLayout = (capacity: number) => {
  const rows = Math.max(1, Math.ceil(capacity / 12))
  const seatsPerRow = Math.max(1, Math.ceil(capacity / rows))
  return {
    rows,
    seatsPerRow,
    aislePositions: seatsPerRow >= 8 ? [Math.ceil(seatsPerRow / 2)] : [],
  }
}

export default function AdminCinemasPage() {
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const [cinemas, setCinemas] = useState<ExtendedCinema[]>([])
  const [filteredCinemas, setFilteredCinemas] = useState<ExtendedCinema[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingCinema, setEditingCinema] = useState<ExtendedCinema | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewCinema, setViewCinema] = useState<ExtendedCinema | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: 'Phnom Penh',
    phone: '',
    email: '',
    facilities: [] as string[],
    isActive: true,
    image: '',
    screens: '' // Format: Name:Capacity:Type
  })

  const getCinemaScreens = (cinema: ExtendedCinema) => {
    if (!cinema) return []
    return safeJsonArray<{ id: string; name: string; capacity: number; screenType?: string }>(cinema.screens)
  }

  const loadCinemas = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await cinemasAPI.getAdminAll({ limit: 100 })
      if (response.success && response.data?.cinemas) {
        const parsedCinemas = response.data.cinemas.map((c: any) => ({
          ...c,
          facilities: safeJsonArray<string>(c.facilities),
          screens: safeJsonArray(c.screens)
        }))
        setCinemas(parsedCinemas)
        setFilteredCinemas(parsedCinemas)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load cinemas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCinemas()
  }, [])

  useEffect(() => {
    const filtered = cinemas.filter(cinema =>
      cinema.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cinema.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cinema.address?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCinemas(filtered)
  }, [searchTerm, cinemas])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const facilitiesArray = formData.facilities
      const existingScreens = editingCinema ? getCinemaScreens(editingCinema) : []
      const screensArray = formData.screens.split(',').map((s, i) => {
        const parts = s.trim().split(':')
        const capacity = parseInt(parts[1]) || 100
        const existingScreen = existingScreens[i]
        return {
          id: existingScreen?.id || `screen-${Date.now()}-${i + 1}`,
          cinemaId: editingCinema?.id || '',
          name: parts[0] || 'Screen',
          capacity,
          screenType: parts[2] || 'standard',
          seatLayout: createSeatLayout(capacity)
        }
      }).filter(s => s.name)

      const cinemaData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
        facilities: facilitiesArray,
        isActive: formData.isActive,
        image: formData.image || '',
        screens: screensArray
      }

      if (editingCinema) {
        const response = await cinemasAPI.update(editingCinema.id, cinemaData)
        if (response.success && response.data) {
          const parsed = {
            ...response.data,
            facilities: safeJsonArray<string>(response.data.facilities),
            screens: safeJsonArray(response.data.screens)
          }
          setCinemas(cinemas.map(c => c.id === editingCinema.id ? parsed : c))
          setShowModal(false)
          setEditingCinema(null)
        } else {
          setError(response.message || 'Failed to update cinema')
        }
      } else {
        const response = await cinemasAPI.create(cinemaData)
        if (response.success && response.data) {
          const parsed = {
            ...response.data,
            facilities: safeJsonArray<string>(response.data.facilities),
            screens: safeJsonArray(response.data.screens)
          }
          setCinemas([parsed, ...cinemas])
          setShowModal(false)
        } else {
          setError(response.message || 'Failed to create cinema')
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await cinemasAPI.delete(id)
      if (response.success) {
        setCinemas(cinemas.filter(c => c.id !== id))
        setDeleteConfirm(null)
      } else {
        setError(response.message || 'Failed to delete cinema')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete cinema')
    }
  }

  const toggleFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImageError(null)

    if (!file.type.startsWith('image/')) {
      setImageError('Please choose a PNG, JPG, or WebP image.')
      event.target.value = ''
      return
    }

    if (file.size > 1024 * 1024) {
      setImageError('Please choose an image smaller than 1MB.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setFormData((current) => ({ ...current, image: String(reader.result || '') }))
    }
    reader.onerror = () => setImageError('Could not read this image. Please try another file.')
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setFormData((current) => ({ ...current, image: '' }))
    setImageError(null)
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const handleOpenCreate = () => {
    setEditingCinema(null)
    setImageError(null)
    setFormData({
      name: '',
      address: '',
      city: 'Phnom Penh',
      phone: '',
      email: '',
      facilities: [],
      isActive: true,
      image: '',
      screens: 'Screen 1:150:standard, Screen 2:120:standard'
    })
    setShowModal(true)
  }

  const handleOpenEdit = (cinema: ExtendedCinema) => {
    const cinemaScreens = getCinemaScreens(cinema)
    setEditingCinema(cinema)
    setImageError(null)
    setFormData({
      name: cinema.name || '',
      address: cinema.address || '',
      city: cinema.city || 'Phnom Penh',
      phone: cinema.phone || '',
      email: cinema.email || '',
      facilities: Array.isArray(cinema.facilities) ? cinema.facilities : [],
      isActive: cinema.isActive !== false,
      image: cinema.image || '',
      screens: cinemaScreens.map(s => `${s.name}:${s.capacity}:${s.screenType || 'standard'}`).join(', ')
    })
    setShowModal(true)
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  }

  const exportToCSV = () => {
    const headers = ['Name', 'City', 'Address', 'Phone', 'Email', 'Screens', 'Active']
    const rows = cinemas.map(c => [
      c.name,
      c.city,
      c.address,
      c.phone,
      c.email,
      getCinemaScreens(c).length,
      c.isActive ? 'Yes' : 'No'
    ])
    
    const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cinemas.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalScreens = cinemas.reduce((acc, c) => acc + getCinemaScreens(c).length, 0)
  const totalCapacity = cinemas.reduce((acc, c) => acc + getCinemaScreens(c).reduce((sum, s) => sum + (s.capacity || 0), 0), 0)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Cinemas</h1>
          <p className="text-slate-400 mt-1">Manage cinema locations and screens</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={exportToCSV}
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={handleOpenCreate}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Cinema
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          type="text"
          placeholder="Search cinemas by name, city or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-800/80 border-slate-700/50 text-white placeholder:text-slate-500"
        />
      </div>

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

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCinemas.map((cinema) => {
            const cinemaScreens = getCinemaScreens(cinema)
            return (
              <div 
                key={cinema.id}
                className="group bg-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300"
              >
                <div className="relative h-36 overflow-hidden bg-slate-900">
                  {cinema.image ? (
                    <img src={cinema.image} alt={cinema.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-800">
                      <Building2 className="w-14 h-14 text-slate-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
                      {cinema.city}
                    </span>
                    <span className={`px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded-lg text-xs border ${getStatusColor(cinema.isActive !== false)}`}>
                      {cinema.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

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

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {Array.isArray(cinema.facilities) && cinema.facilities.slice(0, 4).map((facility, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">
                        {facility}
                      </span>
                    ))}
                    {Array.isArray(cinema.facilities) && cinema.facilities.length > 4 && (
                      <span className="px-2 py-1 text-slate-500 text-xs">
                        +{cinema.facilities.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Grid className="w-4 h-4" />
                      {cinemaScreens.length} Screens
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {cinemaScreens.reduce((sum, s) => sum + (s.capacity || 0), 0)} seats
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => setViewCinema(cinema)}
                      className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEdit(cinema)}
                      className="text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    {deleteConfirm === cinema.id ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(cinema.id)}
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm(null)}
                          className="text-slate-400 hover:text-white hover:bg-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirm(cinema.id)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {filteredCinemas.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No cinemas found</p>
        </div>
      )}

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
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Address</label>
                  <Input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">City</label>
                    <Input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Phone</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-slate-300 text-sm">Cinema Image</label>
                  <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
                    <div className="relative h-32 overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
                      {formData.image ? (
                        <img src={formData.image} alt="Cinema preview" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-500">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => imageInputRef.current?.click()}
                          className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                        {formData.image && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={clearImage}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        )}
                      </div>
                      <Input
                        type="text"
                        value={formData.image}
                        onChange={(e) => {
                          setFormData({ ...formData, image: e.target.value })
                          setImageError(null)
                        }}
                        placeholder="Paste image URL or upload a file"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                      <p className="text-xs leading-5 text-slate-500">Upload PNG, JPG, or WebP under 1MB. You can also paste an image URL.</p>
                      {imageError && <p className="text-xs text-red-400">{imageError}</p>}
                    </div>
                  </div>
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
                  <label className="text-slate-300 text-sm">Screens (Name:Capacity:Type, comma separated)</label>
                  <Input
                    type="text"
                    value={formData.screens}
                    onChange={(e) => setFormData({ ...formData, screens: e.target.value })}
                    placeholder="Screen 1:150:standard, Screen 2:120:imax"
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                  <p className="text-slate-500 text-xs">Example: Screen 1:150:standard, Screen 2:120:imax, VIP Screen:50:dolby_atmos</p>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Status</label>
                  <select
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingCinema ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

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
              <div className="h-44 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
                {viewCinema.image ? (
                  <img src={viewCinema.image} alt={viewCinema.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-500">
                    <Building2 className="h-10 w-10" />
                    <span className="text-sm">No cinema image</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge className={getStatusColor(viewCinema.isActive !== false)}>
                  {viewCinema.isActive !== false ? 'Active' : 'Inactive'}
                </Badge>
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
                  {Array.isArray(viewCinema.facilities) && viewCinema.facilities.map((facility, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-xs mb-2">Screens</p>
                <div className="space-y-2">
                  {getCinemaScreens(viewCinema).map((screen, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-700/30 p-2 rounded-lg">
                      <span className="text-white">{screen.name}</span>
                      <span className="text-slate-400 text-sm">{screen.capacity} seats ({screen.screenType})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <Button
                  onClick={() => {
                    handleOpenEdit(viewCinema)
                    setViewCinema(null)
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Cinema
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
