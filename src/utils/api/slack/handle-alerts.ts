import { sendSlackMessage } from '.';
import { alertIncomingWebhookURL, now } from './constants';

export const logRateLimitError = async (
    action: string,
    accountInfo?: { company_id?: string | null; user_id?: string | null },
) => {
    const reqBody = {
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: ':octagonal_sign: Rate limit error',
                    emoji: true,
                },
            },
            {
                type: 'section',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*Error:*\nRate Limit Exceeded`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Company ID:*\n${accountInfo?.company_id}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*User ID:*\n${accountInfo?.user_id}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Action:*\n\`${action}\``,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Time:*\n${now}`,
                    },
                ],
            },
        ],
    };

    alertIncomingWebhookURL && (await sendSlackMessage(alertIncomingWebhookURL, reqBody));
};

export const logDailyTokensError = async (
    action: string,
    accountInfo?: { company_id?: string | null; user_id?: string | null },
) => {
    const reqBody = {
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
                        text: `*Error:*\nDaily Tokens Exceeded`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Company ID:*\n${accountInfo?.company_id}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*User ID:*\n${accountInfo?.user_id}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Action:*\n\`${action}\``,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*Time:*\n${now}`,
                    },
                ],
            },
        ],
    };

    alertIncomingWebhookURL && (await sendSlackMessage(alertIncomingWebhookURL, reqBody));
};
