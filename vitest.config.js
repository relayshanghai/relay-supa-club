import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import dotenv from 'dotenv';
import react from '@vitejs/plugin-react';

dotenv.config({ path: './.env.local' });

export default defineConfig({
    plugins: [react()], // need this to be able to test hooks which are jsx/tsx files
    test: {
        setupFiles: ['./test-setup.js'],
        include: ['**/*.test.ts'], // run only tests with .test.ts extension,
        environment: 'node', // We are only using vitest for backend and node tests, not for components which we are using cypress component tests for
        includeSource: ['src/utils/handler/decorators/api-decorator'], // include source files for coverage
    },
    resolve: {
        alias: {
            src: resolve(__dirname, './src'),
        },
    },
});
