import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '../contexts/LanguageContext'
import { ProfileProvider } from '../contexts/ProfileContext'

// Hero only: name and title in a classical serif.
const hero = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-hero',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

// One family for headings and text (headings use heavier weights + tighter tracking).
const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-sans',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jadfalaq.online'
// Vercel preview deployments must not be indexed (VERCEL_ENV is set by Vercel at build time).
const isPreview = process.env.VERCEL_ENV === 'preview'
const title = 'Jad Falaq | Data & AI Engineer — GenAI & MLOps'
const description = "Portfolio de Jad Falaq, élève-ingénieur à l'ENSIAS. Projets en Data Engineering, IA générative, Machine Learning et MLOps. À la recherche d’un stage PFE."

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
    <html lang="fr" className={`motion-safe:scroll-smooth ${hero.variable} ${mono.variable} ${sans.variable}`}>
      <body className="font-sans">
        <LanguageProvider>
          <ProfileProvider>{children}</ProfileProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
