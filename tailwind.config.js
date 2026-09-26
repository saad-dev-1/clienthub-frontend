/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ClientHub Design System
        bg: {
          base: '#09090B',
          card: '#18181B',
          hover: '#27272A',
        },
        border: {
          DEFAULT: '#27272A',
          strong: '#3F3F46',
        },
        text: {
          primary: '#FAFAFA',
          muted: '#A1A1AA',
          subtle: '#71717A',
        },
        accent: {
          DEFAULT: '#6366F1',
          hover: '#818CF8',
          subtle: '#1E1B4B',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'lg': '8px',
        'xl': '12px',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [],
}