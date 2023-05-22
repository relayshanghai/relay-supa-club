import { rest, setupWorker } from 'msw';

import tSeries from './api/creators/report/tSeries.json';

import defaultLandingPageInfluencerSearch from './api/influencer-search/indexDefaultSearch.json';

import jimTestCampaign from './supabase/campaigns/jimTestCampaign.json';
import amyTestCampaign from './supabase/campaigns/amyTestCampaign.json';
import newEmptyCampaign from './supabase/campaigns/newEmptyCampaign.json';
import archivedCampaign from './supabase/campaigns/archivedCampaign.json';

import campaignCreatorsJim from './supabase/campaign_creators/campaignCreatorsJimCampaign.json';
import amyCampaignCreators from './supabase/campaign_creators/campaignCreatorsAmyCampaign.json';
// if in the future we want to use the browser-based msw outside of cypress, we'll need to change this
export const APP_URL_CYPRESS = 'http://localhost:8080';
export const SUPABASE_URL_CYPRESS = 'http://localhost:54321/rest/v1';
const campaigns = [jimTestCampaign, amyTestCampaign, newEmptyCampaign, archivedCampaign];
const frontendHandlers = [
    rest.get(`${APP_URL_CYPRESS}/api/creators/report`, (req, res, ctx) => {
        return res(ctx.delay(1000), ctx.json(tSeries));
    }),
    rest.get(`${SUPABASE_URL_CYPRESS}/campaign_creators`, (req, res, ctx) => {
        // select query example `select=*&campaign_id=eq.2fefe314-b457-4812-95a5-9d9d73e2eb0d`
        const campaign_id = req.url.searchParams.get('campaign_id')?.split('.')[1];
        if (campaign_id && campaign_id === amyTestCampaign.id) {
            return res(ctx.json(amyCampaignCreators));
        }
        return res(ctx.json(campaignCreatorsJim));
    }),
    rest.get(`${SUPABASE_URL_CYPRESS}/campaigns`, (req, res, ctx) => {
        return res(ctx.json(campaigns));
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
