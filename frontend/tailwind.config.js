/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
theme: {
    extend: {
      colors: {
        // Customize light mode colors (default, applies when no `.dark` class)
        lightBg: '#f9fafb',        // example light background
        lightText: '#1f2937',      // example light text (gray-800)
        lightmain:'#347deb',
        // Customize dark mode colors
        darkBg: '#1b165c', 
        darkmain: '#070a37',        // example dark background (gray-800)
        darkText: '#f9fafb',
        darkcontrast:'#742bec',
        darko:'#15274c'      // example dark text (gray-50)
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Enable dark mode support
}
