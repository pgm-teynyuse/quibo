import { title } from "process";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ubuntu: ["Ubuntu", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        body: ["Poppins", "sans-serif"],
        heading: ["Ubuntu", "sans-serif"],
      },
      fontSize: {
        titleNormal: ["1.5rem", { lineHeight: "1.2" }],
        titleSmall: ["1rem", { lineHeight: "1.2" }],
        subText: ["0.8rem", { lineHeight: "1.2" }],
        readText: ["1rem", { lineHeight: "1.5" }],
        titleSwap: ["0.8rem", { lineHeight: "1.2" }],
        label: [".813rem", { lineHeight: "1.2" }],
      },
      colors: {
        q_primary: {
          100: "hsla(228, 56%, 35%, 1)",
        },
        q_secondary: "hsla(342, 78%, 66%, 100)",
        q_tertiairy: "hsla(29, 100%, 65%, 100)",
        q_light: "hsla(222, 40%, 60%, 100)",
        q_bright: "hsla(0, 0%, 94%, 100)",
        q_dark: {
          5: "hsla(0, 0%, 90%, 100)",
          10: "hsla(0, 0%, 75%, 100)",
          50: "hsla(0, 0%, 54%, 100)",
          100: "hsla(210, 60%, 2%, 100)",
        },
      },
      height: {
        q_modalH: "35rem",
      },
      width: {
        q_book: "4.5rem",
        q_border: "1rem",
      },
      spacing: {
        base: "1.5rem",
        xxs: ".6rem",
        xs: "1rem",
        s: "1.25rem",
        m: "1.875rem",
        l: "3.75rem",
      },
      borderRadius: {
        q_s: "0.5rem",
        q_nav: "3rem",
        q_modal: "3rem",
      },
      boxShadow: {
        card: "-2px 2px 4px 0",
      },
    },
  },
  plugins: [],
};
