import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "var(--primary)",
                secondary: "#00f0ff",
            },
            fontFamily: {
                sans: "var(--font-sans)",
                heading: "var(--font-heading)",
            },
        },
    },
    plugins: [],
};
export default config;
