import { rest, setupWorker } from 'msw';
import { mockProfile } from '../mocks/test-user';
import tSeries from './api/creators/report/tSeries.json';

import defaultLandingPageInfluencerSearch from './api/influencer-search/indexDefaultSearch';

import jimTestCampaign from './supabase/campaigns/jimTestCampaign.json';
import amyTestCampaign from './supabase/campaigns/amyTestCampaign.json';
import newEmptyCampaign from './supabase/campaigns/newEmptyCampaign.json';
import archivedCampaign from './supabase/campaigns/archivedCampaign.json';

import campaignCreatorsJim from './supabase/campaign_creators/campaignCreatorsJimCampaign.json';
import amyCampaignCreators from './supabase/campaign_creators/campaignCreatorsAmyCampaign.json';
import prices from './api/subscription/prices/prices.json';
import promoCodes from './api/subscription/promo-codes.json';

import sequenceInfluencers from './api/sequence/influencers/sequence-influencers-1';
import allSequencesByCompany from './supabase/sequences/all-sequences-by-company.json';

import templates from './api/email-engine/templates.json';
import templateVariablesBySequenceId from './supabase/template_variables/by-sequence-id';
import defaultSequence from './supabase/sequences/createDefaultSequence.json';

import defaultSocialProfile from './supabase/influencer_social_profile/default-social-profile.json';
import sophiaCampaignSocialProfiles from './supabase/influencer_social_profile/sophias-campaign.json';
import { flattenInfluencerData } from '../utils/api/boostbot/helper';
import { defaultTemplates } from 'src/hooks/use-sequence-steps';
import type { SequenceStepInsert } from 'src/utils/api/db';
import { v4 } from 'uuid';

// if in the future we want to use the browser-based msw outside of cypress, we'll need to change this
export const APP_URL_CYPRESS = 'http://localhost:8080';
export const SUPABASE_URL_CYPRESS = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1`;
export const campaigns = [jimTestCampaign, amyTestCampaign, newEmptyCampaign, archivedCampaign];
const frontendHandlers = [
    rest.get(`${APP_URL_CYPRESS}/api/creators/report`, (_req, res, ctx) => {
        return res(ctx.delay(1000), ctx.json(tSeries));
    }),
    rest.get(`${SUPABASE_URL_CYPRESS}/campaign_creators`, (req, res, ctx) => {
        // select query example `select=*&campaign_id=eq.2fefe314-b457-4812-95a5-9d9d73e2eb0d`
        const campaign_id = req.url.searchParams.get('campaign_id')?.split('.')[1];
        if (campaign_id && campaign_id === amyTestCampaign.id) {
            return res(ctx.json(amyCampaignCreators));
        }
        if (campaign_id && campaign_id === newEmptyCampaign.id) {
            return res(ctx.json([]));
        }
        return res(ctx.json(campaignCreatorsJim));
    }),
    rest.get(`${SUPABASE_URL_CYPRESS}/companies`, (_, res, ctx) => {
        return res(ctx.json(mockProfile.company));
    }),
    rest.get(`${SUPABASE_URL_CYPRESS}/campaigns`, (_req, res, ctx) => {
        return res(ctx.json(campaigns));
    }),
    rest.post(`${APP_URL_CYPRESS}/api/influencer-search`, (req, res, ctx) => {
        return res(ctx.json(flattenInfluencerData(defaultLandingPageInfluencerSearch)));
    }),
    rest.post(`${APP_URL_CYPRESS}/api/track`, (req, res, ctx) => {
        return res(ctx.json({ success: true }));
    }),
    rest.post(`${APP_URL_CYPRESS}/api/tracking`, (req, res, ctx) => {
        return res(ctx.json({ success: true }));
    }),
    rest.post(`${APP_URL_CYPRESS}/api/influencer-search/topics`, async (req, res, ctx) => {
        const { term } = await req.json();
        return res(ctx.json({ success: true, data: [{ tag: term, value: term }] }));
    }),
    rest.post(`${APP_URL_CYPRESS}/api/influencer-search/locations`, async (_req, res, ctx) => {
        return res(ctx.json([]));
    }),
    rest.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/list/images`, (_req, res, ctx) => {
        return res(ctx.json([]));
    }),
    rest.get(`${APP_URL_CYPRESS}/api/subscriptions/prices`, (_req, res, ctx) => {
        return res(ctx.json(prices));
    }),
    rest.get(`${APP_URL_CYPRESS}/api/subscriptions/promo-codes`, (_req, res, ctx) => {
        return res(ctx.json(promoCodes));
    }),
    rest.post(`${APP_URL_CYPRESS}/api/sequence/influencers`, (_req, res, ctx) => {
        return res(ctx.json(sequenceInfluencers));
    }),
    rest.post(`${APP_URL_CYPRESS}/sequence_influencers`, (req, res, ctx) => {
        const id = req.url.searchParams.get('id')?.split('eq.')[1];
        return res(ctx.json(sequenceInfluencers.find((x) => x.id === id)));
    }),
    rest.post(`${APP_URL_CYPRESS}/api/email-engine/templates`, (_req, res, ctx) => {
        return res(ctx.json(templates));
    }),
    rest.get(`${SUPABASE_URL_CYPRESS}/template_variables`, (_req, res, ctx) => {
        // for query like ?select=*&sequence_id=eq.b7ddd2a8-e114-4423-8cc6-30513c885f07
        return res(ctx.json(templateVariablesBySequenceId));
    }),
    rest.get(`${SUPABASE_URL_CYPRESS}/sequences`, (req, res, ctx) => {
        // select query example `select=*&id=eq.2fefe314-b457-4812-95a5-9d9d73e2eb0d`
        const id = req.url.searchParams.get('id')?.split('eq.')[1];
        const company_id = req.url.searchParams.get('company_id')?.split('eq.')[1];
        if (id) {
            return res(ctx.json(defaultSequence));
        } else if (company_id === mockProfile?.company_id) {
            return res(ctx.json(allSequencesByCompany));
        }
        return res(ctx.json(defaultSequence));
    }),
    rest.get(`${SUPABASE_URL_CYPRESS}/influencer_social_profiles`, (req, res, ctx) => {
        // select query example `select=*&id=eq.2fefe314-b457-4812-95a5-9d9d73e2eb0d`
        const id = req.url.searchParams.get('id')?.split('eq.')[1];
        if (id) {
            const foundProfile = sophiaCampaignSocialProfiles.find((profile) => profile.id === id);
            if (foundProfile) {
                return res(ctx.json(foundProfile));
            }
        }
        return res(ctx.json(defaultSocialProfile));
    }),
    rest.get(`${SUPABASE_URL_CYPRESS}/sequence_emails`, (req, res, ctx) => {
        return res(ctx.json([]));
    }),
    rest.get(`${SUPABASE_URL_CYPRESS}/sequence_steps`, (req, res, ctx) => {
        const sequence_id = req.url.searchParams.get('sequence_id')?.split('eq.')[1] ?? v4();
        const steps: SequenceStepInsert[] = defaultTemplates().map(({ name, id, waitTimeHours, stepNumber }) => ({
            name,
            sequence_id,
            template_id: id,
            wait_time_hours: waitTimeHours,
            step_number: stepNumber,
        }));
        return res(ctx.json(steps));
    }),
    rest.get('/_next/image', (req, res, ctx) => {
        return res(ctx.json({}));
    }),
];
/** for use in the browser */
export const worker = setupWorker(...frontendHandlers);
