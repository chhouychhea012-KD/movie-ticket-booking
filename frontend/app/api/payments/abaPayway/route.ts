// ABA PayWay Payment API Route
import { NextRequest, NextResponse } from 'next/server'

// ABA PayWay API endpoint - using sandbox for demo
const ABA_PAYWAY_API_URL = 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      amount, 
      currency = 'USD', 
      orderId, 
      customerName, 
      customerEmail,
      returnUrl 
    } = body

    // Validate required fields
    if (!amount || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount and orderId' },
        { status: 400 }
      )
    }

    // Prepare ABA PayWay payment request
    const paymentData = {
      merchant_id: process.env.ABA_MERCHANT_ID || 'demo_merchant',
      merchant_key: process.env.ABA_MERCHANT_KEY || 'demo_key',
      amount: amount,
      currency: currency,
      order_id: orderId,
      customer_name: customerName || 'Customer',
      customer_email: customerEmail || 'customer@example.com',
      customer_phone: '+85512345678',
      payment_option: 'payway',
      return_url: returnUrl || 'http://localhost:3000/payment/success',
      cancel_url: 'http://localhost:3000/payment/cancel',
      notify_url: 'http://localhost:3000/api/payments/abaPayway/webhook',
      items: [
        {
          name: 'Movie Tickets',
          quantity: 1,
          price: amount
        }
      ]
    }

    // In production, make actual API call to ABA PayWay
    // For demo, we simulate a successful response
    const mockResponse = {
      success: true,
      paymentId: `ABA_${Date.now()}`,
      orderId: orderId,
      amount: amount,
      currency: currency,
      paymentUrl: `https://checkout-sandbox.payway.com.kh/payment/${orderId}`,
      status: 'pending',
      message: 'ABA PayWay payment initiated successfully',
      timestamp: new Date().toISOString()
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error('ABA PayWay payment error:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}

// Handle webhook for payment confirmation
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId, status } = body

    // In production, verify the webhook signature
    // Process the payment status update
    
    return NextResponse.json({
      success: true,
      paymentId,
      status: status || 'completed',
      message: 'Payment confirmed'
    })
  } catch (error) {
    console.error('ABA PayWay webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
