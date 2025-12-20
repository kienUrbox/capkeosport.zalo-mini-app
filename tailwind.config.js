/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[zaui-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#060910',
        surface: '#0F1422',
        card: '#151C2F',
        primary: '#7C5CFF',
        'primary-soft': '#9983ff',
        secondary: '#1FC4FF',
        accent: '#F97316',
        success: '#22c55e',
        warning: '#facc15',
        danger: '#ef4444',
        muted: '#94a3b8',
        border: '#1f2937',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 12px 30px rgb(6 9 16 / 0.45)',
      },
      borderRadius: {
        xl: '24px',
      },
    },
  },
  plugins: [],
}

