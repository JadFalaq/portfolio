'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'fr' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = 'portfolio-language'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr')

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored === 'fr' || stored === 'en') {
        setLanguageState(stored)
        return
      }
      // Fall back to browser preference on first visit
      if (navigator.language && navigator.language.toLowerCase().startsWith('fr')) {
        setLanguageState('fr')
      } else if (navigator.language) {
        setLanguageState('en')
      }
    } catch {
      // localStorage unavailable (private browsing, etc.) — keep default
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore
    }
  }

  const toggleLanguage = () => setLanguage(language === 'fr' ? 'en' : 'fr')

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
