import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/index.css'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HOPO Homes - Premium Furnished Rentals in Dubai | AI-Powered Rental Platform',
  description: 'Find your perfect fully-furnished apartment, villa, or co-living space in Dubai. HOPO Homes offers ready-to-move-in properties with flexible leases and AI-powered property matching.',
  keywords: 'Dubai rentals, furnished apartments Dubai, co-living Dubai, short-term rentals UAE, property management Dubai',
  openGraph: {
    title: 'HOPO Homes - Premium Furnished Rentals in Dubai',
    description: 'Find your perfect fully-furnished home in Dubai. Ready-to-move-in apartments, villas & co-living spaces.',
    type: 'website',
    url: 'https://hopohomes.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HOPO Homes - Premium Furnished Rentals in Dubai',
    description: 'Find your perfect fully-furnished home in Dubai. AI-powered rental platform.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
          <Sonner />
        </Providers>
      </body>
    </html>
  )
}
