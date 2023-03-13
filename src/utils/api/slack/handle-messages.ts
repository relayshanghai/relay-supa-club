import type { NextApiRequest } from 'next/types';

//Send a message to the slack channel when a new customer signs up
export const handleNewProfileMessage = async (req: NextApiRequest, URL: string) => {
    const { first_name: firstName, last_name: lastName, email } = req.body.record;
    if (req.body.table === 'profiles' && req.body.type === 'INSERT') {
        const reqBody = {
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: ':office_worker: A new customer has signed up:',
                        emoji: true,
                    },
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `*Name:*\n${firstName} ${lastName}`,
                        },
                        {
                            type: 'mrkdwn',
                            text: `*Email:*\n${email}`,
                        },
                    ],
                },
            ],
        };
        await fetch(URL, {
            method: 'POST',
            body: JSON.stringify(reqBody),
        });
    }
};

//Send a message to the slack channel when a new customer signs up
export const handleNewCompanyMessage = async (req: NextApiRequest, URL: string) => {
    const { name: companyName, website, subscription_status: subscriptionStatus } = req.body.record;
    if (req.body.table === 'companies' && req.body.type === 'INSERT') {
        const reqBody = {
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: ':office: A new company has been created:',
                        emoji: true,
                    },
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `*Name:*\n${companyName}`,
                        },
                        {
                            type: 'mrkdwn',
                            text: `*Website:*\n${website}`,
                        },
                        {
                            type: 'mrkdwn',
                            text: `*Subscription Status:*\n${subscriptionStatus}`,
                        },
                    ],
                },
            ],
        };
        await fetch(URL, {
            method: 'POST',
            body: JSON.stringify(reqBody),
        });
    }
};

//Send a message to the slack channel when a company has updated its subscription status
export const handleCompanyUpdateMessage = async (req: NextApiRequest, URL: string) => {
    const { name: companyName, subscription_status: subscriptionStatus } = req.body.record;
    const { subscription_status: oldSubscriptionStatus } = req.body.old_record;
    if (
        req.body.table === 'companies' &&
        req.body.type === 'UPDATE' &&
        oldSubscriptionStatus !== subscriptionStatus
    ) {
        const reqBody = {
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: ':pencil2: A company has been updated:',
                        emoji: true,
                    },
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `*${companyName}* has updated its Subscription`,
                        },
                    ],
                },
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `From:\n*${oldSubscriptionStatus}*`,
                        },
                        {
                            type: 'mrkdwn',
                            text: `To:\n*${subscriptionStatus}*`,
                        },
                    ],
                },
            ],
        };
        await fetch(URL, {
            method: 'POST',
            body: JSON.stringify(reqBody),
        });
    }
};
