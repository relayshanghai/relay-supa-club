import { rest, setupWorker } from 'msw';
// if in the future we want to use the browser-based msw outside of cypress, we'll need to change this
const APP_URL_CYPRESS = 'http://localhost:8080';

const frontendHandlers = [
    rest.get(`${APP_URL_CYPRESS}/api/creators/report`, (req, res, ctx) => {
        return res(ctx.json({ hello: 'hello' }));
    }),
];
/** for use in the browser */
export const worker = setupWorker(...frontendHandlers);
