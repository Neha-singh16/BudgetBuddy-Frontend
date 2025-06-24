// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        screens: {
        'tablet': '700px',
        // keep defaults or adjust as needed
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        // ...
      },
       colors: {
        navy: "#2F4156",
        teal: "#567C8D",
        skyblue: "#C8D9E6",
        beige: "#F5EFEB",
        white: "#FFFFFF",
      },
    },
  },
  plugins: [],
}
