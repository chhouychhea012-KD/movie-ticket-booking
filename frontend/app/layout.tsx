import type { Metadata } from 'next'
import './globals.css'
import RootContent from '@/components/root-content'
import { AppProvider } from '@/context/AppContext'

export const metadata: Metadata = {
  title: 'CinemaHub - Book Your Movie Tickets',
  description: 'Book movie tickets easily and conveniently',
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <AppProvider>
          <RootContent>{children}</RootContent>
        </AppProvider>
      </body>
    </html>
  )
}
