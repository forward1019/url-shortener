/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            borderColor: {
                'border': 'var(--color-border)',
            },
            colors: {
                border: 'var(--color-border)',
                ring: 'var(--color-ring)',
                background: 'var(--color-background)',
                foreground: 'var(--color-foreground)',
            },
            outlineColor: {
                ring: 'var(--color-ring)',
            },
        },
    },
    plugins: [],
}
