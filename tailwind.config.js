/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Editorial dark/light duo — sections flip between the two.
        ink: '#10171D',      // dark section background / light section text
        paper: '#F1EADC',    // dark section text / light section background
        accent: '#A8E063',   // lime — used sparingly: links, one word per headline, numbers
        muted: '#8A9099',    // secondary text on dark
        mutedInk: '#6B6459', // secondary text on light
        line: 'rgba(241,234,220,0.14)',   // hairline borders on dark
        lineInk: 'rgba(16,23,29,0.14)',   // hairline borders on light
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
