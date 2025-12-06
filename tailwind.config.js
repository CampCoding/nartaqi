// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#F97316",
        accent: "#8B5CF6",
        background: "#F9FAFC",
        text: "#202938",
      },
    },
  },
  corePlugins: {
    preflight: true, // keep preflight
  },
  plugins: [],
};


