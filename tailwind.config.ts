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
        primary: "#0066cc",
        secondary: "#f5a623",
        success: "#27ae60",
        warning: "#f39c12",
        danger: "#e74c3c",
      },
    },
  },
  plugins: [],
};
export default config;
