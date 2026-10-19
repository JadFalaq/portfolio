'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'

interface HeroVideoProps {
  pauseLabel: string
  playLabel: string
}

// Muted full-bleed background loop (no audio track), centred on the subject. The poster is the server-rendered frame, so the
// hero is complete without JavaScript; playback only starts after hydration, never when
// the visitor prefers reduced motion, and pauses while off-screen or in a hidden tab.
export default function HeroVideo({ pauseLabel, playLabel }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  // A ref, not state: the observer callback must see the latest choice.
  const userPaused = useRef(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return

    const tryPlay = () => {
      if (userPaused.current) return
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
    let visible = false
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !document.hidden) tryPlay()
      else {
        video.pause()
        setPlaying(false)
      }
    })
    observer.observe(video)
    const onVisibility = () => {
      if (document.hidden) {
        video.pause()
        setPlaying(false)
      } else if (visible) {
        tryPlay()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const toggle = () => {
    const video = ref.current
    if (!video) return
    if (video.paused) {
      userPaused.current = false
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else {
      userPaused.current = true
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover object-center"
        poster="/hero-intro-poster.jpg"
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/hero-intro.mp4" type="video/mp4" />
        <source src="/hero-intro.webm" type="video/webm" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? pauseLabel : playLabel}
        className="absolute right-5 top-24 z-10 flex h-11 w-11 md:right-10 items-center justify-center rounded-full border border-paper/25 bg-ink/60 text-paper backdrop-blur transition-colors duration-200 ease-out hover:border-accent hover:text-accent"
      >
        {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
      </button>
    </div>
  )
}
