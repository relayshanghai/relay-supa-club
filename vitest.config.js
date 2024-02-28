import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import dotenv from 'dotenv';
import react from '@vitejs/plugin-react';
import swc from 'unplugin-swc';

dotenv.config({ path: './.env.local' });

export default defineConfig({
    plugins: [
        react(),
        // Vite plugin
        swc.vite(),
    ], // need this to be able to test hooks which are jsx/tsx files
    test: {
        setupFiles: ['./test-setup.js'],
        include: ['**/*.test.ts'], // run only tests with .test.ts extension,
        environment: 'node', // We are only using vitest for backend and node tests, not for components which we are using cypress component tests for
    },
    resolve: {
        alias: {
            src: resolve(__dirname, './src'),
        },
    },
});
