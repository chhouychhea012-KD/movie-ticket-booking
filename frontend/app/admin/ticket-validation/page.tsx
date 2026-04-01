'use client'

import { useState, useEffect } from 'react'
import { ticketsAPI } from '@/lib/api'
import { QrCode, Search, Check, X, Clock, AlertTriangle, Camera, RefreshCw, User, Calendar, Ticket } from 'lucide-react'

export default function TicketValidationPage() {
  const [scanInput, setScanInput] = useState('')
  const [scannedTickets, setScannedTickets] = useState<any[]>([])
  const [validationResult, setValidationResult] = useState<{
    status: 'success' | 'error' | 'warning' | null
    message: string
    ticket: any
  }>({ status: null, message: '', ticket: null })

  // In a real app, this would use a camera-based QR scanner
  const handleManualScan = async () => {
    if (!scanInput.trim()) return

    const ticketCode = scanInput.trim().toUpperCase()
    
    try {
      // Call the API to validate the ticket
      const response = await ticketsAPI.validate(ticketCode)
      
      if (response.success && response.data) {
        setValidationResult({
          status: response.data.status,
          message: response.data.message,
          ticket: response.data.ticket
        })
        
        if (response.data.status === 'success') {
          setScannedTickets([...scannedTickets, response.data.ticket])
        }
      } else {
        setValidationResult({
          status: 'error',
          message: response.message || 'Ticket not found. Please check the ticket code.',
          ticket: null
        })
      }
    } catch (error) {
      setValidationResult({
        status: 'error',
        message: 'Failed to validate ticket. Please try again.',
        ticket: null
      })
    }
    
    setScanInput('')
  }

  const handleClearResult = () => {
    setValidationResult({ status: null, message: '', ticket: null })
    setScanInput('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'used': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'expired': return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Ticket Validation</h1>
          <p className="text-slate-400 mt-1">Scan QR codes to validate movie tickets</p>
        </div>
      </div>

      {/* Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner Input */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-500/20 rounded-full mb-4">
              <Camera className="w-12 h-12 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Scan Ticket</h2>
            <p className="text-slate-400 mt-2">Enter ticket code or scan QR code</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Ticket Code / Booking ID</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value.toUpperCase())}
                  placeholder="Enter ticket code..."
                  className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition text-center font-mono text-lg"
                  onKeyDown={(e) => e.key === 'Enter' && handleManualScan()}
                />
                <button
                  onClick={handleManualScan}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition flex items-center gap-2"
                >
                  <QrCode className="w-5 h-5" />
                  Validate
                </button>
              </div>
            </div>

            <p className="text-slate-500 text-sm text-center">
              Tip: You can scan the QR code using a barcode scanner or enter the ticket code manually
            </p>
          </div>
        </div>

        {/* Validation Result */}
        <div className={`bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border ${
          validationResult.status === 'success' ? 'border-green-500/50' :
          validationResult.status === 'error' ? 'border-red-500/50' :
          validationResult.status === 'warning' ? 'border-yellow-500/50' :
          'border-slate-700/50'
        }`}>
          {validationResult.status === null ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-700/50 rounded-full mb-4">
                <QrCode className="w-12 h-12 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-white">Ready to Scan</h3>
              <p className="text-slate-400 mt-2">Enter a ticket code to validate</p>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                  validationResult.status === 'success' ? 'bg-green-500/20' :
                  validationResult.status === 'error' ? 'bg-red-500/20' :
                  'bg-yellow-500/20'
                }`}>
                  {validationResult.status === 'success' ? (
                    <Check className="w-10 h-10 text-green-500" />
                  ) : validationResult.status === 'error' ? (
                    <X className="w-10 h-10 text-red-500" />
                  ) : (
                    <AlertTriangle className="w-10 h-10 text-yellow-500" />
                  )}
                </div>
                <h3 className={`text-2xl font-bold ${
                  validationResult.status === 'success' ? 'text-green-500' :
                  validationResult.status === 'error' ? 'text-red-500' :
                  'text-yellow-500'
                }`}>
                  {validationResult.status === 'success' ? 'Valid Ticket' :
                   validationResult.status === 'error' ? 'Invalid Ticket' :
                   'Warning'}
                </h3>
                <p className="text-slate-400 mt-2">{validationResult.message}</p>
              </div>

              {validationResult.ticket && (
                <div className="bg-slate-700/30 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Movie</span>
                    <span className="text-white font-medium">{validationResult.ticket.movieTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Showtime</span>
                    <span className="text-white">{validationResult.ticket.showtime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Seats</span>
                    <span className="text-white">
                      {validationResult.ticket.seats.map((s: any) => s.seatNumber).join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(validationResult.ticket.status)}`}>
                      {validationResult.ticket.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleClearResult}
                className="w-full mt-6 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Scan Another Ticket
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Scans */}
      <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white">Recent Validations</h2>
        </div>
        
        {scannedTickets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-700/20">
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Ticket Code</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Movie</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Showtime</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Seats</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Status</th>
                  <th className="px-6 py-4 text-left text-slate-400 font-semibold text-sm">Validated At</th>
                </tr>
              </thead>
              <tbody>
                {scannedTickets.map((ticket, index) => (
                  <tr 
                    key={index}
                    className={`${index % 2 === 0 ? "bg-slate-800/40" : "bg-slate-800/20"} border-b border-slate-700/30`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-white font-mono text-sm">{ticket.ticketCode}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">{ticket.movieTitle}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300">{ticket.showtime}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300">{ticket.seats.map((s: any) => s.seatNumber).join(', ')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-green-500/20 text-green-400 border-green-500/30">
                        VALIDATED
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-400 text-sm">
                        {new Date().toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Ticket className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No tickets validated yet</p>
            <p className="text-slate-500 text-sm mt-2">Validated tickets will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}