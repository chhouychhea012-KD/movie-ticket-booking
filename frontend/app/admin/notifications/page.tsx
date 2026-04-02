'use client'

import { useState, useEffect } from 'react'
import { notificationsAPI } from '@/lib/api'
import { Bell, Ticket, AlertCircle, CheckCircle, Check, Trash2, Filter, Search, Plus, X, Loader2, MessageSquare, Zap, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Notification {
  id: string
  type: 'booking' | 'alert' | 'success' | 'system'
  title: string
  message: string
  time: string
  date: string
  read: boolean
  createdAt: string
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
    case 'booking': return { icon: 'text-orange-500', bg: 'bg-orange-500/10', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30' }
    case 'alert': return { icon: 'text-yellow-500', bg: 'bg-yellow-500/10', badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' }
    case 'success': return { icon: 'text-green-500', bg: 'bg-green-500/10', badge: 'bg-green-500/20 text-green-400 border-green-500/30' }
    case 'system': return { icon: 'text-blue-500', bg: 'bg-blue-500/10', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
    default: return { icon: 'text-slate-500', bg: 'bg-slate-500/10', badge: 'bg-slate-500/20 text-slate-400 border-slate-500/30' }
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0, typeCounts: {} as Record<string, number> })
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    type: 'system' as string,
    title: '',
    message: ''
  })

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await notificationsAPI.getAll({ limit: 100 })
      if (response.success && response.data?.notifications) {
        setNotifications(response.data.notifications)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await notificationsAPI.getStats()
      if (response.success && response.data) {
        setStats(response.data)
      }
    } catch (err: any) {
      console.error('Failed to load stats:', err)
    }
  }

  useEffect(() => {
    loadNotifications()
    loadStats()
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
      loadStats()
    } catch (err: any) {
      console.error('Failed to mark as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead()
      setNotifications(notifications.map(n => ({ ...n, read: true })))
      loadStats()
    } catch (err: any) {
      console.error('Failed to mark all as read:', err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await notificationsAPI.delete(id)
      setNotifications(notifications.filter(n => n.id !== id))
      loadStats()
    } catch (err: any) {
      console.error('Failed to delete notification:', err)
    }
  }

  const handleDeleteAll = async () => {
    try {
      await notificationsAPI.deleteAll()
      setNotifications([])
      loadStats()
    } catch (err: any) {
      console.error('Failed to delete all:', err)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await notificationsAPI.create({
        type: formData.type,
        title: formData.title,
        message: formData.message
      })
      if (response.success && response.data) {
        setNotifications([response.data, ...notifications])
        setShowModal(false)
        setFormData({ type: 'system', title: '', message: '' })
        loadStats()
      }
    } catch (err: any) {
      console.error('Failed to create notification:', err)
    } finally {
      setIsSubmitting(false)
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
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Notifications</h1>
          <p className="text-slate-400 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'No unread notifications'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setShowModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Notification
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Bell className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total</p>
                <p className="text-xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <MessageSquare className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Unread</p>
                <p className="text-xl font-bold text-white">{stats.unread}</p>
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
                <p className="text-slate-400 text-xs">Read</p>
                <p className="text-xl font-bold text-white">{stats.read}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Alerts</p>
                <p className="text-xl font-bold text-white">{stats.typeCounts?.alert || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleMarkAllAsRead}
            variant="outline"
            disabled={unreadCount === 0}
            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark all read
          </Button>
          <Button 
            onClick={handleDeleteAll}
            variant="outline"
            disabled={notifications.length === 0}
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear all
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 w-full md:w-64"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="booking">Bookings</option>
            <option value="alert">Alerts</option>
            <option value="success">Success</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No notifications found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {filteredNotifications.map((notification) => {
                const Icon = getIcon(notification.type)
                const colors = getColors(notification.type)
                return (
                  <div 
                    key={notification.id}
                    className={`p-4 hover:bg-slate-700/30 transition ${!notification.read ? 'bg-slate-700/20' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${colors.icon}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-medium">{notification.title}</h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-orange-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-slate-400 text-sm mb-2">{notification.message}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <Badge className={colors.badge}>{notification.type}</Badge>
                          <span>{formatTime(notification.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-slate-400 hover:text-white hover:bg-slate-600"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(notification.id)}
                          className="text-slate-400 hover:text-red-400 hover:bg-slate-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Create Notification
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="system">System</option>
                    <option value="booking">Booking</option>
                    <option value="alert">Alert</option>
                    <option value="success">Success</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Title</label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
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
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}