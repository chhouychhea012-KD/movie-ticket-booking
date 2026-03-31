'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Send, ArrowRight } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const footerLinks = {
    movies: [
      { label: 'Now Showing', href: '/movies' },
      { label: 'Coming Soon', href: '/movies?status=coming_soon' },
      { label: 'Top Rated', href: '/movies?sort=rating' },
      { label: 'Showtimes', href: '/movies' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Partners', href: '/partners' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Gift Cards', href: '/gift-cards' },
    ],
    legal: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Refund Policy', href: '/refunds' },
    ],
  }

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com', label: 'Youtube' },
  ]

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div style={{ width: '380px', height: '100px' }}>
                <img 
                  src="/logo.png" 
                  alt="CinemaHub" 
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  style={{ 
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                    transformOrigin: 'center'
                  }}
                />
              </div>
            </Link>
            <p className="text-slate-400 mb-6 max-w-sm">
              Your ultimate destination for booking movie tickets. Experience cinema like never before with exclusive deals and showtimes.
            </p>

            {/* Newsletter Subscription */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">Subscribe to our newsletter</h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                    subscribed
                      ? 'bg-green-500 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white hover:scale-105'
                  }`}
                >
                  {subscribed ? 'Subscribed!' : <Send className="w-5 h-5" />}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>Russian Blvd, Phnom Penh, Cambodia</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500" />
                <span>+855 23 888 888</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500" />
                <span>support@cinemahub.com</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Movies</h4>
            <ul className="space-y-3">
              {footerLinks.movies.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-slate-400 hover:text-orange-500 transition flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-slate-400 hover:text-orange-500 transition flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-slate-400 hover:text-orange-500 transition flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {socialLinks.map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-orange-500 text-slate-400 hover:text-white rounded-full transition-all duration-300 hover:scale-110"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {footerLinks.legal.map((link, i) => (
              <Link key={i} href={link.href} className="text-slate-500 hover:text-orange-500 transition">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-slate-500 text-sm">
            <p>© 2024 CinemaHub. All rights reserved.</p>
            <p>Designed with ❤️ for movie lovers</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
