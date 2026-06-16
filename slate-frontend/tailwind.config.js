/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
            brand: {
                50: '#f0fdfa',   // Ultra soft mint/teal background tint
                100: '#ccfbf1',  // Subtle border bounds
                200: '#99f6e4',  // Light UI layout accents
                500: '#0d9488',  // Text interaction highlights (Teal 600)
                600: '#115e59',  // Core Brand Action Color (Teal 800)
                700: '#134e4a',  // Dark action hover state (Teal 900)
              }
        }
      },
    },
    plugins: [],
  }