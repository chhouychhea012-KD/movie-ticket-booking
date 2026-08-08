'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import AdminSidebar from '@/components/admin-sidebar'
import AdminHeader from '@/components/admin-header'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useApp()
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = useCallback(() => {
    // Always read fresh from localStorage to ensure we have the latest
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
    if ((!storedUser && !user) || !storedToken) {
      // Not logged in, redirect to login
      router.push(`/auth/login?redirect=${pathname}`)
      return
    }

    // Parse user from localStorage if available
    let userData = user
    if (!userData && storedUser) {
      try {
        userData = JSON.parse(storedUser)
      } catch {
        console.error('Failed to parse user from localStorage')
        router.push(`/auth/login?redirect=${pathname}`)
        return
      }
    }

    // Check if user has admin role
    if (!userData || !['admin', 'owner', 'staff'].includes(userData.role)) {
      // Not authorized, redirect to home
      router.push('/')
      return
    }

    setIsLoading(false)
  }, [pathname, router, user])

  // Force re-render when user changes
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AdminSidebar />
      <div className="lg:ml-72">
        <AdminHeader />
        <main className="px-4 pb-6 pt-24 sm:px-6 lg:px-8 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  )
}
