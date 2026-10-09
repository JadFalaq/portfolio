import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, Source_Sans_3 } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '../contexts/LanguageContext'
import { ProfileProvider } from '../contexts/ProfileContext'

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
})

const sans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jadfalaq.vercel.app'
const title = 'Jad Falaq — Data & AI Engineer'
const description = 'Portfolio of Jad Falaq, final-year AI engineering student at ENSIAS. Three lenses on the same engineering foundation: Data & AI Engineering, Generative AI, and Machine Learning / MLOps.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: 'Data Engineer, AI Engineer, Machine Learning Engineer, Generative AI, RAG, LLM, MLOps, Computer Vision, Portfolio, Jad Falaq, ENSIAS',
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
  themeColor: '#10171D',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`scroll-smooth ${mono.variable} ${sans.variable}`}>
      <body className="font-sans">
        <LanguageProvider>
          <ProfileProvider>{children}</ProfileProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
