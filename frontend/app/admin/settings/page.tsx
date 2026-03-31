'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  Save, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Mail,
  Phone,
  Building2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

// Settings interface
interface SystemSettings {
  siteName: string
  siteEmail: string
  sitePhone: string
  siteAddress: string
  timezone: string
  currency: string
  language: string
}

interface NotificationSettings {
  emailBookings: boolean
  emailPromotions: boolean
  smsBookings: boolean
  smsPromotions: boolean
  pushNotifications: boolean
}

interface SecuritySettings {
  twoFactorAuth: boolean
  sessionTimeout: number
  passwordExpiry: number
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // General Settings
  const [generalSettings, setGeneralSettings] = useState<SystemSettings>({
    siteName: 'CineBook',
    siteEmail: 'info@cinebook.com',
    sitePhone: '+1 234 567 8900',
    siteAddress: '123 Movie Street, Cinema City',
    timezone: 'Asia/Bangkok',
    currency: 'USD',
    language: 'en'
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailBookings: true,
    emailPromotions: true,
    smsBookings: false,
    smsPromotions: false,
    pushNotifications: true
  })

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90
  })

  const handleSave = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    }, 1000)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: <Settings className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> }
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-1">Manage your application settings and preferences.</p>
        </div>
        
        {/* Save Button */}
        <Button 
          onClick={handleSave}
          disabled={isLoading}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
          ) : isSaved ? (
            <span className="mr-2">✓</span>
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isSaved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-orange-500/20 text-orange-500 border-l-4 border-orange-500'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3">
          {activeTab === 'general' && (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  General Settings
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configure your site's basic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName" className="text-slate-300">Site Name</Label>
                    <Input
                      id="siteName"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteEmail" className="text-slate-300">Site Email</Label>
                    <Input
                      id="siteEmail"
                      type="email"
                      value={generalSettings.siteEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, siteEmail: e.target.value })}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sitePhone" className="text-slate-300">Site Phone</Label>
                    <Input
                      id="sitePhone"
                      type="tel"
                      value={generalSettings.sitePhone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, sitePhone: e.target.value })}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-slate-300">Timezone</Label>
                    <select
                      id="timezone"
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="Asia/Bangkok">Asia/Bangkok (UTC+7)</option>
                      <option value="America/New_York">America/New_York (UTC-5)</option>
                      <option value="Europe/London">Europe/London (UTC+0)</option>
                      <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-slate-300">Currency</Label>
                    <select
                      id="currency"
                      value={generalSettings.currency}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="THB">THB (฿)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-slate-300">Default Language</Label>
                    <select
                      id="language"
                      value={generalSettings.language}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="en">English</option>
                      <option value="th">Thai</option>
                      <option value="ja">Japanese</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteAddress" className="text-slate-300">Site Address</Label>
                  <Input
                    id="siteAddress"
                    value={generalSettings.siteAddress}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteAddress: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Notifications */}
                <div className="space-y-4">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Notifications
                  </h4>
                  <div className="space-y-4 pl-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-300">Booking Confirmations</Label>
                        <p className="text-slate-500 text-xs">Receive emails for new bookings</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailBookings}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailBookings: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-300">Promotions & Updates</Label>
                        <p className="text-slate-500 text-xs">Receive promotional emails</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailPromotions}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailPromotions: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700/50 pt-6 space-y-4">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    SMS Notifications
                  </h4>
                  <div className="space-y-4 pl-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-300">Booking Confirmations</Label>
                        <p className="text-slate-500 text-xs">Receive SMS for new bookings</p>
                      </div>
                      <Switch
                        checked={notificationSettings.smsBookings}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsBookings: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-300">Promotions & Updates</Label>
                        <p className="text-slate-500 text-xs">Receive promotional SMS</p>
                      </div>
                      <Switch
                        checked={notificationSettings.smsPromotions}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsPromotions: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700/50 pt-6 space-y-4">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Push Notifications
                  </h4>
                  <div className="space-y-4 pl-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-slate-300">Enable Push Notifications</Label>
                        <p className="text-slate-500 text-xs">Receive push notifications in browser</p>
                      </div>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, pushNotifications: checked })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configure security and authentication options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <Label className="text-slate-300 text-lg">Two-Factor Authentication</Label>
                      <p className="text-slate-500 text-sm">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Session Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout" className="text-slate-300">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        min={5}
                        max={120}
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passwordExpiry" className="text-slate-300">Password Expiry (days)</Label>
                      <Input
                        id="passwordExpiry"
                        type="number"
                        min={30}
                        max={365}
                        value={securitySettings.passwordExpiry}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: parseInt(e.target.value) })}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Additional Security</h4>
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-300">Change Password</p>
                        <p className="text-slate-500 text-sm">Update your account password</p>
                      </div>
                      <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
