'use client'

import { useEffect, useState, type ReactNode } from 'react'
import {
  Bell,
  Building2,
  Check,
  Loader2,
  Mail,
  Phone,
  Save,
  Settings,
  Shield,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

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

const storageKey = 'cambocine_admin_settings'

const defaultSettings = {
  general: {
    siteName: 'CamboCine',
    siteEmail: 'support@cambocine.online',
    sitePhone: '+855 12 345 678',
    siteAddress: 'Phnom Penh, Cambodia',
    timezone: 'Asia/Bangkok',
    currency: 'USD',
    language: 'en',
  } satisfies SystemSettings,
  notifications: {
    emailBookings: true,
    emailPromotions: true,
    smsBookings: false,
    smsPromotions: false,
    pushNotifications: true,
  } satisfies NotificationSettings,
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
  } satisfies SecuritySettings,
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [generalSettings, setGeneralSettings] = useState<SystemSettings>(defaultSettings.general)
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultSettings.notifications)
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(defaultSettings.security)

  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get('tab')
    if (tab && ['general', 'notifications', 'security'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return
      const parsed = JSON.parse(saved)
      setGeneralSettings({ ...defaultSettings.general, ...parsed.general })
      setNotificationSettings({ ...defaultSettings.notifications, ...parsed.notifications })
      setSecuritySettings({ ...defaultSettings.security, ...parsed.security })
    } catch {
      localStorage.removeItem(storageKey)
    }
  }, [])

  const handleSave = () => {
    setIsLoading(true)
    localStorage.setItem(storageKey, JSON.stringify({
      general: generalSettings,
      notifications: notificationSettings,
      security: securitySettings,
    }))
    setIsLoading(false)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: <Settings className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white lg:text-4xl">Settings</h1>
          <p className="mt-1 text-slate-400">Manage application preferences for the admin workspace.</p>
        </div>

        <Button onClick={handleSave} disabled={isLoading} className="bg-orange-500 text-white hover:bg-orange-600">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isSaved ? <Check className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
          {isSaved ? 'Saved' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Card className="border-slate-700/50 bg-slate-800/50">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
                      activeTab === tab.id
                        ? 'border-l-4 border-orange-500 bg-orange-500/20 text-orange-400'
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
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

        <div className="lg:col-span-3">
          {activeTab === 'general' && (
            <Card className="border-slate-700/50 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Building2 className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription className="text-slate-400">Configure basic platform information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <SettingInput label="Site Name" value={generalSettings.siteName} onChange={(siteName) => setGeneralSettings({ ...generalSettings, siteName })} />
                  <SettingInput label="Site Email" type="email" value={generalSettings.siteEmail} onChange={(siteEmail) => setGeneralSettings({ ...generalSettings, siteEmail })} />
                  <SettingInput label="Site Phone" type="tel" value={generalSettings.sitePhone} onChange={(sitePhone) => setGeneralSettings({ ...generalSettings, sitePhone })} />
                  <SelectField label="Timezone" value={generalSettings.timezone} onChange={(timezone) => setGeneralSettings({ ...generalSettings, timezone })} options={[
                    ['Asia/Bangkok', 'Asia/Bangkok (UTC+7)'],
                    ['America/New_York', 'America/New_York'],
                    ['Europe/London', 'Europe/London'],
                    ['Asia/Tokyo', 'Asia/Tokyo'],
                  ]} />
                  <SelectField label="Currency" value={generalSettings.currency} onChange={(currency) => setGeneralSettings({ ...generalSettings, currency })} options={[
                    ['USD', 'USD'],
                    ['EUR', 'EUR'],
                    ['THB', 'THB'],
                    ['JPY', 'JPY'],
                  ]} />
                  <SelectField label="Default Language" value={generalSettings.language} onChange={(language) => setGeneralSettings({ ...generalSettings, language })} options={[
                    ['en', 'English'],
                    ['km', 'Khmer'],
                    ['th', 'Thai'],
                    ['zh', 'Chinese'],
                  ]} />
                </div>
                <SettingInput label="Site Address" value={generalSettings.siteAddress} onChange={(siteAddress) => setGeneralSettings({ ...generalSettings, siteAddress })} />
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="border-slate-700/50 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription className="text-slate-400">Configure admin notification preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <SettingsGroup icon={<Mail className="h-4 w-4" />} title="Email Notifications">
                  <ToggleRow label="Booking Confirmations" description="Receive emails for new bookings." checked={notificationSettings.emailBookings} onChange={(emailBookings) => setNotificationSettings({ ...notificationSettings, emailBookings })} />
                  <ToggleRow label="Promotions & Updates" description="Receive promotional emails." checked={notificationSettings.emailPromotions} onChange={(emailPromotions) => setNotificationSettings({ ...notificationSettings, emailPromotions })} />
                </SettingsGroup>
                <SettingsGroup icon={<Phone className="h-4 w-4" />} title="SMS Notifications">
                  <ToggleRow label="Booking Confirmations" description="Receive SMS for new bookings." checked={notificationSettings.smsBookings} onChange={(smsBookings) => setNotificationSettings({ ...notificationSettings, smsBookings })} />
                  <ToggleRow label="Promotions & Updates" description="Receive promotional SMS." checked={notificationSettings.smsPromotions} onChange={(smsPromotions) => setNotificationSettings({ ...notificationSettings, smsPromotions })} />
                </SettingsGroup>
                <SettingsGroup icon={<Bell className="h-4 w-4" />} title="Push Notifications">
                  <ToggleRow label="Enable Push Notifications" description="Receive browser push notifications." checked={notificationSettings.pushNotifications} onChange={(pushNotifications) => setNotificationSettings({ ...notificationSettings, pushNotifications })} />
                </SettingsGroup>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="border-slate-700/50 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-slate-400">Configure session and account security preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ToggleRow label="Two-Factor Authentication" description="Add an extra layer of security to admin accounts." checked={securitySettings.twoFactorAuth} onChange={(twoFactorAuth) => setSecuritySettings({ ...securitySettings, twoFactorAuth })} />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <SettingInput label="Session Timeout (minutes)" type="number" min={5} max={120} value={securitySettings.sessionTimeout} onChange={(sessionTimeout) => setSecuritySettings({ ...securitySettings, sessionTimeout: Number(sessionTimeout) })} />
                  <SettingInput label="Password Expiry (days)" type="number" min={30} max={365} value={securitySettings.passwordExpiry} onChange={(passwordExpiry) => setSecuritySettings({ ...securitySettings, passwordExpiry: Number(passwordExpiry) })} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function SettingInput({ label, value, onChange, type = 'text', min, max }: { label: string; value: string | number; onChange: (value: string) => void; type?: string; min?: number; max?: number }) {
  const id = label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-slate-300">{label}</Label>
      <Input id={id} type={type} min={min} max={max} value={value} onChange={(event) => onChange(event.target.value)} className="border-slate-600 bg-slate-700/50 text-white" />
    </div>
  )
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<[string, string]> }) {
  const id = label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-slate-300">{label}</Label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white">
        {options.map(([optionValue, labelText]) => <option key={optionValue} value={optionValue}>{labelText}</option>)}
      </select>
    </div>
  )
}

function SettingsGroup({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="space-y-4 border-b border-slate-700/50 pb-6 last:border-b-0 last:pb-0">
      <h4 className="flex items-center gap-2 font-medium text-white">{icon}{title}</h4>
      <div className="space-y-4 pl-0 md:pl-6">{children}</div>
    </div>
  )
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-700/30 p-4">
      <div>
        <Label className="text-slate-300">{label}</Label>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
