'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronLeft, Gift, CreditCard, Mail, Tag } from 'lucide-react'

export default function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [message, setMessage] = useState('')

  const amounts = [10, 20, 30, 50, 100]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-orange-600 to-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Gift Cards</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            The perfect gift for movie lovers - give the experience of cinema
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left - How It Works */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Gift className="w-8 h-8 text-orange-500" />
              How It Works
            </h2>
            
            <div className="space-y-6 mb-12">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-500 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Choose Amount</h3>
                  <p className="text-slate-400">Select a gift card value from $10 to $100 or enter a custom amount.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-500 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Personalize</h3>
                  <p className="text-slate-400">Add a personalized message and recipient details.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-500 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Send or Print</h3>
                  <p className="text-slate-400">Send digitally via email or print the gift card to give in person.</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-slate-900 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Gift Card Features</h3>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-orange-500" />
                  Redeemable on any movie or showtime
                </li>
                <li className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-orange-500" />
                  No expiration date
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-orange-500" />
                  Instant digital delivery
                </li>
              </ul>
            </div>
          </div>

          {/* Right - Purchase Form */}
          <div className="bg-slate-900 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Purchase Gift Card</h2>
            
            {/* Amount Selection */}
            <div className="mb-6">
              <label className="block text-slate-400 mb-3">Select Amount</label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {amounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => { setSelectedAmount(amount); setCustomAmount('') }}
                    className={`py-3 rounded-xl font-medium transition ${
                      selectedAmount === amount
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-slate-400 mb-2">Or enter custom amount</label>
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null) }}
                  placeholder="Enter amount ($5 - $500)"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Recipient Details */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-slate-400 mb-2">Recipient Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Enter recipient's name"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-2">Recipient Email</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="Enter recipient's email"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-2">Personal Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Add a personal message..."
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>
            </div>

            {/* Total & Checkout */}
            <div className="border-t border-slate-800 pt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-400">Total</span>
                <span className="text-2xl font-bold text-white">
                  ${selectedAmount || customAmount || 0}
                </span>
              </div>
              <button className="w-full bg-orange-500 text-white py-4 rounded-xl font-medium hover:bg-orange-600 transition">
                Purchase Gift Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}