import cocomelon from '../../src/mocks/api/creators/report/cocomelon.json';
import defaultLandingPageInfluencerSearch from '../../src/mocks/api/influencer-search/indexDefaultSearch.json';
import influencerSearch from '../../src/mocks/api/influencer-search/searchByInfluencerGRTR.json';
import keywordSearch from '../../src/mocks/api/influencer-search/keywordSearchAlligators.json';
import keywordSearchMonkeys from '../../src/mocks/api/influencer-search/keywordSearchMonkeys.json';

import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';
import type { InfluencerPostRequest } from 'pages/api/influencer-search';
import type { UsagesDBInsert } from 'src/utils/api/db';
import { ulid } from 'ulid';
export { cocomelon, defaultLandingPageInfluencerSearch };

export const cocomelonId = cocomelon.user_profile.user_id;

const now = new Date();
const twoMonthsAgo = new Date(now.getUTCFullYear(), now.getUTCMonth() - 2, now.getUTCDate());
const oneMonthFromNow = new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate());

const resetUsages = (supabase: SupabaseClient<DatabaseWithCustomTypes>) => {
    supabase.from('usages').delete().neq('created_at', new Date(0).toISOString());
};

export const setupIntercepts = () => {
    const supabaseUrl = Cypress.env('NEXT_PUBLIC_SUPABASE_URL') || '';
    if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL not set');
    const supabaseServiceKey = Cypress.env('SUPABASE_SERVICE_KEY') || '';
    if (!supabaseServiceKey) throw new Error('SUPABASE_SERVICE_KEY not set');

    const supabase = createClient<DatabaseWithCustomTypes>(supabaseUrl, supabaseServiceKey);
    resetUsages(supabase);
    // IQData intercepts
    cy.intercept('/api/creators/report*', (req) => {
        req.reply({ body: cocomelon });
    });
    cy.intercept('/api/influencer-search*', (req) => {
        const body: InfluencerPostRequest = req.body;
        const justNow = new Date(); // lets do 18 hours ago to be safe if the test is running in another timezone
        const eighteenHours = 18 * 60 * 60 * 1000;
        justNow.setTime(now.getTime() - eighteenHours);
        const usage: UsagesDBInsert = {
            company_id: body.company_id,
            user_id: body.user_id,
            type: 'search',
            item_id: ulid(),
            created_at: justNow.toISOString(),
        };
        if (body.username === 'GRTR') {
            return supabase
                .from('usages')
                .insert(usage)
                .then(() => {
                    req.reply({
                        body: influencerSearch,
                    });
                });
        } else if (body.tags && body.tags[0]?.tag === 'alligators') {
            return supabase
                .from('usages')
                .insert(usage)
                .then(() => {
                    req.reply({
                        body: keywordSearch,
                    });
                });
        } else if (body.tags && body.tags[0]?.tag === 'monkeys') {
            return supabase
                .from('usages')
                .insert(usage)
                .then(() => {
                    req.reply({
                        body: keywordSearchMonkeys,
                    });
                });
        } else {
            return req.reply({
                body: defaultLandingPageInfluencerSearch,
            });
        }
    });
    cy.intercept('/api/influencer-search/topics*', (req) => {
        const body = req.body;
        if (body.term === 'alligators') {
            req.reply({
                body: {
                    success: true,
                    data: [
                        { tag: 'alligator', value: 'alligator' },
                        { tag: 'alligators', value: 'alligators' },
                        { tag: 'alligator_attack', value: 'alligator attack' },
                    ],
                },
                delay: 1000,
            });
        } else if (body.term === 'monkeys') {
            req.reply({
                body: {
                    data: [
                        { tag: 'monkeys', value: 'monkeys' },
                        { tag: 'arctic_monkeys', value: 'arctic monkeys' },
                        { tag: 'five_little_monkeys', value: 'five little monkeys' },
                        { tag: 'funny_monkeys', value: 'funny monkeys' },
                        { tag: 'monkeys_jumping_on_the_bed', value: 'monkeys jumping on the bed' },
                    ],
                    success: true,
                },
                delay: 1000,
            });
        } else {
            req.reply({
                body: {
                    success: true,
                    data: [],
                },
            });
        }
    });
    cy.intercept('/api/influencer-search/locations*', {
        body: [],
    });
    // Google Sheets API intercept
    cy.intercept('/api/recommended-influencers*', {
        body: ['youtub/UCbCmjCuTUZos6Inko4u57UQ'], // cocomelon
    });

    // stripe stuff
    cy.intercept('/api/subscriptions*', (req) => {
        req.reply({
            body: {
                name: 'DIY',
                interval: 'annually',
                current_period_end: oneMonthFromNow.getTime() / 1000,
                current_period_start: twoMonthsAgo.getTime() / 1000,
                status: 'active',
            },
        });
    });
    cy.intercept('/api/subscriptions/payment-method*', {
        body: [
            {
                id: 'pm_1234',
                object: 'payment_method',
                billing_details: {
                    address: { city: null, country: 'US', line1: null, line2: null, postal_code: '12345', state: null },
                },
                card: {
                    brand: 'visa',
                    checks: {
                        address_line1_check: null,
                        address_postal_code_check: 'unchecked',
                        cvc_check: 'unchecked',
                    },
                    country: 'US',
                    exp_month: 1,
                    exp_year: 2027,
                    fingerprint: '1234',
                    funding: 'credit',
                    generated_from: null,
                    last4: '1234',
                    networks: { available: ['visa'], preferred: null },
                    three_d_secure_usage: { supported: true },
                    wallet: null,
                },
                created: 1676267850,
                customer: 'cus_1234',
                livemode: true,
                metadata: {},
                type: 'card',
            },
        ],
    });
    cy.intercept('/api/subscriptions/prices', {
        body: {
            diy: {
                currency: 'usd',
                prices: {
                    monthly: '150.00',
                    quarterly: '297.00',
                    annually: '1068.00',
                },
                profiles: '200',
                searches: '2500',
                priceIds: {
                    monthly: 'price_1LwffoF5PN4woVWob7yJToHj',
                    quarterly: 'price_1LwffoF5PN4woVWoyRKbIMNh',
                    annually: 'price_1LwffoF5PN4woVWoduBnXnJ8',
                },
            },
            diyMax: {
                currency: 'usd',
                prices: {
                    monthly: '270.00',
                    quarterly: '660.00',
                    annually: '2388.00',
                },
                profiles: '450',
                searches: '5000',
                priceIds: {
                    monthly: 'price_1LwfcmF5PN4woVWoDElUtab4',
                    quarterly: 'price_1LwfcnF5PN4woVWoHVSSEvWJ',
                    annually: 'price_1LwfcnF5PN4woVWolz3tTxzc',
                },
            },
        },
    });
};

