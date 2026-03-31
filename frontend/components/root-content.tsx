'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'

export default function RootContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Hide navigation on admin pages
  if (pathname?.startsWith('/admin')) {
    return <main>{children}</main>
  }
  
  return (
    <>
      <Navigation />
      <main className="pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
    </>
  )
}
