'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { User, Mail, Phone, Heart, History, Settings, Bell, CreditCard, LogOut, Camera, Save, Loader2, Ticket, Star } from 'lucide-react'
import BookingCard from '@/components/booking-card'

export default function ProfilePage() {
  const router = useRouter()
  const { user, movies, bookings, updateProfile, removeFavoriteMovie } = useApp()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Please login to view your profile</p>
          <Link href="/auth/login" className="text-orange-500 hover:text-orange-400 text-lg">
            Login here
          </Link>
        </div>
      </div>
    )
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    updateProfile(formData)
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleLogout = () => {
    // Clear all authentication-related data
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('bookings')
    localStorage.removeItem('cinemahub_bookings')
    
    // Reset state and reload
    if (typeof window !== 'undefined') {
      window.location.replace('/')
    }
  }

  const favoriteMovies = movies.filter(m => user.favoriteMovies.includes(m.id))
  const userBookings = bookings.filter(b => b.userId === user.id || b.userId === 'guest').map(b => ({
    id: b.id,
    movieTitle: b.movieTitle,
    showtime: b.showtime,
    seats: b.seats.map(s => s.seatNumber),
    ticketPrice: b.ticketPrice,
    totalPrice: b.totalPrice,
    bookingDate: b.bookingDate,
    status: b.status,
  }))

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'bookings', label: 'My Bookings', icon: History },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">My Account</h1>
          <p className="text-slate-400">Manage your profile and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-orange-500 rounded-full text-white hover:bg-orange-600 transition">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-white font-semibold mt-4">{user.firstName} {user.lastName}</h3>
                <p className="text-slate-400 text-sm">{user.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                      activeTab === tab.id
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-400 hover:bg-red-500/20 transition"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                  <button
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-600 text-white rounded-xl transition"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-orange-500"
                      />
                    ) : (
                      <p className="text-white text-lg">{user.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-orange-500"
                      />
                    ) : (
                      <p className="text-white text-lg">{user.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-orange-500"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-slate-500" />
                        <p className="text-white text-lg">{user.email}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-orange-500"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-slate-500" />
                        <p className="text-white text-lg">{user.phone || 'Not set'}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <h3 className="text-xl font-bold text-white mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <span className="text-white">Email Notifications</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={user.notifications.email}
                        onChange={() => updateProfile({ notifications: { ...user.notifications, email: !user.notifications.email } })}
                        className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500"
                      />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-slate-400" />
                        <span className="text-white">SMS Notifications</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={user.notifications.sms}
                        onChange={() => updateProfile({ notifications: { ...user.notifications, sms: !user.notifications.sms } })}
                        className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">My Bookings</h2>
                {userBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Ticket className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No bookings yet</p>
                    <Link href="/" className="text-orange-500 hover:text-orange-400 mt-2 inline-block">
                      Browse movies
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {userBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} showActions />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Favorite Movies</h2>
                {favoriteMovies.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No favorite movies yet</p>
                    <Link href="/" className="text-orange-500 hover:text-orange-400 mt-2 inline-block">
                      Browse movies
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteMovies.map((movie) => (
                      <div key={movie.id} className="relative group">
                        <div className="bg-slate-700/50 rounded-xl overflow-hidden">
                          <div className="h-48 bg-slate-600 flex items-center justify-center">
                            <span className="text-slate-400">Movie Poster</span>
                          </div>
                          <div className="p-4">
                            <h3 className="text-white font-semibold">{movie.title}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-orange-500 text-sm">{(Array.isArray(movie.genre) ? movie.genre : String(movie.genre || '').split(',')).join(', ')}</span>
                              <span className="text-yellow-400 text-sm flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" />
                                {movie.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFavoriteMovie(movie.id)}
                          className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-medium">Booking Confirmations</h4>
                      <p className="text-slate-400 text-sm">Get notified when your booking is confirmed</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-medium">Showtime Reminders</h4>
                      <p className="text-slate-400 text-sm">Receive reminders before your show starts</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-medium">Promotions & Offers</h4>
                      <p className="text-slate-400 text-sm">Get updates on special offers and promotions</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-medium">New Movie Releases</h4>
                      <p className="text-slate-400 text-sm">Be the first to know about new movies</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Payment Methods</h2>
                  <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition">
                    Add New Card
                  </button>
                </div>
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">No payment methods saved</p>
                  <p className="text-slate-500 text-sm mt-2">Add a card to faster checkout</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}