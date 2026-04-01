'use client'

import { Bell, Search, LogOut, Home, User, Settings, CreditCard, Shield, X, Ticket, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useApp } from '@/context/AppContext'

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'booking',
    title: 'New Booking Received',
    message: 'John Doe booked 3 tickets for Dune: Part Two',
    time: '5 min ago',
    read: false,
    icon: Ticket,
    color: 'text-orange-500'
  },
  {
    id: 2,
    type: 'alert',
    title: 'Low Seat Availability',
    message: 'Only 15 seats remaining for Oppenheimer - 7PM show',
    time: '15 min ago',
    read: false,
    icon: AlertCircle,
    color: 'text-yellow-500'
  },
  {
    id: 3,
    type: 'success',
    title: 'Booking Confirmed',
    message: 'Booking #BK-2847 has been successfully paid',
    time: '1 hour ago',
    read: true,
    icon: CheckCircle,
    color: 'text-green-500'
  },
  {
    id: 4,
    type: 'alert',
    title: 'System Update',
    message: 'Server maintenance scheduled for tonight at 2AM',
    time: '2 hours ago',
    read: true,
    icon: AlertCircle,
    color: 'text-blue-500'
  },
]

export default function AdminHeader() {
  const { user, logout } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  const unreadCount = mockNotifications.filter(n => !n.read).length

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

  const handleMarkAllRead = () => {
    // In a real app, this would update the notification status
    console.log('Mark all as read')
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
                {mockNotifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`px-4 py-3 border-b border-slate-700/50 hover:bg-slate-700/50 transition cursor-pointer ${
                      !notification.read ? 'bg-slate-700/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${notification.color}`}>
                        <notification.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white text-sm font-medium">{notification.title}</p>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-orange-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-slate-400 text-xs mt-0.5 truncate">{notification.message}</p>
                        <p className="text-slate-500 text-xs mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
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
              <p className="text-sm text-white font-medium">Admin</p>
              <p className="text-xs text-slate-400">Administrator</p>
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
                <p className="text-sm text-white font-medium">Admin User</p>
                <p className="text-xs text-slate-400">admin@cinemahub.com</p>
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
