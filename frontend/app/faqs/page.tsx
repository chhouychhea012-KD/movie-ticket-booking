'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronLeft, HelpCircle, Search, ChevronDown, ChevronRight } from 'lucide-react'

export default function FaqsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const faqs = [
    {
      category: 'Booking',
      questions: [
        {
          question: 'How do I book movie tickets?',
          answer: 'Browse our movies page, select your preferred movie and showtime, choose your seats from the seat map, and complete the payment to receive your digital ticket immediately via email.',
        },
        {
          question: 'Can I book tickets for groups?',
          answer: 'Yes, you can book up to 8 tickets per transaction. For larger groups, please contact our support team for special arrangements.',
        },
        {
          question: 'How far in advance can I book?',
          answer: 'You can book tickets up to 2 weeks in advance for most showtimes. Some special events may have different booking windows.',
        },
        {
          question: 'Is there a booking fee?',
          answer: 'No, booking is free! We do not charge any additional fees for online ticket reservations.',
        },
      ],
    },
    {
      category: 'Payment',
      questions: [
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept Visa, Mastercard, ABA Payway, Bakong, Wing, TrueMoney, and various mobile banking options popular in Cambodia.',
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Absolutely! All transactions are processed through secure, encrypted payment gateways. We never store your credit card details on our servers.',
        },
        {
          question: 'Can I get a refund if I cancel my booking?',
          answer: 'Yes, you can cancel your booking up to 2 hours before the showtime for a full refund. Cancellations made after this window are not eligible for refunds.',
        },
      ],
    },
    {
      category: 'Tickets',
      questions: [
        {
          question: 'How do I receive my tickets?',
          answer: 'After completing your booking, you will receive a confirmation email with your digital ticket and a QR code. You can also access your tickets anytime in the My Tickets section of your account.',
        },
        {
          question: 'Do I need to print my ticket?',
          answer: 'No, you can simply show your digital ticket (QR code) on your phone at the cinema entrance. We recommend having a stable internet connection for the QR code to load properly.',
        },
        {
          question: 'What if I lose my ticket?',
          answer: 'Don\'t worry! You can easily access your tickets again through your account or the confirmation email. Each ticket can be scanned multiple times if needed.',
        },
      ],
    },
    {
      category: 'Account',
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'Click on the "Register" button in the navigation bar, enter your email and create a password, then verify your email to complete registration.',
        },
        {
          question: 'Can I change my account details?',
          answer: 'Yes, you can update your profile information including name, phone, and email address from the Account Settings page.',
        },
        {
          question: 'How do I reset my password?',
          answer: 'Click on "Forgot Password" on the login page, enter your email, and follow the instructions sent to your inbox to reset your password.',
        },
      ],
    },
  ]

  const allQuestions = faqs.flatMap(faq => faq.questions.map(q => ({ ...q, category: faq.category })))
  const filteredFaqs = searchQuery
    ? allQuestions.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-orange-600 to-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Find answers to common questions about CinemaHub
          </p>
          
          {/* Search */}
          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        {searchQuery && filteredFaqs ? (
          /* Search Results */
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Search Results ({filteredFaqs.length})
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
                      <div>
                        <span className="text-orange-500 text-sm">{faq.category}</span>
                        <p className="text-lg font-medium text-white mt-1">{faq.question}</p>
                      </div>
                      {expandedFaq === index ? (
                        <ChevronDown className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
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
                  <p className="text-slate-400">No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Categories */
          <div className="space-y-16">
            {faqs.map((faq, faqIndex) => (
              <div key={faqIndex}>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-orange-500" />
                  {faq.category}
                </h2>
                <div className="space-y-4">
                  {faq.questions.map((q, qIndex) => {
                    const globalIndex = faqIndex * 10 + qIndex
                    return (
                      <div
                        key={qIndex}
                        className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800"
                      >
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === globalIndex ? null : globalIndex)}
                          className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-800/50 transition"
                        >
                          <span className="text-lg font-medium text-white">{q.question}</span>
                          {expandedFaq === globalIndex ? (
                            <ChevronDown className="w-5 h-5 text-orange-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                        {expandedFaq === globalIndex && (
                          <div className="px-6 pb-6">
                            <p className="text-slate-400">{q.answer}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Still Have Questions */}
        <div className="mt-16 bg-slate-900 rounded-2xl p-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Can't find what you're looking for?</h2>
            <p className="text-slate-400 mb-8">Our support team is ready to help you with any questions.</p>
            <Link 
              href="/contact" 
              className="inline-block bg-orange-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-orange-600 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}