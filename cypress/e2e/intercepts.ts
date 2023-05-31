import cocomelon from '../../src/mocks/api/creators/report/cocomelon.json';
import defaultLandingPageInfluencerSearch from '../../src/mocks/api/influencer-search/indexDefaultSearch.json';
import influencerSearch from '../../src/mocks/api/influencer-search/searchByInfluencerGRTR.json';
import keywordSearch from '../../src/mocks/api/influencer-search/keywordSearchAlligators.json';
import { createClient } from '@supabase/supabase-js';
import type { DatabaseWithCustomTypes } from 'types';
export { cocomelon, defaultLandingPageInfluencerSearch };

export const cocomelonId = cocomelon.user_profile.user_id;
export const setupIntercepts = () => {
    // IQData intercepts
    cy.intercept('/api/creators/report*', (req) => {
        req.reply({ body: cocomelon });
    });
    cy.intercept('/api/influencer-search*', (req) => {
        if (req.body.username === 'GRTR') {
            req.reply({
                body: influencerSearch,
            });
        } else if (req.body.tags && req.body.tags[0]?.value === 'alligators') {
            req.reply({
                body: keywordSearch,
            });
        } else {
            req.reply({
                body: defaultLandingPageInfluencerSearch,
            });
        }
    });
    cy.intercept('/api/influencer-search/topics*', {
        body: {
            success: true,
            data: [
                { tag: 'alligator', value: 'alligator' },
                { tag: 'alligators', value: 'alligators' },
                { tag: 'alligator_attack', value: 'alligator attack' },
            ],
        },
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
                current_period_end: 1713325331,
                current_period_start: 1681702931,
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
};

export const addPostIntercept = () => {
    const mockPostData = {
        title: 'initial post title',
        postedDate: new Date('2021-09-01').toISOString(),
        id: 'a4bfe75f-91d3-42d6-af9e-93d0265b7c34',
        url: 'https://www.youtube.com/watch?v=123',
    };
    const supabaseUrl = Cypress.env('NEXT_PUBLIC_SUPABASE_URL') || '';
    if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL not set');
    const supabaseServiceKey = Cypress.env('SUPABASE_SERVICE_KEY') || '';
    if (!supabaseServiceKey) throw new Error('SUPABASE_SERVICE_KEY not set');

    const supabase = createClient<DatabaseWithCustomTypes>(supabaseUrl, supabaseServiceKey);

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
