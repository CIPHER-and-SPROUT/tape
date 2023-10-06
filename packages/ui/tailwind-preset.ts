/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        tablet: '640px',
        laptop: '1024px',
        desktop: '1280px',
        ultrawide: '1800px'
      },
      colors: {
        brand: {
          50: '#eff9ff',
          100: '#dff2ff',
          200: '#b8e8ff',
          300: '#78d6ff',
          400: '#39c4ff',
          500: '#06aaf1',
          600: '#0088ce',
          700: '#006da7',
          800: '#025b8a',
          900: '#084c72',
          950: '#06304b'
        }
      }
    }
  },
  variants: { extend: {} }
}
