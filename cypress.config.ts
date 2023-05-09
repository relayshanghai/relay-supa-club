import { defineConfig } from 'cypress';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default defineConfig({
    video: false,
    e2e: {
        setupNodeEvents(_on, config) {
            // implement node event listeners here
            config.env = {
                TEST_USER_EMAIL_COMPANY_OWNER: 'william.edward.douglas@blue-moonlight-stream.com',
                TEST_USER_EMAIL_COMPANY_TEAMMATE: 'william.edward.douglas@blue-moonlight-stream.com',
                TEST_USER_EMAIL_RELAY_EMPLOYEE: 'jacob@relay.club',
                TEST_USER_PASSWORD: 'password123!',
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
