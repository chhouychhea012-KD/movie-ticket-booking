'use client'

import { useEffect, useMemo, useState } from 'react'
import { Download, RefreshCw, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const installDismissKey = 'cinemahub-pwa-install-dismissed'
const iosDismissKey = 'cinemahub-ios-install-dismissed'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false)
  const [showIosPrompt, setShowIosPrompt] = useState(false)
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  const isIOS = useMemo(() => {
    if (typeof window === 'undefined') return false
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
  }, [])

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true
    setIsStandalone(standalone)
    if (standalone) return

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      const promptEvent = event as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      if (localStorage.getItem(installDismissKey) !== 'true') {
        setShowAndroidPrompt(true)
      }
    }

    const iosTimer = window.setTimeout(() => {
      if (isIOS && localStorage.getItem(iosDismissKey) !== 'true') {
        setShowIosPrompt(true)
      }
    }, 1800)

    const handleUpdateReady = () => setShowUpdatePrompt(true)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('pwa-update-ready', handleUpdateReady)

    return () => {
      window.clearTimeout(iosTimer)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('pwa-update-ready', handleUpdateReady)
    }
  }, [isIOS])

  const install = async () => {
    if (!deferredPrompt) return
    setShowAndroidPrompt(false)
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  const closeAndroidPrompt = () => {
    localStorage.setItem(installDismissKey, 'true')
    setShowAndroidPrompt(false)
  }

  const closeIosPrompt = () => {
    localStorage.setItem(iosDismissKey, 'true')
    setShowIosPrompt(false)
  }

  const refreshApp = () => {
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' })
    }
    window.location.reload()
  }

  if (isStandalone) return null

  return (
    <>
      {showAndroidPrompt && deferredPrompt && (
        <div className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[70] mx-auto max-w-md rounded-2xl border border-[#252a32] bg-[#14171c] p-4 shadow-2xl shadow-black/50">
          <button onClick={closeAndroidPrompt} className="absolute right-3 top-3 rounded-lg p-1 text-slate-500 transition hover:bg-[#252a32] hover:text-white" aria-label="Close install prompt">
            <X className="h-4 w-4" />
          </button>
          <div className="flex gap-3 pr-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#252a32] bg-black">
              <img src="/logo.png" alt="CinemaHub Movie Time" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="font-semibold text-white">Install CinemaHub</p>
              <p className="mt-1 text-sm leading-5 text-slate-400">Open faster, use full screen, and keep tickets one tap away.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button onClick={closeAndroidPrompt} className="cinema-button-secondary h-11 px-3 py-2">Later</button>
            <button onClick={install} className="cinema-button-primary h-11 px-3 py-2">
              <Download className="h-4 w-4" />
              Install
            </button>
          </div>
        </div>
      )}

      {showIosPrompt && (
        <div className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[70] mx-auto max-w-md rounded-2xl border border-[#252a32] bg-[#14171c] p-4 shadow-2xl shadow-black/50">
          <button onClick={closeIosPrompt} className="absolute right-3 top-3 rounded-lg p-1 text-slate-500 transition hover:bg-[#252a32] hover:text-white" aria-label="Close iOS install help">
            <X className="h-4 w-4" />
          </button>
          <div className="flex gap-3 pr-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#252a32] bg-black">
              <img src="/logo.png" alt="CinemaHub Movie Time" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="font-semibold text-white">Add CinemaHub to Home Screen</p>
              <p className="mt-1 text-sm leading-5 text-slate-400">Tap Share, then choose Add to Home Screen.</p>
            </div>
          </div>
          <button onClick={closeIosPrompt} className="cinema-button-primary mt-4 w-full">
            Got it
          </button>
        </div>
      )}

      {showUpdatePrompt && (
        <div className="fixed inset-x-4 top-[calc(5rem+env(safe-area-inset-top))] z-[70] mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-[#252a32] bg-[#14171c] p-3 shadow-2xl shadow-black/40">
          <p className="text-sm font-medium text-white">A new app version is ready.</p>
          <button onClick={refreshApp} className="cinema-button-primary px-3 py-2">
            <RefreshCw className="h-4 w-4" />
            Update
          </button>
        </div>
      )}
    </>
  )
}
