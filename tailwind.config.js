/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        vesper: {
          accent: '#FFC799',      // Yummy pinkish-orange highlight colour
          text: '#FFFFFF',        // Primary white text
          secondary: '#A0A0A0',   // Secondary gray text  
          background: '#0a0a0a',  // Page background
          terminal: '#101010',    // Terminal window background
          border: '#282828',      // Border colour
          tab: '#161616',         // Tab header background
          hover: '#343434',       // Hover states
        }
      }
    },
  },
  plugins: [],
}