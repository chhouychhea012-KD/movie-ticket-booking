'use client'

import { useState } from 'react'

interface PaymentFormProps {
  onSubmit: (cardDetails: {
    cardNumber: string
    expiryDate: string
    cvv: string
    cardholderName: string
  }) => void
  isProcessing: boolean
}

export default function PaymentForm({ onSubmit, isProcessing }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value
    setCardNumber(formatted)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (value.length >= 2) {
      setExpiryDate(`${value.slice(0, 2)}/${value.slice(2)}`)
    } else {
      setExpiryDate(value)
    }
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      alert('Please fill in all fields')
      return
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      alert('Card number must be 16 digits')
      return
    }

    onSubmit({
      cardNumber: cardNumber.replace(/\s/g, ''),
      expiryDate,
      cvv,
      cardholderName,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-8 border border-slate-700">
      <h2 className="text-2xl font-bold text-white mb-6">Card Details</h2>

      <div className="mb-6">
        <label className="block text-slate-300 font-semibold mb-2">Cardholder Name</label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="John Doe"
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          disabled={isProcessing}
        />
      </div>

      <div className="mb-6">
        <label className="block text-slate-300 font-semibold mb-2">Card Number</label>
        <input
          type="text"
          value={cardNumber}
          onChange={handleCardNumberChange}
          placeholder="1234 5678 9012 3456"
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
          disabled={isProcessing}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-slate-300 font-semibold mb-2">Expiry Date</label>
          <input
            type="text"
            value={expiryDate}
            onChange={handleExpiryChange}
            placeholder="MM/YY"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
            disabled={isProcessing}
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-2">CVV</label>
          <input
            type="text"
            value={cvv}
            onChange={handleCvvChange}
            placeholder="123"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
            disabled={isProcessing}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className={`w-full py-3 rounded font-semibold text-white transition ${
          isProcessing
            ? 'bg-slate-600 cursor-not-allowed opacity-50'
            : 'bg-orange-500 hover:bg-orange-600'
        }`}
      >
        {isProcessing ? 'Processing Payment...' : 'Complete Payment'}
      </button>

      <p className="text-slate-400 text-xs mt-4 text-center">
        This is a demo payment form. No actual charges will be made.
      </p>
    </form>
  )
}
