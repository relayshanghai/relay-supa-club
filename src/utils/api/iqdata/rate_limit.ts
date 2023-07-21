const URL = process.env.RATE_LIMIT_HOOK;

export const logRateLimitError = async (accountInfo: { company_id: string; user_id: string }, action: string) => {
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
                        text: `*Company ID:*\n${accountInfo.company_id}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*User ID:*\n${accountInfo.user_id}`,
                    },
                    {
                        type: 'mrkdwn',
                        text: `*action:*\n${action}`,
                    },
                ],
            },
        ],
    };

    URL &&
        (await fetch(URL, {
            method: 'POST',
            body: JSON.stringify(reqBody),
        }));
};
