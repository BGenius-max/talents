import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Talents & Impact',
  description: 'Talent development, health services, leadership and community impact',
  icons: {
    icon: '/logo/ngo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`}
          strategy="afterInteractive"
        />
      </head>

      <body
        className="bg-white text-gray-900 antialiased min-h-screen"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}