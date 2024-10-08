/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    mode: 'jit',
    content: [
        './pages/**/*.{js,jsx,ts,tsx}',
        './shadcn/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{js,ts,jsx,tsx}',
        './styles/**/*.css',
    ],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
                sans: ['Poppins', 'sans-serif'],
            },
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: '#7C3AED',
                    foreground: '#F4F8FF',
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
                    DEFAULT: '#599CC9',
                    foreground: '#F4F8FF',
                    50: '#f8faff',
                    100: '#F4F7FF',
                    500: '#599CC9',
                },
                accent: {
                    DEFAULT: '#F53D86',
                    foreground: '#FFFFFF',
                    50: '#FF7EBE',
                    100: '#FF62A8',
                    200: '#FF4591',
                    300: '#FF297B',
                    400: '#FF0D65',
                    500: '#F53D86',
                    600: '#DB356F',
                    700: '#C12459',
                    800: '#A11343',
                    900: '#87002C',
                },
                navy: {
                    DEFAULT: '#2970FF',
                    foreground: '#FFFFFF',
                    50: '#E6F0FF',
                    100: '#B3D1FF',
                    200: '#80B3FF',
                    300: '#4D94FF',
                    400: '#1A76FF',
                    500: '#2970FF',
                    600: '#1E62E6',
                    700: '#1A55C2',
                    800: '#144699',
                    900: '#103974',
                },
                tertiary: {
                    DEFAULT: '#4b5563',
                    foreground: '#F4F8FF',
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
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                'relay-purple': '#6B65AD',
            },
            backgroundImage: {
                boostbotbackground:
                    'var(--boostbot-gradient, linear-gradient(165deg, #EE46BC 0%, #7839EE 50%, #43CBFF 100%));',
                carouselbackground:
                    'var(--carousel-gradient, linear-gradient(135deg, #EE46BC 0%, #7839EE 50%, #43CBFF 100%));',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: 0 },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: 0 },
                },
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
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                float: 'float 2s ease-in-out infinite',
                'spin-burst': 'spin-burst 4s cubic-bezier(0.3, 0.5, 0, 1) infinite',
                'fade-in-from-left': 'fade-in-from-left 0.7s ease-in-out',
                'fade-in-from-top': 'fade-in-from-top 0.7s ease-in-out',
                'pulse-prominent': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;',
            },
            variants: {
                extend: {
                    fontFamily: ['hover', 'focus'],
                },
            },
        },
    },
    plugins: [require('tailwindcss-animate'), require('@tailwindcss/forms')],
};
