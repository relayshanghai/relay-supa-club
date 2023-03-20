import { defineConfig } from 'cypress';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
            config.env = {
                TEST_USER_EMAIL: process.env.TEST_USER_EMAIL,
                TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD,
            };
            return config;
        },
        video: false,
        baseUrl: 'http://localhost:3000',
    },
});
