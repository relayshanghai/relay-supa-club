/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');
const nextJest = require('next/jest');
dotenv.config({ path: './.env.local' });
// @ts-ignore
const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/cypress/', '<rootDir>/node_modules/'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', '<rootDir>'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testMatch: ['**/*.test.ts'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
