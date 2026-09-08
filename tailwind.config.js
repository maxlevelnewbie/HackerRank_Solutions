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
        hr: {
          green: '#00EA64',
          'green-hover': '#00d65b',
          'green-dark': '#1ba94c',
          bg: '#0E141E',
          card: '#151F2E',
          'card-hover': '#1C2738',
          border: '#2B384E',
          input: '#1D2A3D',
          muted: '#9AAEC3',
          subtle: '#6F879F',
          yellow: '#FF9900',
          red: '#FF3B30',
          blue: '#2EC866',
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'Cascadia Code', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Inter', 'Open Sans', 'Segoe UI', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

