import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import Script from 'next/script'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata: Metadata = {
  title: {
    default: 'Yelvatix - Free Online Tools | Job Search, Resume Builder, Image Compressor',
    template: '%s | Yelvatix',
  },
  description:
    'Yelvatix offers free online tools: skill-based job search, professional resume builder, and image compressor. No login required, no paywall. Fast, free, and easy to use.',
  keywords: [
    'free resume builder',
    'job search by skills',
    'image compressor online',
    'free online tools',
    'compress images',
    'build resume free',
    'skill based job search',
  ],
  authors: [{ name: 'Yelvatix' }],
  creator: 'Yelvatix',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Yelvatix',
    title: 'Yelvatix - Free Online Tools',
    description:
      'Free skill-based job search, resume builder, and image compressor. No login, no paywall.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yelvatix - Free Online Tools',
    description:
      'Free skill-based job search, resume builder, and image compressor. No login, no paywall.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1a73e8' },
    { media: '(prefers-color-scheme: dark)', color: '#4a9eff' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9846167379739321"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>{children}</body>
    </html>
  )
}
