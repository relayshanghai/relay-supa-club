import { getUserSession } from './../analytics';
import { sendSlackMessage } from '.';
import type { SlackMessage } from '.';
import { ALTERT_INCOMING_WEBHOOK_URL } from './constants';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { DatabaseWithCustomTypes } from 'types';
import type { ServerContext } from '../iqdata';

const time = new Date().toISOString();

export const logRateLimitError = async (action: string, context: ServerContext) => {
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>(context);
    const { user_id, company_id, fullname, email } = await getUserSession(supabase)();
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
                ],
            },
        ],
    };

    ALTERT_INCOMING_WEBHOOK_URL && (await sendSlackMessage(ALTERT_INCOMING_WEBHOOK_URL, reqBody));
};

export const logDailyTokensError = async (action: string, context: ServerContext) => {
    const supabase = createServerSupabaseClient<DatabaseWithCustomTypes>({ req: context.req, res: context.res });
    const { user_id, company_id, fullname, email } = await getUserSession(supabase)();

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
                ],
            },
        ],
    };

    ALTERT_INCOMING_WEBHOOK_URL && (await sendSlackMessage(ALTERT_INCOMING_WEBHOOK_URL, reqBody));
};
