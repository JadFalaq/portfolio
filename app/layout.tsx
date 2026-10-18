import type { Metadata, Viewport } from 'next'
import { Instrument_Serif, JetBrains_Mono, Manrope } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '../contexts/LanguageContext'
import { ProfileProvider } from '../contexts/ProfileContext'

const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const sans = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jadfalaq.online'
// Vercel preview deployments must not be indexed (VERCEL_ENV is set by Vercel at build time).
const isPreview = process.env.VERCEL_ENV === 'preview'
const title = 'Jad Falaq | Data & AI Engineer — GenAI & MLOps'
const description = "Portfolio de Jad Falaq, élève-ingénieur à l'ENSIAS. Projets en Data Engineering, IA générative, Machine Learning et MLOps. Stage PFE de 6 mois dès janvier 2027."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: 'Data Engineer, AI Engineer, Machine Learning Engineer, Generative AI, RAG, LLM, MLOps, Computer Vision, Portfolio, Jad Falaq, ENSIAS',
  authors: [{ name: 'Jad Falaq' }],
  robots: isPreview ? { index: false, follow: false } : { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: 'Jad Falaq Portfolio',
    images: [{ url: '/profil.jpg', width: 400, height: 400, alt: 'Jad Falaq' }],
    locale: 'fr_FR',
    alternateLocale: ['en_US'],
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
  themeColor: '#0A0D13',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`motion-safe:scroll-smooth ${display.variable} ${mono.variable} ${sans.variable}`}>
      <body className="font-sans">
        <LanguageProvider>
          <ProfileProvider>{children}</ProfileProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
