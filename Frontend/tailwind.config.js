/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1D4ED8',
          light: '#3B82F6',
          dark: '#1E40AF',
          muted: '#DBEAFE',
          'muted-dark': '#1E3A5F',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1E293B',
        },
        bg: {
          DEFAULT: '#F8FAFC',
          dark: '#0F172A',
        },
        border: {
          DEFAULT: '#E2E8F0',
          dark: '#334155',
        },
        text: {
          primary: '#0F172A',
          muted: '#64748B',
          'primary-dark': '#F1F5F9',
          'muted-dark': '#94A3B8',
        },
        danger: { DEFAULT: '#DC2626', dark: '#EF4444' },
        success: { DEFAULT: '#16A34A', dark: '#22C55E' },
        warning: { DEFAULT: '#D97706', dark: '#F59E0B' },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.10)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
