import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        glass: {
          bg: 'rgba(255,255,255,0.05)',
          'bg-strong': 'rgba(255,255,255,0.10)',
          border: 'rgba(255,255,255,0.10)',
          'border-strong': 'rgba(255,255,255,0.15)',
        },
        surface: {
          DEFAULT: '#0a0c10',
          elevated: '#0f1218',
        },
        accent: {
          DEFAULT: '#38bdf8',
          soft: '#7dd3fc',
        }
      },
      fontFamily: {
        display: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Barlow', 'Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        glass: '24px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
} satisfies Config