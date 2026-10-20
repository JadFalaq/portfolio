/** @type {import('tailwindcss').Config} */
module.exports = {
  // hover: utilities only apply on devices that can hover — no sticky hover on touch screens.
  future: { hoverOnlyWhenSupported: true },
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Obsidian & champagne — dark sections alternate with ivory ones.
        ink: '#0A0D13',        // obsidian: dark section background / light section text
        surface: '#11151D',    // raised panels on dark
        paper: '#F3EDE2',      // ivory: dark section text / light section background
        accent: 'rgb(var(--accent) / <alpha-value>)',          // profile color — italics, numerals, hairlines, CTAs
        accentDeep: 'rgb(var(--accent-deep) / <alpha-value>)', // darker profile color for use on ivory (contrast)
        muted: '#8C8F96',      // secondary text on dark
        mutedInk: '#6E6658',   // secondary text on ivory
        line: 'rgba(243,237,226,0.10)',   // hairline borders on dark
        lineInk: 'rgba(10,13,19,0.12)',   // hairline borders on ivory
      },
      fontFamily: {
        display: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        hero: ['var(--font-hero)', 'ui-serif', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 45s linear infinite',
        drift: 'drift 18s ease-in-out infinite alternate',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        drift: {
          '0%': { transform: 'translate3d(0,0,0) scale(1)' },
          '100%': { transform: 'translate3d(-6%,4%,0) scale(1.15)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%) skewX(-20deg)' },
          '100%': { transform: 'translateX(320%) skewX(-20deg)' },
        },
      },
    },
  },
  plugins: [],
}
