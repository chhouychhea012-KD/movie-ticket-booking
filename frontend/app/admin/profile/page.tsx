'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { authAPI, notificationsAPI } from '@/lib/api'
import { User, Mail, Phone, Shield, CreditCard, Bell, Lock, Save, Loader2, Camera, Ticket, AlertCircle, CheckCircle, Info, X, Check, Trash2 } from 'lucide-react'

interface Notification {
  id: string
  type: 'booking' | 'alert' | 'success' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: string
}

export default function AdminProfilePage() {
  const { user: appUser } = useApp()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const [formData, setFormData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@cinemahub.com',
    phone: '+855 12 888 888',
  })

  useEffect(() => {
    loadUserProfile()
  }, [appUser])

  const loadUserProfile = async () => {
    try {
      if (appUser) {
        setFormData({
          firstName: appUser.firstName || 'Admin',
          lastName: appUser.lastName || 'User',
          email: appUser.email || 'admin@cinemahub.com',
          phone: appUser.phone || '+855 12 888 888',
        })
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadNotifications = async () => {
    try {
      setLoadingNotifications(true)
      const response = await notificationsAPI.getAll({ limit: 50 })
      if (response.success && response.data?.notifications) {
        setNotifications(response.data.notifications)
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoadingNotifications(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'notifications') {
      loadNotifications()
    }
  }, [activeTab])

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id)
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead()
      setNotifications(notifications.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await notificationsAPI.delete(id)
      setNotifications(notifications.filter(n => n.id !== id))
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const response = await authAPI.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      })
      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return Ticket
      case 'alert': return AlertCircle
      case 'success': return CheckCircle
      case 'system': return Info
      default: return Bell
    }
  }

  const getColors = (type: string) => {
    switch (type) {
      case 'booking': return 'text-orange-500'
      case 'alert': return 'text-yellow-500'
      case 'success': return 'text-green-500'
      case 'system': return 'text-blue-500'
      default: return 'text-slate-500'
    }
  }

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      
      if (minutes < 1) return 'Just now'
      if (minutes < 60) return `${minutes}m ago`
      if (hours < 24) return `${hours}h ago`
      if (days < 7) return `${days}d ago`
      return date.toLocaleDateString()
    } catch {
      return ''
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Admin Profile</h1>
          <p className="text-slate-400">Manage your admin account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto">
                    {formData.firstName?.charAt(0) || 'A'}{formData.lastName?.charAt(0) || 'U'}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-orange-500 rounded-full text-white hover:bg-orange-600 transition">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-white font-semibold mt-4">{formData.firstName} {formData.lastName}</h3>
                <p className="text-slate-400 text-sm">{formData.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">{appUser?.role === 'admin' ? 'Administrator' : appUser?.role || 'User'}</span>
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
                <Link
                  href="/admin"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-slate-400 hover:bg-slate-700/50 hover:text-white transition"
                >
                  <Shield className="w-5 h-5" />
                  Admin Dashboard
                </Link>
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
                      <p className="text-white text-lg">{formData.firstName}</p>
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
                      <p className="text-white text-lg">{formData.lastName}</p>
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
                        <p className="text-white text-lg">{formData.email}</p>
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
                        <p className="text-white text-lg">{formData.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Role Info */}
                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <h3 className="text-xl font-bold text-white mb-4">Role & Permissions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-700/30 rounded-xl">
                      <p className="text-slate-400 text-sm">Role</p>
                      <p className="text-white font-medium">Administrator</p>
                    </div>
                    <div className="p-4 bg-slate-700/30 rounded-xl">
                      <p className="text-slate-400 text-sm">Account Status</p>
                      <p className="text-green-400 font-medium">Active</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div className="p-6 bg-slate-700/30 rounded-xl">
                    <h3 className="text-white font-semibold mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Current Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-orange-500"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-orange-500"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-orange-500"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-700/30 rounded-xl">
                    <h3 className="text-white font-semibold mb-4">Two-Factor Authentication</h3>
                    <p className="text-slate-400 mb-4">Add an extra layer of security to your account</p>
                    <label className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-slate-400" />
                        <span className="text-white">Enable 2FA</span>
                      </div>
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Notifications</h2>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <button 
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-orange-500 hover:text-orange-400"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                
                {loadingNotifications ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No notifications found</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notification) => {
                      const Icon = getIcon(notification.type)
                      const color = getColors(notification.type)
                      return (
                        <div 
                          key={notification.id}
                          className={`p-4 rounded-xl transition cursor-pointer ${
                            !notification.read ? 'bg-slate-700/30' : 'hover:bg-slate-700/50'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`mt-1 ${color}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-white font-medium">{notification.title}</p>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-orange-500 rounded-full" />
                                )}
                              </div>
                              <p className="text-slate-400 text-sm mt-1">{notification.message}</p>
                              <p className="text-slate-500 text-xs mt-2">{formatTime(notification.createdAt)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(notification.id)}
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded-lg transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-slate-700">
                  <Link 
                    href="/admin/notifications"
                    className="text-orange-500 hover:text-orange-400 text-sm"
                  >
                    View all notifications →
                  </Link>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Billing & Plans</h2>
                  <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition">
                    Upgrade Plan
                  </button>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-xl mb-6">
                  <p className="text-orange-400 text-sm font-medium">Current Plan</p>
                  <h3 className="text-white text-2xl font-bold">Enterprise Admin</h3>
                  <p className="text-slate-400 text-sm mt-2">Full access to all admin features</p>
                </div>

                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">No payment methods on file</p>
                  <p className="text-slate-500 text-sm mt-2">Add a payment method for invoices</p>
                  <button className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition">
                    Add Payment Method
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
