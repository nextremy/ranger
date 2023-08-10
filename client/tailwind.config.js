import headlessUI from "@headlessui/tailwindcss";
import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      current: "currentColor",
      transparent: "transparent",
      gray: colors.slate,
      red: colors.red,
      yellow: colors.yellow,
      green: colors.emerald,
      blue: colors.blue,
    },
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [headlessUI],
};
