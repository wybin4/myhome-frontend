/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "sm": { "min": "280px", "max": "400px" },
        "md": { "min": "401px", "max": "600px" },
        "lg": { "min": "601px", "max": "900px" },
        "xl": { "min": "901px", "max": "1200px" },
        "2xl": { "min": "1201px", "max": "1600px" },
        "3xl": { "min": "1601px", "max": "1950px" },
      }
    },
  },
  plugins: [],
}
