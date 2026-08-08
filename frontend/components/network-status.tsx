'use client'

import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

export default function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const updateStatus = () => setIsOffline(!navigator.onLine)
    updateStatus()

    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)

    return () => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="fixed inset-x-4 top-[calc(4.75rem+env(safe-area-inset-top))] z-[65] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-[#f5c451]/30 bg-[#201a0d] p-3 text-sm text-[#f5c451] shadow-2xl shadow-black/40">
      <WifiOff className="h-4 w-4 shrink-0" />
      You are offline. Cached pages and saved tickets still work.
    </div>
  )
}
