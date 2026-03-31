'use client'

import Link from 'next/link'
import { ChevronLeft, Newspaper, Calendar, ExternalLink } from 'lucide-react'

export default function PressPage() {
  const pressReleases = [
    {
      title: 'CinemaHub Launches Revolutionary Booking Platform',
      date: 'January 15, 2024',
      excerpt: 'CinemaHub announces the launch of its new booking platform with enhanced features and seamless user experience.',
      category: 'Product Launch',
    },
    {
      title: 'CinemaHub Partners with Major Cinema Chains in Cambodia',
      date: 'December 10, 2023',
      excerpt: 'Strategic partnership brings together over 50 cinemas across Cambodia under one platform.',
      category: 'Partnership',
    },
    {
      title: 'CinemaHub Reaches 500,000 Active Users Milestone',
      date: 'November 5, 2023',
      excerpt: 'Growing popularity of the platform marks a significant achievement in the Cambodian market.',
      category: 'Milestone',
    },
    {
      title: 'CinemaHub Introduces Mobile App with Exclusive Features',
      date: 'October 20, 2023',
      excerpt: 'New mobile app brings instant booking, exclusive deals, and personalized recommendations.',
      category: 'Product Launch',
    },
  ]

  const mediaContacts = [
    {
      name: 'Press Office',
      email: 'press@cinemahub.com',
      phone: '+855 23 888 889',
    },
    {
      name: 'Marketing Team',
      email: 'marketing@cinemahub.com',
      phone: '+855 23 888 890',
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Press Center</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Latest news, press releases, and media resources from CinemaHub
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        {/* Press Releases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-orange-500" />
            Press Releases
          </h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <div key={index} className="bg-slate-900 p-8 rounded-xl hover:border-orange-500 border border-transparent transition">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm">
                        {release.category}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        {release.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{release.title}</h3>
                    <p className="text-slate-400">{release.excerpt}</p>
                  </div>
                  <button className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 transition">
                    Read More
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Resources */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Media Resources</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-4">Brand Assets</h3>
              <p className="text-slate-400 mb-6">
                Download our logo, brand guidelines, and high-resolution images for media use.
              </p>
              <button className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition">
                Download Assets
              </button>
            </div>
            <div className="bg-slate-900 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-4">Media Kit</h3>
              <p className="text-slate-400 mb-6">
                Get comprehensive information about CinemaHub, our history, and key statistics.
              </p>
              <button className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition">
                Download Kit
              </button>
            </div>
          </div>
        </div>

        {/* Media Contact */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8">Media Contacts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {mediaContacts.map((contact, index) => (
              <div key={index} className="bg-slate-900 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-3">{contact.name}</h3>
                <p className="text-slate-400 mb-2">Email: {contact.email}</p>
                <p className="text-slate-400">Phone: {contact.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}