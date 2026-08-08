'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import MobileBottomNav from '@/components/mobile-bottom-nav'
import NetworkStatus from '@/components/network-status'
import PWAInstallPrompt from '@/components/pwa-install-prompt'
import ServiceWorkerRegister from '@/components/service-worker-register'

export default function RootContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/auth')) {
    return (
      <>
        <ServiceWorkerRegister />
        <NetworkStatus />
        <main>{children}</main>
      </>
    )
  }
  
  return (
    <>
      <ServiceWorkerRegister />
      <Navigation />
      <main className="pb-24 pt-20 md:pb-0 md:pt-20">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
      <NetworkStatus />
      <PWAInstallPrompt />
    </>
  )
}
