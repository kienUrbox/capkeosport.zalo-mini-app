/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Football Connect Blue Theme
        primary: '#3b82f6',
        'primary-dark': '#2563eb',
        'primary-light': '#60a5fa',

        // Background Colors
        'background-light': '#f6f8f7',
        'background-dark': '#0f172a',

        // Surface Colors
        'surface-dark': '#1e293b',
        'surface-light': '#ffffff',

        // Border & Text
        'border-dark': '#334155',
        'text-secondary': '#94a3b8',

        // Semantic Colors
        success: '#22c55e',
        warning: '#facc15',
        danger: '#ef4444',
        muted: '#94a3b8',

        // Legacy aliases for compatibility
        background: '#0f172a',
        surface: '#1e293b',
        card: '#1e293b',
      },
      fontFamily: {
        sans: ['Lexend', 'Noto Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Lexend', 'Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Noto Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        glow: '0 0 20px -5px rgba(59, 130, 246, 0.3)',
        card: '0 12px 30px rgb(6 9 16 / 0.45)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)' },
          '50%': { boxShadow: '0 0 0 4px rgba(59, 130, 246, 0)' },
        },
        'live-glow': {
          '0%, 100%': { boxShadow: '0 0 5px 0 rgba(239, 68, 68, 0.3)' },
          '50%': { boxShadow: '0 0 20px 5px rgba(239, 68, 68, 0.1)' },
        },
        'result-in': {
          'from': { transform: 'scale(0.5)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' },
        },
        'card-entrance': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'live-glow': 'live-glow 2s ease-in-out infinite',
        'result-in': 'result-in 0.3s ease-out forwards',
        'card-entrance': 'card-entrance 0.4s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}

