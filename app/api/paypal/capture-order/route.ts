import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { orderID } = await req.json()

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64')

    const res = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
      }
    )

    const data = await res.json()

    if (!res.ok || data.status !== 'COMPLETED') {
      console.error('PayPal capture error:', data)
      return NextResponse.json(
        { error: 'Payment capture failed', details: data },
        { status: 400 }
      )
    }

    // FIX: Spread the data so 'status' is at the top level for the frontend
    return NextResponse.json({ success: true, ...data })
  } catch (err) {
    console.error('Capture exception:', err)
    return NextResponse.json(
      { error: 'Failed to capture payment' },
      { status: 500 }
    )
  }
}