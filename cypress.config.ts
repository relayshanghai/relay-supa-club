import { defineConfig } from 'cypress';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

export default defineConfig({
    video: false,
    e2e: {
        setupNodeEvents(_on, config) {
            // implement node event listeners here
            config.env = {
                TEST_USER_EMAIL: process.env.TEST_USER_EMAIL,
                TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD,
                NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
            };
            return config;
        },
        viewportWidth: 1536,
        viewportHeight: 960,
        baseUrl: process.env.NEXT_PUBLIC_APP_URL,
    },

    component: {
        devServer: {
            framework: 'next',
            bundler: 'webpack',
        },
        viewportWidth: 1536,
        viewportHeight: 960,
    },
});
