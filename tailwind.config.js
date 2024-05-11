/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3b82f6', // Blue 500
          DEFAULT: '#2563eb', // Blue 600
          dark: '#1d4ed8', // Blue 700
        },
        secondary: {
          light: '#d1d5db', // Cool Gray 300
          DEFAULT: '#9ca3af', // Cool Gray 400
          dark: '#6b7280', // Cool Gray 500
        },
        accent: {
          orange: '#fb923c', // Orange 400
          teal: '#2dd4bf', // Teal 400
          yellow: '#f59e0b', // Yellow 400
        },
        background: {
          light: '#f3f4f6', // Cool Gray 100
          DEFAULT: '#e5e7eb', // Cool Gray 200
          dark: '#1f2937', // Cool Gray 800
        },
        text: {
          light: '#374151', // Cool Gray 700
          DEFAULT: '#1f2937', // Cool Gray 800
          dark: '#f9fafb', // White-ish
          // white: '#ffffff', // White
        }
      }
    }
  },
  plugins: [],
}