/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', '<rootDir>'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
