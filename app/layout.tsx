import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '../contexts/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jadfalaq.vercel.app'
const title = 'Jad Falaq - AI Engineer Portfolio'
const description = 'Portfolio of Jad Falaq, AI Engineering student at ENSIAS specializing in machine learning, deep learning, computer vision and generative AI.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: 'AI Engineer, Machine Learning, Deep Learning, Computer Vision, NLP, Portfolio, Jad Falaq, ENSIAS',
  authors: [{ name: 'Jad Falaq' }],
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: 'Jad Falaq Portfolio',
    images: [{ url: '/profil.jpg', width: 400, height: 400, alt: 'Jad Falaq' }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title,
    description,
    images: ['/profil.jpg'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={inter.className}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
