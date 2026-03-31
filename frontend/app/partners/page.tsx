'use client'

import Link from 'next/link'
import { ChevronLeft, Handshake, Building2, Star } from 'lucide-react'

export default function PartnersPage() {
  const partners = [
    {
      name: 'Major Cineplex',
      logo: '🎬',
      description: 'Leading cinema chain in Cambodia with premium theaters',
      tier: 'Platinum',
    },
    {
      name: 'The Legend Cinema',
      logo: '🎭',
      description: 'State-of-the-art cinematic experience across the country',
      tier: 'Platinum',
    },
    {
      name: 'Platinum Cineplex',
      logo: '🍿',
      description: 'Modern theaters with advanced technology',
      tier: 'Gold',
    },
    {
      name: 'Meta Stadium',
      logo: '🏟️',
      description: 'Entertainment and cinema complex',
      tier: 'Gold',
    },
    {
      name: 'Korea Town Cinema',
      logo: '🎥',
      description: 'Specialized in Korean content and events',
      tier: 'Silver',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-orange-600 to-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Partners</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Collaborating with the best cinema chains and entertainment providers
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        {/* Partner Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <Handshake className="w-8 h-8 text-orange-500" />
            Become a Partner
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900 p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Expand Your Reach</h3>
              <p className="text-slate-400">
                Connect with thousands of movie lovers across Cambodia through our platform.
              </p>
            </div>
            <div className="bg-slate-900 p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Boost Revenue</h3>
              <p className="text-slate-400">
                Increase ticket sales and concessions with our integrated booking system.
              </p>
            </div>
            <div className="bg-slate-900 p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Handshake className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Dedicated Support</h3>
              <p className="text-slate-400">
                Get 24/7 technical support and marketing assistance from our team.
              </p>
            </div>
          </div>
        </div>

        {/* Our Partners */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8">Our Partners</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => (
              <div key={index} className="bg-slate-900 p-8 rounded-xl hover:border-orange-500 border border-transparent transition">
                <div className="text-6xl mb-6 text-center">{partner.logo}</div>
                <h3 className="text-xl font-semibold text-white mb-3 text-center">{partner.name}</h3>
                <p className="text-slate-400 text-center mb-4">{partner.description}</p>
                <div className="text-center">
                  <span className={`inline-block px-4 py-1 rounded-full text-sm ${
                    partner.tier === 'Platinum' ? 'bg-purple-500/20 text-purple-400' :
                    partner.tier === 'Gold' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {partner.tier} Partner
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Interested in Partnership?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join our growing network of cinema partners and bring the best movies to your audience.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
          >
            Contact Us Today
          </Link>
        </div>
      </div>
    </div>
  )
}