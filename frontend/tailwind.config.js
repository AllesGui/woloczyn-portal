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
                    background: '#172229', // Requested background
                    surface: '#1E2A33',    // Surface mapped to new background
                    border: '#2A3742',     // Subtle border
                    silver: '#7D7E80',     // Requested text color
                    accent: '#A0A1A3',     // Slightly lighter for interaction highlights
                    gold: '#c9a15b',       
                }
            },
            fontFamily: {
                sans: ['"Century Gothic"', 'Futura', 'sans-serif'],
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(125, 126, 128, 0.2)' },
                    '100%': { boxShadow: '0 0 20px rgba(125, 126, 128, 0.6)' }
                }
            }
        },
    },
    plugins: [],
}
