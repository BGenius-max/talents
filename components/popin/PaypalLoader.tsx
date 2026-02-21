// components/PaypalLoader.tsx
'use client'

import Script from 'next/script'
import { useEffect } from 'react'

export default function PaypalLoader() {
  useEffect(() => {
    if (window.paypal) {
      console.log('PayPal SDK loaded successfully')
    }
  }, [])

  return (
    <Script
      src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`}
      strategy="afterInteractive"
      onError={(e) => console.error('PayPal SDK failed to load', e)}
    />
  )
}