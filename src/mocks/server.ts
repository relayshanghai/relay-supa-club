import { rest } from 'msw';
import { setupServer } from 'msw/node';

const backendHandlers = [
    rest.get(`iqdata...`, (req, res, ctx) => {
        return res(ctx.json({ hello: 'hello' }));
    }),
];

/** intercepts requests made by the next.js backend */
export const server = setupServer(...backendHandlers);
