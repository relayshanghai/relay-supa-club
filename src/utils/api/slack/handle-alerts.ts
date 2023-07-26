import { getUserSession } from './../analytics';
import type { NextApiRequest, NextApiResponse } from 'next';
import { sendSlackMessage } from '.';
import type { SlackMessage } from '.';
import { ALTERT_INCOMING_WEBHOOK_URL } from './constants';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { DatabaseWithCustomTypes } from 'types';

const time = new Date().toISOString();

export const logRateLimitError = async (action: string, context: { req: NextApiRequest; res: NextApiResponse }) => {
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(context);
    const { user_id, company_id } = await getUserSession(supabase)();
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
                        text: `*Action:*\n\`${action}\``,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Time:*\n${time}`,
                    },
                ],
            },
        ],
    };

    ALTERT_INCOMING_WEBHOOK_URL && (await sendSlackMessage(ALTERT_INCOMING_WEBHOOK_URL, reqBody));
};

export const logDailyTokensError = async (action: string, context: { req: NextApiRequest; res: NextApiResponse }) => {
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(context);
    const { user_id, company_id } = await getUserSession(supabase)();

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
                        text: `*Action:*\n\`${action}\``,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Time:*\n${time}`,
                    },
                ],
            },
        ],
    };

    ALTERT_INCOMING_WEBHOOK_URL && (await sendSlackMessage(ALTERT_INCOMING_WEBHOOK_URL, reqBody));
};
