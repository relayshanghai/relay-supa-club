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
                TEST_USER_EMAIL_COMPANY_TEAMMATE: 'christopher.david.thompson@blue-moonlight-stream.com',
                TEST_USER_EMAIL_RELAY_EMPLOYEE: 'jacob@relay.club',
                TEST_USER_EMAIL_EXPIRED: 'expired_user@expired.com',
                TEST_USER_PASSWORD: 'password123!',
                ...process.env,
            };
            return config;
        },
        viewportWidth: 1536,
        viewportHeight: 960,
        baseUrl: 'http://localhost:3000',
        chromeWebSecurity: false,
        watchForFileChanges: false,
    },

    component: {
        devServer: {
            framework: 'next',
            bundler: 'webpack',
        },
        viewportWidth: 1536,
        viewportHeight: 960,
        watchForFileChanges: false,
    },
});
