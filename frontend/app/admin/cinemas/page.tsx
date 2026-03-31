'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Search, Plus, Edit, Trash2, MapPin, Phone, Mail, Building2, Grid, Users, DollarSign, Calendar, Clock } from 'lucide-react'
import { Cinema } from '@/types'

export default function AdminCinemasPage() {
  const { cinemas, cities } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredCinemas = cinemas.filter(cinema =>
    cinema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cinema.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cinema.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Cinemas</h1>
          <p className="text-slate-400 mt-1">Manage cinema locations and screens</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search cinemas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition w-64"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Cinema</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <Building2 className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Cinemas</p>
              <p className="text-2xl font-bold text-white">{cinemas.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Grid className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Screens</p>
              <p className="text-2xl font-bold text-white">
                {cinemas.reduce((acc, c) => acc + c.screens.length, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Users className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Capacity</p>
              <p className="text-2xl font-bold text-white">2,450</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <MapPin className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Cities</p>
              <p className="text-2xl font-bold text-white">{cities.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cinemas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCinemas.map((cinema) => (
          <div 
            key={cinema.id}
            className="group bg-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300"
          >
            {/* Cinema Image */}
            <div className="relative h-40 bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center">
              <Building2 className="w-16 h-16 text-slate-500" />
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
                  {cinema.city}
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
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl text-sm transition">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="px-3 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition">
                  <Grid className="w-4 h-4" />
                </button>
                <button className="px-3 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCinemas.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No cinemas found</p>
          <p className="text-slate-500 text-sm mt-2">Try adjusting your search</p>
        </div>
      )}
    </div>
  )
}