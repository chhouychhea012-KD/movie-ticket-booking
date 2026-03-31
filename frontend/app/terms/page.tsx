'use client'

import Link from 'next/link'
import { ChevronLeft, FileText, Shield, Clock, Mail } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-orange-600 to-slate-950 py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-xl text-white/80">
            Last updated: January 2024
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="bg-slate-900 p-8 rounded-xl mb-8">
            <p className="text-slate-400 leading-relaxed">
              Welcome to CinemaHub. By accessing and using our website and services, you agree to be bound 
              by these Terms of Service. Please read them carefully before using our platform.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <FileText className="w-6 h-6 text-orange-500" />
              1. Acceptance of Terms
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <p className="text-slate-400 leading-relaxed mb-4">
                By accessing or using CinemaHub's services, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Service. If you do not agree to these terms, 
                please do not use our services.
              </p>
              <p className="text-slate-400 leading-relaxed">
                We reserve the right to update these terms at any time. Your continued use of the service 
                after any changes constitutes acceptance of the new terms.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-orange-500" />
              2. User Accounts
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <p className="text-slate-400 leading-relaxed mb-4">
                To access certain features of our service, you may be required to create an account. 
                You are responsible for:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Notifying us immediately of any unauthorized access</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Clock className="w-6 h-6 text-orange-500" />
              3. Booking and Payments
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <p className="text-slate-400 leading-relaxed mb-4">
                When you book tickets through CinemaHub:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>All bookings are subject to availability and confirmation</li>
                <li>Prices are inclusive of applicable taxes</li>
                <li>Payment must be completed at the time of booking</li>
                <li>Cancellations must be made at least 2 hours before showtime</li>
                <li>Refunds are processed according to our Refund Policy</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <FileText className="w-6 h-6 text-orange-500" />
              4. User Conduct
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <p className="text-slate-400 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Use the service for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to any part of the service</li>
                <li>Interfere with the proper working of the service</li>
                <li>Engage in any activity that could harm the service or its users</li>
                <li>Copy, modify, or distribute any content without permission</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-orange-500" />
              5. Intellectual Property
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <p className="text-slate-400 leading-relaxed">
                All content, logos, designs, and materials on CinemaHub are the intellectual property 
                of CinemaHub or its licensors. You may not reproduce, distribute, or modify any content 
                without our prior written consent.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Mail className="w-6 h-6 text-orange-500" />
              6. Contact Information
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <p className="text-slate-400 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="text-slate-400 space-y-2">
                <li>Email: legal@cinemahub.com</li>
                <li>Phone: +855 23 888 888</li>
                <li>Address: Russian Blvd, Phnom Penh, Cambodia</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}