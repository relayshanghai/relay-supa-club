import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { IQDATA_URL } from 'src/utils/api/iqdata';
import reportsNewWWE from './iqdata/reports-newWWE.json';

const backendHandlers = [
    rest.get(`${IQDATA_URL}reports/new`, (req, res, ctx) => {
        return res(ctx.json(reportsNewWWE));
    }),
];

/** intercepts requests made by the next.js backend */
export const server = setupServer(...backendHandlers);
