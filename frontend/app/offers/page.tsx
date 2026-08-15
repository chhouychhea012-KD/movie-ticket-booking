'use client'

import Link from 'next/link'
import { ArrowRight, BadgePercent, Gift, Sparkles } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { normalizeStringArray } from '@/lib/utils'

export default function OffersPage() {
  const { movies, cinemas } = useApp()

  const promos = [
    { title: 'Weekend Combo', text: 'Save on seats and snacks.', badge: '30% OFF', image: movies[0]?.poster },
    { title: 'Family Night', text: 'Book together and pay less.', badge: '2 + 1', image: movies[1]?.poster },
    { title: 'Premium Upgrade', text: 'Try better seats for less.', badge: 'VIP', image: movies[2]?.poster },
    { title: 'Student Deals', text: 'Simple offers for every week.', badge: 'NEW', image: movies[3]?.poster },
  ]

  return (
    <div className="cinema-page">
      <section className="cinema-container pt-8 sm:pt-10">
        <div className="cinema-card overflow-hidden">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-[260px] overflow-hidden bg-[#101318]">
              <img
                src={movies[0]?.backdrop || movies[0]?.poster || '/logo-nav.png'}
                alt="Offers"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,13,16,0.18)_0%,rgba(11,13,16,0.55)_45%,rgba(11,13,16,0.88)_100%)]" />
              <div className="absolute inset-0 flex items-end p-6 sm:p-8">
                <div className="max-w-xl">
                  <span className="cinema-chip border-[#f5c451]/30 text-[#f5c451]">
                    <BadgePercent className="h-3.5 w-3.5" />
                    Offers
                  </span>
                  <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                    Small cards, quick deals.
                  </h1>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
                    Find movie bundles, seat upgrades, and seasonal promotions in one place.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6 sm:p-8">
              <div>
                <p className="text-sm font-semibold text-white">Quick Actions</p>
                <p className="cinema-muted mt-1">Move straight to booking.</p>
              </div>
              <div className="grid gap-3">
                {[
                  { label: 'Browse movies', href: '/movies', note: 'Pick your next show.' },
                  { label: 'Find cinemas', href: '/cinemas', note: 'See local locations.' },
                  { label: 'FAQ help', href: '/faqs', note: 'Read quick answers.' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-2xl border border-[#252a32] bg-[#101318] px-4 py-3 transition hover:border-[#e50914]/40 hover:bg-[#14171c]"
                  >
                    <div>
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.note}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#e50914]" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cinema-container pb-16">
        <div className="mb-8">
          <h2 className="cinema-section-title">Promotions</h2>
          <p className="cinema-muted mt-2">Clear offers with short text and simple actions.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {promos.map((promo) => (
            <article key={promo.title} className="overflow-hidden rounded-2xl border border-[#252a32] bg-[#14171c]">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#101318]">
                <img src={promo.image || movies[0]?.poster || '/logo-nav.png'} alt={promo.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-transparent to-transparent" />
                <div className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                  {promo.badge}
                </div>
              </div>
              <div className="space-y-2 p-4">
                <h3 className="line-clamp-1 text-base font-semibold text-white">{promo.title}</h3>
                <p className="line-clamp-2 text-sm leading-6 text-slate-400">{promo.text}</p>
                <Link href="/movies" className="inline-flex items-center gap-2 text-sm font-semibold text-[#f23b43] hover:text-white">
                  See movies
                  <Sparkles className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="cinema-section-title">Cinema Picks</h2>
              <p className="cinema-muted mt-2">Short location cards to keep things scannable.</p>
            </div>
            <Link href="/cinemas" className="text-sm font-semibold text-[#f23b43] hover:text-white">All cinemas</Link>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {cinemas.slice(0, 6).map((cinema) => (
              <div key={cinema.id} className="flex items-center gap-3 rounded-2xl border border-[#252a32] bg-[#101318] p-3">
                <img src={cinema.image || movies[0]?.poster || '/logo-nav.png'} alt={cinema.name} className="h-14 w-16 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{cinema.name}</p>
                  <p className="truncate text-xs text-slate-500">{normalizeStringArray(cinema.facilities).slice(0, 2).join(' / ')}</p>
                </div>
                <Gift className="h-4 w-4 shrink-0 text-[#e50914]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
