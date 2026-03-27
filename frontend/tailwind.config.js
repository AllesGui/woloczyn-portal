/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    background: '#0F141A', // Deep slate navy
                    surface: '#1E232A',    // Slightly lighter for cards
                    border: '#2A303C',     // Subtle border
                    silver: '#A5ACB8',     // Silver text
                    accent: '#E2E8F0',     // Bright silver/white for highlights
                    gold: '#c9a15b',       // Keep a touch of gold for extreme prominence if needed
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(165, 172, 184, 0.2)' },
                    '100%': { boxShadow: '0 0 20px rgba(165, 172, 184, 0.6)' }
                }
            }
        },
    },
    plugins: [],
}
