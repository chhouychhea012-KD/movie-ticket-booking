'use client'

import Link from 'next/link'
import { ChevronLeft, Shield, Eye, Lock, Mail } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-orange-600 to-slate-950 py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-white/80">
            How we protect and handle your personal information
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="bg-slate-900 p-8 rounded-xl mb-8">
            <p className="text-slate-400 leading-relaxed">
              At CinemaHub, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our website and services.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-orange-500" />
              1. Information We Collect
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <p className="text-slate-400 leading-relaxed mb-4">We collect information that you provide directly to us:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Account information (name, email, phone number)</li>
                <li>Booking history and preferences</li>
                <li>Payment information (processed securely through third parties)</li>
                <li>Communication preferences</li>
                <li>Customer support inquiries</li>
              </ul>
              <p className="text-slate-400 leading-relaxed mt-4 mb-4">We also automatically collect:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Device and usage information</li>
                <li>IP address and browser data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-orange-500" />
              2. How We Use Your Information
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <p className="text-slate-400 leading-relaxed mb-4">We use your information to:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Provide and improve our services</li>
                <li>Process your bookings and payments</li>
                <li>Send you booking confirmations and updates</li>
                <li>Personalize your experience</li>
                <li>Communicate with you about promotions and offers</li>
                <li>Respond to your customer support requests</li>
                <li>Detect and prevent fraud</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-orange-500" />
              3. Information Security
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <p className="text-slate-400 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. 
                All payment transactions are encrypted using industry-standard SSL technology.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-orange-500" />
              4. Information Sharing
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <p className="text-slate-400 leading-relaxed mb-4">We may share your information with:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Cinema partners to fulfill your bookings</li>
                <li>Payment processors for transaction processing</li>
                <li>Service providers who assist our operations</li>
                <li>Law enforcement when required by law</li>
              </ul>
              <p className="text-slate-400 leading-relaxed mt-4">
                We do not sell your personal information to third parties.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-orange-500" />
              5. Your Rights
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <p className="text-slate-400 leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request data portability</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Mail className="w-6 h-6 text-orange-500" />
              6. Contact Us
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <p className="text-slate-400 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="text-slate-400 space-y-2">
                <li>Email: privacy@cinemahub.com</li>
                <li>Phone: +855 23 888 888</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}