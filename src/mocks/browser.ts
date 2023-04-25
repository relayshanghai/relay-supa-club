import { rest, setupWorker } from 'msw';

import tSeries from './api/creators/report/tSeries.json';
import jimTestCampaign from './api/campaigns/jimTestCampaign.json';
import amyTestCampaign from './api/campaigns/amyTestCampaign.json';
import newEmptyCampaign from './api/campaigns/newEmptyCampaign.json';
import archivedCampaign from './api/campaigns/archivedCampaign.json';
import defaultLandingPageInfluencerSearch from './api/influencer-search/indexDefaultSearch.json';

// if in the future we want to use the browser-based msw outside of cypress, we'll need to change this
export const APP_URL_CYPRESS = 'http://localhost:8080';
export const SUPABASE_URL_CYPRESS = 'http://localhost:54321/rest/v1';

const frontendHandlers = [
    rest.get(`${APP_URL_CYPRESS}/api/creators/report`, (req, res, ctx) => {
        return res(ctx.delay(1000), ctx.json(tSeries));
    }),
    rest.get(`${APP_URL_CYPRESS}/api/campaigns`, (req, res, ctx) => {
        const id = req.url.searchParams.get('id');
        if (id === 'jim') {
            return res(ctx.json([jimTestCampaign]));
        } else if (typeof id === 'string') {
            return res(ctx.json([amyTestCampaign, newEmptyCampaign, archivedCampaign]));
        }

        return res(ctx.json([jimTestCampaign, amyTestCampaign]));
    }),
    rest.get(`${SUPABASE_URL_CYPRESS}/campaigns`, (req, res, ctx) => {
        return res(ctx.json([amyTestCampaign, newEmptyCampaign, archivedCampaign]));
    }),
    rest.post(`${APP_URL_CYPRESS}/api/influencer-search`, (req, res, ctx) => {
        return res(ctx.json(defaultLandingPageInfluencerSearch));
    }),
    rest.post(`${APP_URL_CYPRESS}/api/influencer-search/topics`, async (req, res, ctx) => {
        const { term } = await req.json();

        return res(ctx.json({ success: true, data: [{ tag: term, value: term }] }));
    }),
    rest.post(`${APP_URL_CYPRESS}/api/influencer-search/locations`, async (req, res, ctx) => {
        return res(ctx.json([]));
    }),
];
/** for use in the browser */
export const worker = setupWorker(...frontendHandlers);
