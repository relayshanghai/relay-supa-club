/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}', './styles/**/*.css'],

    theme: {
        extend: {
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
                sans: ['Poppins', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#F5F3FF',
                    100: '#E9E8FC',
                    200: '#DDD6FE',
                    300: '#C4B5FD',
                    400: '#A78BFA',
                    500: '#8B5CF6',
                    600: '#7C3AED',
                    700: '#6D28D9',
                    800: '#5B21B6',
                    900: '#4C1D95',
                },
                secondary: {
                    50: '#f8faff',
                    100: '#F4F7FF',
                    500: '#599CC9',
                },
                tertiary: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                },
                'relay-purple': '#6B65AD',
            },
            backgroundImage: {
                boostbotbackground:
                    'var(--boostbot-gradient, linear-gradient(165deg, #EE46BC 0%, #7839EE 50%, #43CBFF 100%));',
            },
            animation: {
                float: 'float 2s ease-in-out infinite',
                'spin-burst': 'spin-burst 4s cubic-bezier(0.3, 0.5, 0, 1) infinite',
                'fade-in-from-left': 'fade-in-from-left 0.7s ease-in-out',
                'fade-in-from-top': 'fade-in-from-top 0.7s ease-in-out',
                'pulse-prominent': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(5)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                'spin-burst': {
                    '0%, 80%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                'fade-in-from-left': {
                    '0%': { transform: 'translateX(-10px)', opacity: '0' },
                    '100%': { transform: 'translateX(0px)', opacity: '1' },
                },
                'fade-in-from-top': {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0px)', opacity: '1' },
                },
                'pulse-prominent': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.2' },
                },
            },
        },
    },
    variants: {
        extend: {
            fontFamily: ['hover', 'focus'],
        },
    },
    plugins: [require('@tailwindcss/forms')],
};
