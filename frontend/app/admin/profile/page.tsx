'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Mail, Phone, Shield, CreditCard, Bell, Lock, Save, Loader2, Camera } from 'lucide-react'

export default function AdminProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@cinemahub.com',
    phone: '+855 12 345 678',
  })

  const handleSaveProfile = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
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
                    AU
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-orange-500 rounded-full text-white hover:bg-orange-600 transition">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-white font-semibold mt-4">Admin User</h3>
                <p className="text-slate-400 text-sm">admin@cinemahub.com</p>
                <span className="inline-block mt-2 px-3 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">Administrator</span>
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
                <h2 className="text-2xl font-bold text-white mb-6">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-medium">Email Notifications</h4>
                      <p className="text-slate-400 text-sm">Receive updates via email</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-medium">Booking Alerts</h4>
                      <p className="text-slate-400 text-sm">Get notified about new bookings</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-medium">System Alerts</h4>
                      <p className="text-slate-400 text-sm">Important system notifications</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
                    <div>
                      <h4 className="text-white font-medium">Marketing Updates</h4>
                      <p className="text-slate-400 text-sm">News and promotional content</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500" />
                  </div>
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
