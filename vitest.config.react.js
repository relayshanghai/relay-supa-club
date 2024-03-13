import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import dotenv from 'dotenv';
import react from '@vitejs/plugin-react-swc';

dotenv.config({ path: './.env.local' });

export default defineConfig({
    plugins: [
        // Vite plugin        
        react(),
    ], // need this to be able to test hooks which are jsx/tsx files
    test: {
        global: true,
        setupFiles: ['./test-setup.js'],
        include: ['**/*.test.tsx'], // run only tests with .test.ts extension,
        environment: 'jsdom',
    },
    deps: {
        moduleDirectories: ['node_modules'],
    },
    resolve: {
        alias: {
            src: resolve(__dirname, './src'),
            shadcn: resolve(__dirname, './shadcn'),
        },
    },
});
