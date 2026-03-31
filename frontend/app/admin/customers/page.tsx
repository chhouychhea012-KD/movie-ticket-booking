'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Shield,
  X,
  Check,
  Filter,
  Download
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User } from '@/types/index'

// Mock initial users data
const initialUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8901',
    firstName: 'John',
    lastName: 'Doe',
    avatar: '',
    role: 'user',
    createdAt: '2024-01-15T10:30:00Z',
    favoriteMovies: ['Dune: Part Two', 'Oppenheimer'],
    favoriteCinemas: ['Cineplex Downtown'],
    notifications: { email: true, sms: true, push: true }
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    phone: '+1 234 567 8902',
    firstName: 'Jane',
    lastName: 'Smith',
    avatar: '',
    role: 'admin',
    createdAt: '2024-01-10T08:20:00Z',
    favoriteMovies: ['Barbie', 'The Batman'],
    favoriteCinemas: ['Cineplex Uptown'],
    notifications: { email: true, sms: false, push: true }
  },
  {
    id: '3',
    email: 'bob.wilson@example.com',
    phone: '+1 234 567 8903',
    firstName: 'Bob',
    lastName: 'Wilson',
    avatar: '',
    role: 'user',
    createdAt: '2024-02-20T14:45:00Z',
    favoriteMovies: ['Spider-Man: ATSV'],
    favoriteCinemas: ['Cineplex Downtown'],
    notifications: { email: false, sms: true, push: false }
  },
  {
    id: '4',
    email: 'alice.johnson@example.com',
    phone: '+1 234 567 8904',
    firstName: 'Alice',
    lastName: 'Johnson',
    avatar: '',
    role: 'user',
    createdAt: '2024-03-05T09:15:00Z',
    favoriteMovies: ['Dune: Part Two', 'Barbie', 'Oppenheimer'],
    favoriteCinemas: ['Cineplex Mall'],
    notifications: { email: true, sms: true, push: false }
  },
  {
    id: '5',
    email: 'charlie.brown@example.com',
    phone: '+1 234 567 8905',
    firstName: 'Charlie',
    lastName: 'Brown',
    avatar: '',
    role: 'user',
    createdAt: '2024-03-12T16:30:00Z',
    favoriteMovies: ['The Batman'],
    favoriteCinemas: ['Cineplex Downtown'],
    notifications: { email: true, sms: false, push: true }
  }
]

export default function CustomersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>('all')

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user' as 'user' | 'admin'
  })

  // Load users from localStorage or use initial data
  useEffect(() => {
    const storedUsers = localStorage.getItem('users')
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    } else {
      setUsers(initialUsers)
      localStorage.setItem('users', JSON.stringify(initialUsers))
    }
    setIsLoading(false)
  }, [])

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users))
    }
  }, [users, isLoading])

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  // Open modal for creating new user
  const handleOpenCreateModal = () => {
    setEditingUser(null)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'user'
    })
    setShowModal(true)
  }

  // Open modal for editing user
  const handleOpenEditModal = (user: User) => {
    setEditingUser(user)
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role
    })
    setShowModal(true)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      ))
    } else {
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        avatar: '',
        createdAt: new Date().toISOString(),
        favoriteMovies: [],
        favoriteCinemas: [],
        notifications: { email: true, sms: false, push: false }
      }
      setUsers([...users, newUser])
    }
    
    setShowModal(false)
    setEditingUser(null)
  }

  // Handle delete user
  const handleDelete = (id: string) => {
    setUsers(users.filter(user => user.id !== id))
    setDeleteConfirm(null)
  }

  // Export users to CSV
  const exportToCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Created At']
    const rows = users.map(user => [
      user.firstName,
      user.lastName,
      user.email,
      user.phone,
      user.role,
      user.createdAt
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users.csv'
    a.click()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Customers</h1>
          <p className="text-slate-400 mt-1">Manage your users and their permissions.</p>
        </div>
        
        {/* Actions */}
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
            onClick={handleOpenCreateModal}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'user').length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Administrators</p>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterRole === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterRole('all')}
                className={filterRole === 'all' ? 'bg-orange-500 hover:bg-orange-600' : 'border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700'}
              >
                All
              </Button>
              <Button
                variant={filterRole === 'user' ? 'default' : 'outline'}
                onClick={() => setFilterRole('user')}
                className={filterRole === 'user' ? 'bg-orange-500 hover:bg-orange-600' : 'border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700'}
              >
                Users
              </Button>
              <Button
                variant={filterRole === 'admin' ? 'default' : 'outline'}
                onClick={() => setFilterRole('admin')}
                className={filterRole === 'admin' ? 'bg-orange-500 hover:bg-orange-600' : 'border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700'}
              >
                Admins
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">User List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left text-slate-400 font-medium px-4 py-3">User</th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">Email</th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">Phone</th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">Role</th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">Joined</th>
                  <th className="text-right text-slate-400 font-medium px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail className="w-4 h-4 text-slate-500" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone className="w-4 h-4 text-slate-500" />
                        {user.phone}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={user.role === 'admin' ? 'bg-purple-500/20 text-purple-500 border-purple-500/50' : 'bg-green-500/20 text-green-500 border-green-500/50'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditModal(user)}
                          className="text-slate-400 hover:text-white hover:bg-slate-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        {deleteConfirm === user.id ? (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(user.id)}
                              className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            >
                              <Check className="w-4 h-4" />
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
                            onClick={() => setDeleteConfirm(user.id)}
                            className="text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Users className="w-12 h-12 mb-4" />
              <p>No users found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                {editingUser ? 'Edit User' : 'Create New User'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">First Name</label>
                    <Input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-300 text-sm">Last Name</label>
                    <Input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
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
                    required
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Phone</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {editingUser ? 'Update' : 'Create'}
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
