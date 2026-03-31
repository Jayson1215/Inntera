import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#EF2B1E",
        secondary: "#003580",
        accent: "#febb02",
        success: "#06C755",
        warning: "#FFB81C",
        danger: "#E74C3C",
      },
    },
  },
  plugins: [],
};
export default config;