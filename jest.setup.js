/* eslint-disable @typescript-eslint/no-var-requires */
const { server } = require('./src/mocks/server'); // we are just mocking backend with jest. for frontend components, use cypress tests and the frontend msw worker.

beforeAll(() => {
    // Enable the mocking in tests.
    server.listen({
        //onUnhandledRequest: 'error',
    });
});

afterEach(() => {
    // Reset any runtime handlers tests may use.
    server.resetHandlers();
});

afterAll(() => {
    // Clean up once the tests are done.
    server.close();
});
