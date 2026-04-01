'use client'

import { useState, useEffect } from 'react'
import { notificationsAPI } from '@/lib/api'
import { Bell, Ticket, AlertCircle, CheckCircle, Check, Trash2, Filter, Search } from 'lucide-react'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Load notifications from API
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await notificationsAPI.getAll({ limit: 100 })
        if (response.success && response.data?.notifications) {
          // Transform API data to include icon and colors
          const transformed = response.data.notifications.map((n: any) => ({
            ...n,
            icon: n.type === 'booking' ? Ticket : n.type === 'alert' ? AlertCircle : n.type === 'success' ? CheckCircle : Bell,
            color: n.type === 'booking' ? 'text-orange-500' : n.type === 'alert' ? 'text-yellow-500' : n.type === 'success' ? 'text-green-500' : 'text-blue-500',
            bgColor: n.type === 'booking' ? 'bg-orange-500/10' : n.type === 'alert' ? 'bg-yellow-500/10' : n.type === 'success' ? 'bg-green-500/10' : 'bg-blue-500/10'
          }))
          setNotifications(transformed)
        } else {
          setNotifications([])
        }
      } catch (error) {
        console.error('Failed to load notifications:', error)
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }
    loadNotifications()
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read) ||
      (filter === notification.type)
    
    const matchesSearch = !searchQuery || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

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

  const handleDeleteAll = async () => {
    try {
      await notificationsAPI.deleteAll()
      setNotifications([])
    } catch (error) {
      console.error('Failed to delete all notifications:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white">Notifications</h1>
            <p className="text-slate-400 mt-1">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'No unread notifications'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-slate-300 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              Mark all read
            </button>
            <button 
              onClick={handleDeleteAll}
              disabled={notifications.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="booking">Bookings</option>
              <option value="alert">Alerts</option>
              <option value="success">Success</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No notifications found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 hover:bg-slate-700/30 transition ${
                    !notification.read ? 'bg-slate-700/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full ${notification.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <notification.icon className={`w-5 h-5 ${notification.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-medium">{notification.title}</h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-orange-500 rounded-full" />
                        )}
                      </div>
                      <p className="text-slate-400 text-sm mb-1">{notification.message}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{notification.time}</span>
                        <span>{notification.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.read && (
                        <button 
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
