'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { canAccessAdmin } from '@/lib/admin-permissions'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useApp()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated and has admin role
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
      }
    }

    if (!canAccessAdmin(userData?.role, pathname)) {
      // Not authorized, redirect to home
      router.push('/')
      return
    }

    setIsLoading(false)
  }, [user, router, pathname])

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

  return <>{children}</>
}
