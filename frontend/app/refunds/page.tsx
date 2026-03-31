'use client'

import Link from 'next/link'
import { ChevronLeft, RefreshCw, Clock, CreditCard, Mail } from 'lucide-react'

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-orange-600 to-slate-950 py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Refund Policy</h1>
          <p className="text-xl text-white/80">
            Our policy for cancellations and refunds
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="bg-slate-900 p-8 rounded-xl mb-8">
            <p className="text-slate-400 leading-relaxed">
              This Refund Policy outlines our guidelines for cancellations and refunds on movie ticket 
              bookings made through CinemaHub. Please read this policy carefully before making a booking.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Clock className="w-6 h-6 text-orange-500" />
              Cancellation Window
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Full refund for cancellations made at least 2 hours before showtime</li>
                <li>No refund for cancellations made less than 2 hours before showtime</li>
                <li>No-shows are not eligible for refunds</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-orange-500" />
              How to Request a Refund
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <p className="text-slate-400 leading-relaxed mb-4">To request a refund:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Go to My Bookings in your account</li>
                <li>Select the booking you wish to cancel</li>
                <li>Click on Cancel Booking</li>
                <li>Confirm your cancellation</li>
                <li>Refund will be processed automatically</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-orange-500" />
              Refund Processing
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Refunds are processed within 5-7 business days</li>
                <li>Funds will be returned to the original payment method</li>
                <li>You will receive an email confirmation once refund is processed</li>
                <li>Processing times may vary depending on your bank</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-orange-500" />
              Exceptions
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <p className="text-slate-400 leading-relaxed mb-4">
                The following situations may qualify for exceptions:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Cinema cancellation or change of showtime</li>
                <li>Technical issues preventing ticket validation</li>
                <li>Medical emergencies (documentation required)</li>
                <li>Force majeure events</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Mail className="w-6 h-6 text-orange-500" />
              Contact Us
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <p className="text-slate-400 leading-relaxed mb-4">
                If you have questions about refunds or need assistance, please contact us:
              </p>
              <ul className="text-slate-400 space-y-2">
                <li>Email: support@cinemahub.com</li>
                <li>Phone: +855 23 888 888</li>
                <li>Use the Contact form for urgent requests</li>
              </ul>
            </div>
          </section>

          <div className="bg-orange-500/20 border border-orange-500/30 p-6 rounded-xl">
            <p className="text-slate-300">
              <strong>Note:</strong> This policy applies to standard ticket bookings. Special events, 
              promotional tickets, and group bookings may have different terms. Please check your 
              booking confirmation for specific details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}