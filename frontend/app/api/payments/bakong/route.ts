// Bakong Payment API Route
import { NextRequest, NextResponse } from 'next/server'

// Bakong API endpoints
const BAKONG_API_URL = 'https://api-bakong.nbc.gov.kh/api/v1'
const BAKONG_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiMGRlMGI1N2ExNDQzNGZlNyJ9LCJpYXQiOjE3NzQ4ODQyOTgsImV4cCI6MTc4MjY2MDI5OH0.dFkVVt0X91-hnjBN3z2I8mX08dAQb3Ycym5u2TlKU_w'
const BAKONG_ACCOUNT_NAME = 'CHHEA CHHOUY'

// Currency conversion rates
const USD_TO_KHR = 4100 // Approximate rate, should be fetched from API

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      amount, 
      currency = 'USD', 
      orderId, 
      customerName, 
      customerEmail,
      returnUrl,
      phoneNumber
    } = body

    // Validate required fields
    if (!amount || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount and orderId' },
        { status: 400 }
      )
    }

    // Convert amount to KHR for Bakong (if USD)
    const amountInKHR = currency === 'KHR' ? amount : Math.round(amount * USD_TO_KHR)
    const finalAmount = currency === 'KHR' ? amount : amountInKHR

    // Prepare request to Bakong API
    const bakongRequestData = {
      amount: finalAmount,
      currency: 'KHR',
      reference: orderId,
      accountName: BAKONG_ACCOUNT_NAME,
      callbackUrl: returnUrl || 'http://localhost:3000/api/payments/bakong/webhook',
      expireMinutes: 5,
    }

    try {
      // Make actual API call to Bakong
      const response = await fetch(`${BAKONG_API_URL}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BAKONG_TOKEN}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(bakongRequestData),
      })

      const result = await response.json()

      if (result.error || !response.ok) {
        // If real API fails, use fallback response
        console.log('Bakong API error, using fallback:', result)
        
        // Generate QR data for fallback
        const qrData = JSON.stringify({
          merchant: 'Bakong',
          account: BAKONG_ACCOUNT_NAME,
          amount: finalAmount,
          currency: 'KHR',
          orderId: orderId,
          billNo: orderId,
        })

        return NextResponse.json({
          success: true,
          paymentId: `BK_${Date.now()}`,
          orderId: orderId,
          amount: finalAmount,
          currency: 'KHR',
          accountName: BAKONG_ACCOUNT_NAME,
          status: 'pending',
          message: 'Payment initialized (demo mode)',
          qrCode: qrData,
          qrCodeUrl: `https://api-bakong.nbc.gov.kh/api/v1/generate-qr?data=${encodeURIComponent(qrData)}`,
          instructions: [
            '1. Open your Bakong app on your phone',
            '2. Scan the QR code',
            '3. Confirm the payment amount',
            '4. Complete the transaction'
          ],
          timestamp: new Date().toISOString()
        })
      }

      // Success response from Bakong
      return NextResponse.json({
        success: true,
        paymentId: result.paymentId || result.id || `BK_${Date.now()}`,
        orderId: orderId,
        amount: finalAmount,
        currency: 'KHR',
        accountName: BAKONG_ACCOUNT_NAME,
        status: 'pending',
        message: 'Bakong payment initialized successfully',
        qrCode: result.qrCode || result.data?.qrCode || JSON.stringify({
          merchant: 'Bakong',
          account: BAKONG_ACCOUNT_NAME,
          amount: finalAmount,
          currency: 'KHR',
          orderId: orderId,
        }),
        instructions: [
          '1. Open your Bakong app on your phone',
          '2. Scan the QR code',
          '3. Confirm the payment amount in KHR',
          '4. Complete the transaction'
        ],
        timestamp: new Date().toISOString()
      })
    } catch (apiError) {
      console.error('Bakong API call error:', apiError)
      
      // Fallback response when API is not available
      const qrData = JSON.stringify({
        merchant: 'Bakong',
        account: BAKONG_ACCOUNT_NAME,
        amount: finalAmount,
        currency: 'KHR',
        orderId: orderId,
        billNo: orderId,
        phone: phoneNumber || '',
      })

      return NextResponse.json({
        success: true,
        paymentId: `BK_${Date.now()}`,
        orderId: orderId,
        amount: finalAmount,
        currency: 'KHR',
        amountUSD: amount,
        accountName: BAKONG_ACCOUNT_NAME,
        phoneNumber: phoneNumber,
        status: 'pending',
        message: 'Bakong payment QR generated (demo mode)',
        qrCode: qrData,
        qrCodeUrl: `https://api-bakong.nbc.gov.kh/api/v1/generate-qr?data=${encodeURIComponent(qrData)}`,
        instructions: [
          `1. Open your Bakong app on your phone`,
          `2. Enter amount: ${finalAmount.toLocaleString()} KHR`,
          `3. Account: ${BAKONG_ACCOUNT_NAME}`,
          `4. Complete payment`
        ],
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Bakong payment error:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}

// Webhook for payment confirmation
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId, status, amount } = body

    // Verify webhook with Bakong
    // In production, verify the webhook signature
    
    return NextResponse.json({
      success: true,
      paymentId,
      status: status || 'completed',
      amount: amount,
      message: 'Payment confirmed'
    })
  } catch (error) {
    console.error('Bakong webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Check payment status
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const paymentId = searchParams.get('paymentId')
  const orderId = searchParams.get('orderId')

  if (!paymentId && !orderId) {
    return NextResponse.json(
      { error: 'Missing paymentId or orderId parameter' },
      { status: 400 }
    )
  }

  try {
    // In production, check actual payment status from Bakong API
    // For demo, simulate completed payment
    const mockStatusResponse = {
      success: true,
      paymentId: paymentId || orderId,
      orderId: orderId,
      status: 'completed',
      message: 'Payment completed successfully',
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(mockStatusResponse)
  } catch (error) {
    console.error('Bakong status check error:', error)
    return NextResponse.json(
      { error: 'Status check failed' },
      { status: 500 }
    )
  }
}
