'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronLeft, HelpCircle, Search, Book, MessageCircle, Phone, Mail, ChevronDown, ChevronRight } from 'lucide-react'

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const faqs = [
    {
      question: 'How do I book movie tickets?',
      answer: 'Browse our movies page, select your preferred movie and showtime, choose your seats, and complete the payment to receive your digital ticket.',
    },
    {
      question: 'Can I cancel or change my booking?',
      answer: 'Yes, you can cancel or modify your booking up to 2 hours before the showtime. Go to your bookings page and select the booking you wish to modify.',
    },
    {
      question: 'How do I get my tickets?',
      answer: 'After completing your booking, you will receive a confirmation email with your digital ticket. You can also access your tickets in the My Tickets section of your account.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept Visa, Mastercard, ABA Payway, Bakong, and various mobile banking options popular in Cambodia.',
    },
    {
      question: 'Is it safe to book online?',
      answer: 'Yes, all our transactions are secured with industry-standard encryption. We never store your payment details on our servers.',
    },
    {
      question: 'How do I become a member?',
      answer: 'Click on the Register button in the navigation bar, fill in your details, and start enjoying member-exclusive benefits and rewards.',
    },
    {
      question: 'What are the benefits of CinemaHub membership?',
      answer: 'Members get access to exclusive deals, early booking for new releases, reward points, and special event invitations.',
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can reach us through the Contact page, live chat on our website, or call us at +855 23 888 888. We are available 24/7.',
    },
  ]

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const helpCategories = [
    { icon: Book, title: 'Getting Started', description: 'Learn the basics of using CinemaHub', href: '#getting-started' },
    { icon: MessageCircle, title: 'Booking Help', description: 'Tickets, payments, and reservations', href: '#booking' },
    { icon: Phone, title: 'Account Support', description: 'Login, registration, and settings', href: '#account' },
    { icon: Mail, title: 'Contact Us', description: 'Get in touch with our team', href: '/contact' },
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Help Center</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Find answers to your questions and get support
          </p>
          
          {/* Search */}
          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        {/* Help Categories */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {helpCategories.map((category, index) => (
            <Link
              key={index}
              href={category.href}
              className="bg-slate-900 p-6 rounded-xl hover:border-orange-500 border border-transparent transition group"
            >
              <category.icon className="w-10 h-10 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-white mb-2">{category.title}</h3>
              <p className="text-slate-400 text-sm">{category.description}</p>
            </Link>
          ))}
        </div>

        {/* FAQs */}
        <div id="getting-started">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-orange-500" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-800/50 transition"
                  >
                    <span className="text-lg font-medium text-white">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronDown className="w-5 h-5 text-orange-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-slate-400">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-slate-900 p-8 rounded-xl text-center">
                <p className="text-slate-400">No results found. Please try a different search term.</p>
              </div>
            )}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="mt-16 bg-slate-900 rounded-2xl p-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Still Need Help?</h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-orange-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-orange-600 transition"
              >
                Contact Support
              </Link>
              <a 
                href="tel:+85523888888"
                className="bg-slate-800 text-white px-8 py-3 rounded-xl font-medium hover:bg-slate-700 transition"
              >
                Call Us: +855 23 888 888
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}