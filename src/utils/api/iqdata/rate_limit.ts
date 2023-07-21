const URL = process.env.RATE_LIMIT_HOOK;

export const logRateLimitError = async () => {
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
                text: {
                    type: 'mrkdwn',
                    text: `*Error:*\nRate Limit Exceeded`,
                },
            },
        ],
    };

    URL &&
        (await fetch(URL, {
            method: 'POST',
            body: JSON.stringify(reqBody),
        }));
};
