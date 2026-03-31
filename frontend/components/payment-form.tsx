'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'

type PaymentMethod = 'visa' | 'bakong' | 'abapayway'

// Bakong account information
const BAKONG_ACCOUNT_NAME = 'CHHEA CHHOUY'
const USD_TO_KHR = 4100

interface PaymentFormProps {
  onSubmit: (paymentData: {
    method: PaymentMethod
    amount: number
    cardNumber?: string
    expiryDate?: string
    cvv?: string
    cardholderName?: string
    phoneNumber?: string
    accountName?: string
  }) => void
  isProcessing: boolean
  totalAmount: number
}

// Payment method icons (using actual images)
const PaymentMethodIcon = ({ method }: { method: PaymentMethod }) => {
  const icons: Record<PaymentMethod, { src: string; alt: string }> = {
    visa: { src: '/visa.png', alt: 'VISA' },
    bakong: { src: '/bakong.png', alt: 'Bakong' },
    abapayway: { src: '/abapayway.png', alt: 'ABA PayWay' }
  }
  
  return (
    <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-lg">
      <Image 
        src={icons[method].src} 
        alt={icons[method].alt}
        width={48}
        height={48}
        className="w-full h-full object-contain"
      />
    </div>
  )
}

export default function PaymentForm({ onSubmit, isProcessing, totalAmount }: PaymentFormProps) {
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>('bakong')
  const [showQRCode, setShowQRCode] = useState(false)
  const [qrLoading, setQrLoading] = useState(false)
  const [qrCodeValue, setQrCodeValue] = useState('')
  
  // VISA card state
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  
  // Bakong/ABA state
  const [phoneNumber, setPhoneNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  
  // Order info
  const orderId = `ORD_${Date.now()}`

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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    setPhoneNumber(value)
  }

  const generateQRCode = async () => {
    setQrLoading(true)
    
    try {
      // Call the appropriate API to get the payment QR code
      let apiEndpoint = '/api/payments/bakong'
      if (activeMethod === 'abapayway') {
        apiEndpoint = '/api/payments/abaPayway'
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          orderId: orderId,
          customerName: accountName || 'Customer',
          phoneNumber: phoneNumber,
        }),
      })

      const result = await response.json()

      if (result.qrCode) {
        setQrCodeValue(result.qrCode)
      } else {
        // Generate a fallback QR code with payment info
        const paymentInfo = JSON.stringify({
          merchant: activeMethod === 'bakong' ? 'Bakong' : 'ABA PayWay',
          account: activeMethod === 'bakong' ? 'CHHEA CHHOUY' : phoneNumber,
          amount: totalAmount,
          currency: 'USD',
          orderId: orderId,
        })
        setQrCodeValue(paymentInfo)
      }
      
      setShowQRCode(true)
    } catch (error) {
      console.error('Error generating QR code:', error)
      // Generate fallback QR
      const paymentInfo = JSON.stringify({
        merchant: activeMethod === 'bakong' ? 'Bakong' : 'ABA PayWay',
        account: activeMethod === 'bakong' ? 'CHHEA CHHOUY' : phoneNumber,
        amount: totalAmount,
        currency: 'USD',
        orderId: orderId,
      })
      setQrCodeValue(paymentInfo)
      setShowQRCode(true)
    } finally {
      setQrLoading(false)
    }
  }

  const validateForm = (): boolean => {
    if (activeMethod === 'visa') {
      if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        alert('Please fill in all card details')
        return false
      }
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        alert('Card number must be 16 digits')
        return false
      }
    } else if (activeMethod === 'bakong' || activeMethod === 'abapayway') {
      if (!phoneNumber || phoneNumber.length < 9) {
        alert('Please enter a valid phone number')
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // For Bakong/ABA, QR code is generated via button click
    // Only process VISA card directly
    if (activeMethod === 'visa') {
      if (!validateForm()) return
      
      onSubmit({
        method: activeMethod,
        amount: totalAmount,
        cardNumber: cardNumber.replace(/\s/g, ''),
        expiryDate,
        cvv,
        cardholderName,
        phoneNumber: undefined,
        accountName: undefined
      })
    }
    // For Bakong/ABA, user must click Generate QR button first
  }

  const handleMethodChange = (method: PaymentMethod) => {
    setActiveMethod(method)
    setShowQRCode(false)
    setQrCodeValue('')
  }

  const handleConfirmPayment = () => {
    onSubmit({
      method: activeMethod,
      amount: totalAmount,
      phoneNumber: phoneNumber,
      accountName: accountName
    })
  }

  const paymentMethods = [
    {
      id: 'visa' as PaymentMethod,
      name: 'Visa Card',
      description: 'Pay with your Visa debit or credit card',
    },
    {
      id: 'bakong' as PaymentMethod,
      name: 'Bakong',
      description: 'Pay using Bakong QR Code',
    },
    {
      id: 'abapayway' as PaymentMethod,
      name: 'ABA PayWay',
      description: 'Pay with ABA mobile banking',
    }
  ]

  return (
    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Select Payment Method</h2>
        <p className="text-slate-400 text-sm">Choose your preferred payment option to complete your booking</p>
      </div>

      {/* Payment Method Selection */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => handleMethodChange(method.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              activeMethod === method.id
                ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20'
                : 'border-slate-600 bg-slate-700/50 hover:border-slate-500 hover:bg-slate-700'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <PaymentMethodIcon method={method.id} />
              <span className="text-white font-semibold text-sm">{method.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Payment Forms */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* VISA Card Form */}
        {activeMethod === 'visa' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Card Preview */}
            <div className="relative h-48 rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-6 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-20 h-14 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                    <Image 
                      src="/visa.png" 
                      alt="VISA"
                      width={80}
                      height={56}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-slate-400 text-xs">Credit/Debit Card</div>
                </div>
                
                <div>
                  <div className="text-slate-400 text-xs mb-1">Card Number</div>
                  <div className="text-white text-xl font-mono tracking-wider">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <div className="text-slate-400 text-xs">Cardholder Name</div>
                    <div className="text-white text-sm font-medium">{cardholderName || 'YOUR NAME'}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs">Expires</div>
                    <div className="text-white text-sm font-mono">{expiryDate || 'MM/YY'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Cardholder Name</label>
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                  placeholder="JOHN DOE"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-2">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono transition-colors"
                    disabled={isProcessing}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-8 bg-white rounded flex items-center justify-center overflow-hidden">
                    <Image 
                      src="/visa.png" 
                      alt="VISA"
                      width={40}
                      height={32}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-2">Expiry Date</label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono transition-colors"
                    disabled={isProcessing}
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-2">CVV</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cvv}
                      onChange={handleCvvChange}
                      placeholder="123"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono transition-colors"
                      disabled={isProcessing}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bakong Form */}
        {activeMethod === 'bakong' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white flex items-center justify-center">
                  <Image 
                    src="/bakong.png" 
                    alt="Bakong"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Bakong QR Payment</h3>
                  <p className="text-slate-400 text-sm">Scan QR code with your Bakong app</p>
                </div>
              </div>
              
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="012 345 678"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                  disabled={isProcessing}
                />
              </div>

              {/* Generate QR Button */}
              {!showQRCode && (
                <button
                  type="button"
                  onClick={generateQRCode}
                  disabled={qrLoading || !phoneNumber || phoneNumber.length < 9}
                  className="mt-4 w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {qrLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating QR...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                      Generate QR Code
                    </>
                  )}
                </button>
              )}

              {/* QR Code Display */}
              {showQRCode && (
                <div className="mt-6 text-center">
                  <div className="bg-white p-4 rounded-xl inline-block">
                    {qrLoading ? (
                      <div className="w-48 h-48 flex items-center justify-center">
                        <svg className="animate-spin h-8 w-8 text-red-500" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-48 h-48 bg-white flex items-center justify-center p-2">
                        <QRCodeSVG 
                          value={qrCodeValue || 'Bakong Payment'} 
                          size={180}
                          level="H"
                          includeMargin={false}
                          bgColor="#ffffff"
                          fgColor="#000000"
                        />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-white mt-4 font-semibold">Account: {BAKONG_ACCOUNT_NAME}</p>
                  <div className="text-slate-400 text-sm mt-2 space-y-1">
                    <p>Amount: ${totalAmount.toFixed(2)} USD</p>
                    <p>or</p>
                    <p className="text-white font-bold">{(totalAmount * 4100).toLocaleString()} KHR</p>
                  </div>
                  
                  <div className="mt-4 bg-slate-700/50 rounded-lg p-4 text-left">
                    <p className="text-red-400 font-bold mb-2">Payment Instructions:</p>
                    <p className="text-slate-300 text-sm">1. Open Bakong app on your phone</p>
                    <p className="text-slate-300 text-sm">2. Tap "Scan QR" or enter amount manually</p>
                    <p className="text-slate-300 text-sm">3. Enter: {(totalAmount * 4100).toLocaleString()} KHR</p>
                    <p className="text-slate-300 text-sm">4. Account: {BAKONG_ACCOUNT_NAME}</p>
                    <p className="text-slate-300 text-sm">5. Complete and confirm</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    disabled={isProcessing}
                    className="mt-4 w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all"
                  >
                    {isProcessing ? 'Processing...' : 'I Have Paid - Confirm'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA PayWay Form */}
        {activeMethod === 'abapayway' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white flex items-center justify-center">
                  <Image 
                    src="/abapayway.png" 
                    alt="ABA PayWay"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">ABA PayWay</h3>
                  <p className="text-slate-400 text-sm">Scan QR code with ABA app</p>
                </div>
              </div>
              
              <div>
                <label className="block text-slate-300 font-semibold mb-2">ABA Account Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="012 345 678"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                  disabled={isProcessing}
                />
                <p className="text-slate-500 text-xs mt-2">Enter your ABA account phone number</p>
              </div>

              {/* Generate QR Button */}
              {!showQRCode && (
                <button
                  type="button"
                  onClick={generateQRCode}
                  disabled={qrLoading || !phoneNumber || phoneNumber.length < 9}
                  className="mt-4 w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {qrLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating QR...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                      Generate QR Code
                    </>
                  )}
                </button>
              )}

              {/* QR Code Display */}
              {showQRCode && (
                <div className="mt-6 text-center">
                  <div className="bg-white p-4 rounded-xl inline-block">
                    {qrLoading ? (
                      <div className="w-48 h-48 flex items-center justify-center">
                        <svg className="animate-spin h-8 w-8 text-orange-500" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-48 h-48 bg-white flex items-center justify-center p-2">
                        <QRCodeSVG 
                          value={qrCodeValue || 'ABA PayWay Payment'} 
                          size={180}
                          level="H"
                          includeMargin={false}
                          bgColor="#ffffff"
                          fgColor="#000000"
                        />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-white mt-4 font-semibold">Phone: {phoneNumber || 'Not provided'}</p>
                  <p className="text-slate-400 text-sm mt-2">Amount: ${totalAmount.toFixed(2)}</p>
                  
                  <div className="mt-4 bg-slate-700/50 rounded-lg p-4 text-left">
                    <p className="text-orange-500 font-bold mb-2">How to pay:</p>
                    <p className="text-slate-300 text-sm">1. Open your ABA app</p>
                    <p className="text-slate-300 text-sm">2. Scan the QR code above</p>
                    <p className="text-slate-300 text-sm">3. Confirm payment of ${totalAmount.toFixed(2)}</p>
                    <p className="text-slate-300 text-sm">4. Click confirm after payment</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    disabled={isProcessing}
                    className="mt-4 w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all"
                  >
                    {isProcessing ? 'Processing...' : 'Confirm Payment'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm py-4">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Your payment is secure and encrypted</span>
        </div>

        {/* Submit Button (for VISA) */}
        {activeMethod === 'visa' && (
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 shadow-lg ${
              isProcessing
                ? 'bg-slate-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/25'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing Payment...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Pay ${totalAmount.toFixed(2)}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            )}
          </button>
        )}

        {/* Payment Methods Footer */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-700">
          <span className="text-slate-500 text-xs">Accepted:</span>
          <div className="flex gap-2">
            <div className="w-10 h-7 bg-white rounded overflow-hidden flex items-center justify-center">
              <Image 
                src="/visa.png" 
                alt="VISA"
                width={40}
                height={28}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-10 h-7 bg-white rounded overflow-hidden flex items-center justify-center">
              <Image 
                src="/bakong.png" 
                alt="Bakong"
                width={40}
                height={28}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-10 h-7 bg-white rounded overflow-hidden flex items-center justify-center">
              <Image 
                src="/abapayway.png" 
                alt="ABA PayWay"
                width={40}
                height={28}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
