import Link from 'next/link'
import { Clapperboard, Home, Ticket, WifiOff } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="cinema-page flex items-center justify-center px-4 pt-20">
      <div className="cinema-card max-w-md p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1b1f26] text-[#f5c451]">
          <WifiOff className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-white">You are offline</h1>
        <p className="cinema-muted mt-3">
          CamboCine is installed and ready. Cached pages and saved ticket details can still open when your connection drops.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/" className="cinema-button-primary">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link href="/bookings" className="cinema-button-secondary">
            <Ticket className="h-4 w-4" />
            Tickets
          </Link>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          <Clapperboard className="h-4 w-4" />
          CamboCine PWA
        </div>
      </div>
    </div>
  )
}
