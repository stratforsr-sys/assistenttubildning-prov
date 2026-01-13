import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'telink': {
          'bg': '#0F1C2E',
          'bg-secondary': '#162337',
          'bg-tertiary': '#1D2D44',
          'accent': '#3DD68C',
          'accent-hover': '#2FC67C',
          'accent-muted': 'rgba(61, 214, 140, 0.1)',
          'text': '#FFFFFF',
          'text-secondary': '#A4B3C7',
          'text-muted': '#6B7A8F',
          'border': 'rgba(255, 255, 255, 0.1)',
          'border-accent': 'rgba(61, 214, 140, 0.3)',
        },
        'status': {
          'correct': '#3DD68C',
          'incorrect': '#EF4444',
          'warning': '#F59E0B',
        }
      },
      fontFamily: {
        'jakarta': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(61, 214, 140, 0.15)',
        'glow-lg': '0 0 40px rgba(61, 214, 140, 0.2)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'progress': 'progress 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
