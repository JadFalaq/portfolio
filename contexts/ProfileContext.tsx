'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ProfileId = 'data-ai' | 'genai' | 'mlops'

export const PROFILE_IDS: ProfileId[] = ['data-ai', 'genai', 'mlops']

interface ProfileContextType {
  profile: ProfileId
  setProfile: (p: ProfileId) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

const STORAGE_KEY = 'portfolio-profile'

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<ProfileId>('data-ai')

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored === 'data-ai' || stored === 'genai' || stored === 'mlops') {
        setProfileState(stored)
      }
    } catch {
      // localStorage unavailable — keep default
    }
  }, [])

  const setProfile = (p: ProfileId) => {
    setProfileState(p)
    try {
      window.localStorage.setItem(STORAGE_KEY, p)
    } catch {
      // ignore
    }
  }

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
