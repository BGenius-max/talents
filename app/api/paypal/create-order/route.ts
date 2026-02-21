import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { amount, description } = await req.json()

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64')

    const res = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: amount,
              },
              description,
            },
          ],
        }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      console.error('PayPal create-order error:', data)
      return NextResponse.json(
        {
          error: data?.message || 'PayPal order creation failed',
          details: data,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('Create order exception:', err)
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 }
    )
  }
}