export const addPostIntercept = () => {
    const supabaseUrl = Cypress.env('NEXT_PUBLIC_SUPABASE_URL') || '';
    if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL not set');
    const supabaseServiceKey = Cypress.env('SUPABASE_SERVICE_KEY') || '';
    if (!supabaseServiceKey) throw new Error('SUPABASE_SERVICE_KEY not set');

    const supabase = createClient<DatabaseWithCustomTypes>(supabaseUrl, supabaseServiceKey);
    const mockPostData = {
        title: 'initial post title',
        postedDate: new Date('2021-09-01').toISOString(),
        id: 'a4bfe75f-91d3-42d6-af9e-93d0265b7c34',
        url: 'https://www.youtube.com/watch?v=123',
    };

    cy.intercept('POST', '/api/influencer/posts', async (req) => {
        const { data: campaign } = await supabase
            .from('campaigns')
            .select('*')
            .eq('name', 'Beauty for All Skin Tones')
            .single();
        const campaign_id = campaign?.id || '';
        const postData = {
            campaign_id,
            created_at: null,
            deleted_at: null,
            description: null,
            id: 'a4bfe75f-91d3-42d6-af9e-93d0265b7c34',
            influencer_social_profile_id: null,
            is_reusable: false,
            platform: 'youtube',
            posted_date: null,
            preview_url: null,
            publish_date: null,
            title: null,
            type: 'video',
            updated_at: null,
            url: mockPostData.url,
        };

        const updateData = {
            id: mockPostData.id,
            likes_total: 1000,
            comments_total: 1000,
            views_total: 1000,
            updated_at: new Date().toISOString(),
            campaign_id,
            post_id: postData.id,
        };

        await supabase.from('influencer_posts').insert(postData).single();

        await supabase.from('posts_performance').insert(updateData).eq('id', updateData.id).single();

        req.reply({ body: { successful: [mockPostData], failed: [] } });
    });
};
