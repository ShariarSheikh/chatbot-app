// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backdropBlur: {
        "3xl": "64px",
        "4xl": "80px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-metallic":
          "linear-gradient(45deg, transparent_25%, rgba(255,255,255,0.1)_50%, transparent_75%)",
      },
    },
  },
  plugins: [],
};
