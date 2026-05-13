import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f7f4ed",
        charcoal: "#1c1c1c",
        line: "#eceae4",
        muted: "#5f5f5d"
      },
      boxShadow: {
        insetButton:
          "rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px",
        focus: "rgba(0,0,0,0.1) 0px 4px 12px"
      }
    }
  },
  plugins: []
};

export default config;
