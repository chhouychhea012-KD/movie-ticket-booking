'use client'

import Link from 'next/link'
import { ChevronLeft, Users, Award, Target, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-orange-600 to-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About CinemaHub</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Your premier destination for movie ticket booking in Cambodia
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              At CinemaHub, we are passionate about bringing the magic of cinema to everyone. 
              Our mission is to make movie booking as seamless and enjoyable as watching the 
              film itself.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed">
              Founded in Phnom Penh, Cambodia, we have grown to become the most trusted 
              platform for movie enthusiasts across the country.
            </p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-slate-800 rounded-xl">
                <Users className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white">500K+</p>
                <p className="text-slate-400">Happy Customers</p>
              </div>
              <div className="text-center p-6 bg-slate-800 rounded-xl">
                <Award className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white">50+</p>
                <p className="text-slate-400">Partner Cinemas</p>
              </div>
              <div className="text-center p-6 bg-slate-800 rounded-xl">
                <Target className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white">1M+</p>
                <p className="text-slate-400">Tickets Sold</p>
              </div>
              <div className="text-center p-6 bg-slate-800 rounded-xl">
                <Heart className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white">4.9</p>
                <p className="text-slate-400">App Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900 p-8 rounded-2xl">
              <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Customer First</h3>
              <p className="text-slate-400">
                We put our customers at the heart of everything we do, ensuring their needs are always prioritized.
              </p>
            </div>
            <div className="bg-slate-900 p-8 rounded-2xl">
              <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Innovation</h3>
              <p className="text-slate-400">
                We continuously innovate to provide the best movie booking experience with cutting-edge technology.
              </p>
            </div>
            <div className="bg-slate-900 p-8 rounded-2xl">
              <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Passion</h3>
              <p className="text-slate-400">
                Our team is passionate about cinema and dedicated to sharing that passion with our community.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Be the first to know about new movie releases, exclusive deals, and special events.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}