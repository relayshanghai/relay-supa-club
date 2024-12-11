import { getUserSession } from './../analytics';
import { sendSlackMessage } from '.';
import type { SlackMessage } from '.';
import { ALERT_BREVO_WEBHOOK_URL, ALERT_INCOMING_WEBHOOK_URL } from './constants';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { DatabaseWithCustomTypes } from 'types';
import type { ServerContext } from '../iqdata';
import type { BrevoEvent } from 'pages/api/brevo/webhook';

const time = new Date().toISOString();

export const logRateLimitError = async (action: string, context: ServerContext, errorTag: string) => {
    return; // disable it for a while
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(context);
    const { user_id, company_id, fullname, email } = await getUserSession(supabase)();
    const queryParams = new URLSearchParams({
        project: '4504887346855936',
        query: `is:unresolved error_code_tag:${errorTag}`,
        referrer: 'issue-list',
        statsPeriod: '14d',
    });
    const reqBody: SlackMessage = {
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: ':octagonal_sign: Rate Limit Exceeded',
                    emoji: true,
                },
            },
            {
                type: 'section',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*Company ID:*\n${company_id}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*User ID:*\n${user_id}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Name:*\n${fullname}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Email ID:*\n${email}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Action:*\n\`${action}\``,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Time:*\n${time}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Error Tag:*\n${errorTag}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `<https://relayclub-wn.sentry.io/issues/?${queryParams}|Sentry Link>`,
                    },
                ],
            },
        ],
    };

    if (reqBody.blocks[1].fields && context.metadata) {
        const metadata = JSON.stringify(context.metadata);

        reqBody.blocks[1].fields.push({
            type: 'mrkdwn',
            text: `*Extra Context:*\n\`${metadata}\``,
        });
    }

    ALERT_INCOMING_WEBHOOK_URL && (await sendSlackMessage(ALERT_INCOMING_WEBHOOK_URL, reqBody));
};

export const logDailyTokensError = async (action: string, context: ServerContext, errorTag: string) => {
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(context);
    const { user_id, company_id, fullname, email } = await getUserSession(supabase)();
    const queryParams = new URLSearchParams({
        project: '4504887346855936',
        query: `is:unresolved error_code_tag:${errorTag}`,
        referrer: 'issue-list',
        statsPeriod: '14d',
    });
    const reqBody: SlackMessage = {
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: ':octagonal_sign: Daily Tokens Exceeded',
                    emoji: true,
                },
            },
            {
                type: 'section',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*Company ID:*\n${company_id}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*User ID:*\n${user_id}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Name:*\n${fullname}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Email ID:*\n${email}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Action:*\n\`${action}\``,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Time:*\n${time}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Error Tag:*\n${errorTag}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `<https://relayclub-wn.sentry.io/issues/?${queryParams}|Sentry Link>`,
                    },
                ],
            },
        ],
    };

    if (reqBody.blocks[1].fields && context.metadata) {
        const metadata = JSON.stringify(context.metadata);

        reqBody.blocks[1].fields.push({
            type: 'mrkdwn',
            text: `*Extra Context:*\n\`${metadata}\``,
        });
    }

    ALERT_INCOMING_WEBHOOK_URL && (await sendSlackMessage(ALERT_INCOMING_WEBHOOK_URL, reqBody));
};

export const logBrevoErrors = async (action: string, context: BrevoEvent) => {
    const reqBody: SlackMessage = {
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: `:octagonal_sign: Brevo Alert ${action}`,
                    emoji: true,
                },
            },
            {
                type: 'section',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*ID*: \`${context.id}\``,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Recipient*: \`${context.email}\``,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Subject*: \`${context.subject}\``,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Event*: \`${context.event}\``,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Time*: \`${context.date}\``,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Tags*: \`${context.tags && context.tags.join(', ')}\``,
                    },
                ],
            },
        ],
    };

    ALERT_BREVO_WEBHOOK_URL && (await sendSlackMessage(ALERT_BREVO_WEBHOOK_URL, reqBody));
};
