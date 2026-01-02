/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Football Connect Green Theme
        primary: '#11d473',
        'primary-dark': '#0ea65a',
        'primary-light': '#4ae19a',

        // Background Colors
        'background-light': '#f6f8f7',
        'background-dark': '#102219',

        // Surface Colors
        'surface-dark': '#1c2721',
        'surface-light': '#ffffff',

        // Border & Text
        'border-dark': '#2a3b32',
        'text-secondary': '#9db9ab',

        // Semantic Colors
        success: '#22c55e',
        warning: '#facc15',
        danger: '#ef4444',
        muted: '#94a3b8',

        // Legacy aliases for compatibility
        background: '#102219',
        surface: '#1c2721',
        card: '#1c2721',
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
        glow: '0 0 20px -5px rgba(17, 212, 115, 0.3)',
        card: '0 12px 30px rgb(6 9 16 / 0.45)',
      },
    },
  },
  plugins: [],
}

