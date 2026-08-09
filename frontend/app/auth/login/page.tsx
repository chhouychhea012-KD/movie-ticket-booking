'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link'
import { useApp } from '@/context/AppContext';
import AuthBrand from '@/components/auth-brand';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '900896751182-351tedmbt8jq69acpbip5fmvir10092h.apps.googleusercontent.com'

type GoogleCredentialResponse = {
  credential?: string
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void
          renderButton: (
            parent: HTMLElement,
            options: {
              theme: 'outline' | 'filled_blue' | 'filled_black'
              size: 'large' | 'medium' | 'small'
              type: 'standard' | 'icon'
              shape: 'rectangular' | 'pill' | 'circle' | 'square'
              text: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
              logo_alignment: 'left' | 'center'
              width?: number
            }
          ) => void
        }
      }
    }
  }
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '';
  const { login, loginWithGoogle, isLoading } = useApp();
  const googleButtonRef = useRef<HTMLDivElement | null>(null)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false)
  const [error, setError] = useState('');

  const redirectAfterLogin = useCallback(() => {
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null

    if (redirect) {
      router.push(redirect)
    } else if (user && ['admin', 'owner', 'staff'].includes(user.role)) {
      router.push('/admin')
    } else {
      router.push('/')
    }
  }, [redirect, router])

  useEffect(() => {
    const handleGoogleCredential = async (response: GoogleCredentialResponse) => {
      setError('')

      if (!response.credential) {
        setError('Google login did not return a valid credential')
        return
      }

      try {
        await loginWithGoogle(response.credential)
        redirectAfterLogin()
      } catch {
        setError('Google login failed. Please try again.')
      }
    }

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) return

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      })

      googleButtonRef.current.innerHTML = ''
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'pill',
        text: 'continue_with',
        logo_alignment: 'left',
        width: Math.min(400, Math.max(280, Math.floor(googleButtonRef.current.getBoundingClientRect().width || 360))),
      })
      setIsGoogleReady(true)
    }

    if (window.google?.accounts?.id) {
      renderGoogleButton()
      return
    }

    const existingScript = document.getElementById('google-identity-services')
    if (existingScript) {
      existingScript.addEventListener('load', renderGoogleButton, { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = 'google-identity-services'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = renderGoogleButton
    script.onerror = () => setError('Google login could not load. Please refresh and try again.')
    document.head.appendChild(script)
  }, [loginWithGoogle, redirectAfterLogin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }
    
    try {
      await login(formData.email, formData.password)
      redirectAfterLogin()
    } catch {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <AuthBrand />

        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Login</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400">
                <input type="checkbox" className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500" />
                Remember me
              </label>
              <Link href="/auth/forgot-password" className="text-orange-500 hover:text-orange-400">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-orange-500 hover:text-orange-400 font-medium">
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <p className="text-slate-400 text-sm text-center mb-4">Or continue with</p>
            <div className="flex justify-center">
              <div className="min-h-11 w-full max-w-[400px] overflow-hidden rounded-full">
                <div ref={googleButtonRef} className="flex w-full justify-center [&>div]:!mx-auto [&>div]:!max-w-full" />
                {!isGoogleReady && (
                  <div className="flex h-11 items-center justify-center gap-2 rounded-full border border-slate-600/50 bg-slate-700/50 text-sm font-medium text-white">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading Google...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  )
}
