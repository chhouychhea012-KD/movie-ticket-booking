'use client'

import Link from 'next/link'
import { ChevronLeft, Cookie, Eye, Settings, Trash2 } from 'lucide-react'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-orange-600 to-slate-950 py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Cookie Policy</h1>
          <p className="text-xl text-white/80">
            How we use cookies to improve your experience
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="bg-slate-900 p-8 rounded-xl mb-8">
            <p className="text-slate-400 leading-relaxed">
              This Cookie Policy explains what cookies are, how CinemaHub uses them, and your choices 
              regarding cookies. By using our website, you consent to the use of cookies as described 
              in this policy.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Cookie className="w-6 h-6 text-orange-500" />
              What Are Cookies?
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <p className="text-slate-400 leading-relaxed">
                Cookies are small text files that are stored on your device when you visit websites. 
                They help websites function properly and provide information to website owners about 
                how users interact with their site.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Cookie className="w-6 h-6 text-orange-500" />
              Types of Cookies We Use
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Essential Cookies</h3>
                <p className="text-slate-400">
                  Required for the website to function. These include authentication cookies, 
                  security cookies, and preferences. You cannot disable these.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Analytics Cookies</h3>
                <p className="text-slate-400">
                  Help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Marketing Cookies</h3>
                <p className="text-slate-400">
                  Used to track visitors across websites to display relevant advertisements 
                  that are engaging for individual users.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Functional Cookies</h3>
                <p className="text-slate-400">
                  Allow the website to remember choices you make and provide enhanced, 
                  personalized features.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-orange-500" />
              How We Use Cookies
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Keep you logged in during your visit</li>
                <li>Remember your preferences and settings</li>
                <li>Analyze traffic and improve our services</li>
                <li>Personalize content and recommendations</li>
                <li>Prevent fraud and ensure security</li>
                <li>Support marketing campaigns</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Settings className="w-6 h-6 text-orange-500" />
              Your Cookie Choices
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <p className="text-slate-400 leading-relaxed mb-4">
                You have the right to decide whether to accept or reject cookies. You can:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Use our Cookie Settings to manage your preferences</li>
                <li>Configure your browser to reject cookies</li>
                <li>Use private/incognito mode when browsing</li>
              </ul>
              <p className="text-slate-400 leading-relaxed mt-4">
                Note: Blocking essential cookies may affect website functionality.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Trash2 className="w-6 h-6 text-orange-500" />
              Updates to This Policy
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <p className="text-slate-400 leading-relaxed">
                We may update this Cookie Policy from time to time. Any changes will be posted 
                on this page with an updated revision date. We encourage you to review this 
                policy periodically.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Cookie className="w-6 h-6 text-orange-500" />
              Contact Us
            </h2>
            <div className="bg-slate-900 p-6 rounded-xl">
              <p className="text-slate-400 leading-relaxed">
                If you have questions about our Cookie Policy, please contact us at 
                privacy@cinemahub.com
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}