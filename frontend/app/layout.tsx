/**
 * BOT (Baked On Time) - Frontend Layout Component
 * 
 * Copyright (c) 2025 BOT (Baked On Time)
 * Licensed under the MIT License
 * 
 * AI-Powered Cake Design & Booking Platform for Professional Bakers
 */

import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'BOT (Baked On Time) - AI-Powered Cake Design & Booking',
  description: 'Professional cake design platform with AI-powered mockups, automated pricing, and production planning for custom bakers',
  keywords: ['cake design', 'bakery', 'AI mockup', 'custom cakes', 'cake booking'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
