'use client'

import { Bell, Search, LogOut, Home, User, Settings, CreditCard, Shield, X, Ticket, AlertCircle, CheckCircle, Info } from 'lucide-react'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { notificationsAPI } from '@/lib/api'

interface Notification {
  id: string
  type: 'booking' | 'alert' | 'success' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: string
}

export default function AdminHeader() {
  const { user, logout } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  const loadNotifications = async () => {
    try {
      setLoadingNotifications(true)
      const response = await notificationsAPI.getAll({ limit: 10 })
      if (response.success && response.data?.notifications) {
        setNotifications(response.data.notifications)
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoadingNotifications(false)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  // Handle logout - clear everything and redirect
  const handleLogout = () => {
    logout()
    setShowProfileDropdown(false)
  }

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }
    
    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileDropdown])

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
      loadNotifications()
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  const handleToggleProfileDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowProfileDropdown(!showProfileDropdown)
    setShowNotifications(false)
  }

  const handleToggleNotifications = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowNotifications(!showNotifications)
    setShowProfileDropdown(false)
  }

  const handleMenuItemClick = () => {
    setShowProfileDropdown(false)
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead()
      setNotifications(notifications.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

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

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return Ticket
      case 'alert': return AlertCircle
      case 'success': return CheckCircle
      case 'system': return Info
      default: return Bell
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'booking': return 'text-orange-500'
      case 'alert': return 'text-yellow-500'
      case 'success': return 'text-green-500'
      case 'system': return 'text-blue-500'
      default: return 'text-slate-500'
    }
  }

  const profileMenuItems = [
    { icon: User, label: 'My Profile', href: '/admin/profile' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
    { icon: Shield, label: 'Security', href: '/admin/settings?tab=security' },
    { icon: CreditCard, label: 'Billing', href: '/admin/settings?tab=billing' },
  ]

  return (
    <header className="h-16 bg-slate-800/80 backdrop-blur-lg border-b border-slate-700/50 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search movies, bookings, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:bg-slate-700 transition"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {/* Back to Site */}
        <Link 
          href="/" 
          className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">View Site</span>
        </Link>

        {/* Notifications with Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={handleToggleNotifications}
            className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div 
              className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50"
              style={{ animation: 'fadeIn 0.2s ease-out' }}
            >
              <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-white font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-xs text-orange-500 hover:text-orange-400"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {loadingNotifications ? (
                  <div className="px-4 py-8 text-center text-slate-400">Loading...</div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-slate-400">No notifications</div>
                ) : (
                  notifications.map((notification) => {
                    const Icon = getIcon(notification.type)
                    const color = getColor(notification.type)
                    return (
                      <div 
                        key={notification.id}
                        onClick={() => handleMarkAsRead(notification.id)}
                        className={`px-4 py-3 border-b border-slate-700/50 hover:bg-slate-700/50 transition cursor-pointer ${
                          !notification.read ? 'bg-slate-700/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 ${color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-white text-sm font-medium">{notification.title}</p>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-orange-500 rounded-full" />
                              )}
                            </div>
                            <p className="text-slate-400 text-xs mt-0.5 truncate">{notification.message}</p>
                            <p className="text-slate-500 text-xs mt-1">{formatTime(notification.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              <div className="px-4 py-3 border-t border-slate-700">
                <Link 
                  href="/admin/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-center text-sm text-orange-500 hover:text-orange-400 block"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile with Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <button 
            type="button"
            onClick={handleToggleProfileDropdown}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-700 transition"
          >
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm text-white font-medium">{user?.firstName || user?.email?.split('@')[0] || 'Admin'}</p>
              <p className="text-xs text-slate-400">{user?.role === 'admin' ? 'Administrator' : user?.role || 'User'}</p>
            </div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`text-slate-400 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileDropdown && (
            <div 
              className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50"
              style={{ animation: 'fadeIn 0.2s ease-out' }}
            >
              <div className="px-4 py-3 border-b border-slate-700">
                <p className="text-sm text-white font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
              <div className="py-2">
                {profileMenuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={handleMenuItemClick}
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </div>
              <div className="border-t border-slate-700 py-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-red-400 hover:bg-slate-700 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
