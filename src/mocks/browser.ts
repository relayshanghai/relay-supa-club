import { context, response, rest, setupWorker } from 'msw';

import tSeries from './api/creators/report/tSeries.json';
// if in the future we want to use the browser-based msw outside of cypress, we'll need to change this
export const APP_URL_CYPRESS = 'http://localhost:8080';

const frontendHandlers = [
    rest.get(`${APP_URL_CYPRESS}/api/creators/report`, (req, res, ctx) => {
        return res(ctx.json(tSeries));
    }),

    rest.post(`${APP_URL_CYPRESS}/api/campaigns/add-creator`, (req, res, ctx) => {
        // Get json body from request
        let campaign_id = '';
        req.json().then((json) => {
            campaign_id = json.campaign_id;
        });

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(
                    res(
                        ctx.json({
                            id: 'creator1-newid',
                            created_at: '2023-02-12T03:01:51.468377+00:00',
                            status: 'to contact',
                            campaign_id: campaign_id,
                            updated_at: null,
                            relay_creator_id: null,
                            creator_model: null,
                            creator_token: null,
                            interested: null,
                            email_sent: null,
                            publication_date: null,
                            rate_cents: 0,
                            rate_currency: 'USD',
                            payment_details: null,
                            payment_status: "'unpaid'::text",
                            paid_amount_cents: 0,
                            paid_amount_currency: 'USD',
                            address: null,
                            sample_status: "'unsent'::text",
                            tracking_details: null,
                            reject_message: null,
                            brief_opened_by_creator: null,
                            need_support: null,
                            next_step: null,
                            avatar_url: '',
                            username: null,
                            fullname: 'Creator1 name',
                            link_url: 'https://www.youtube.com/channel/UCJQjhL019_F0nckUU88JAJA',
                            creator_id: 'UCJQjhL019_F0nckUU88JAJA',
                            platform: 'youtube',
                            added_by_id: '9bfbc685-2881-47ac-b75a-c7e210f187f2',
                        }),
                    ),
                );
            }, 5000);
        });
    }),

    rest.delete(`${APP_URL_CYPRESS}/api/campaigns/delete-creator`, (req, res, ctx) => {
        return res(ctx.delay(100000), ctx.json(null));
    }),
];
/** for use in the browser */
export const worker = setupWorker(...frontendHandlers);
