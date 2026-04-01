'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useApp } from '@/context/AppContext'

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
    
    if (!storedUser && !user) {
      // Not logged in, redirect to login
      router.push(`/auth/login?redirect=${pathname}`)
      return
    }

    // Parse user from localStorage if available
    let userData = user
    if (!userData && storedUser) {
      try {
        userData = JSON.parse(storedUser)
      } catch (e) {
        console.error('Failed to parse user from localStorage')
      }
    }

    // Check if user has admin role
    if (!userData || !['admin', 'owner', 'staff'].includes(userData.role)) {
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