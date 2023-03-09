import { NextApiResponse, NextApiRequest } from 'next';
import httpCodes from 'src/constants/httpCodes';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const URL = process.env.SLACK_WEBHOOK;

    //Send a message to the slack channel when a new customer signs up
    if (req.method === 'POST' && URL) {
        let reqBody = {};
        if (req.body.table === 'profiles' && req.body.type === 'INSERT') {
            reqBody = {
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
                                text: `*Name:*\n${req.body.record.first_name} ${req.body.record.last_name}`,
                            },
                            {
                                type: 'mrkdwn',
                                text: `*Email:*\n${req.body.record.email}`,
                            },
                        ],
                    },
                ],
            };
        }

        //Send a message to the slack channel when a new company is created
        if (req.body.table === 'companies' && req.body.type === 'INSERT') {
            reqBody = {
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
                                text: `*Name:*\n${req.body.record.name}`,
                            },
                            {
                                type: 'mrkdwn',
                                text: `*Website:*\n${req.body.record?.website}`,
                            },
                            {
                                type: 'mrkdwn',
                                text: `*Subscription Status:*\n${req.body.record.subscription_status}`,
                            },
                        ],
                    },
                ],
            };
        }

        //Send a message to the slack channel when a company has updated its subscription status
        if (req.body.table === 'companies' && req.body.record === 'UPDATE') {
            if (req.body.record.subscription_status !== req.body.old_record.subscription_status) {
                reqBody = {
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
                                    text: `*${req.body.record.name}* has updated its Subscription from **${req.body.old_record.subscription_status}** to **${req.body.record.subscription_status}**`,
                                },
                            ],
                        },
                    ],
                };
            }
            return;
        }

        await fetch(URL, {
            method: 'POST',
            body: JSON.stringify(reqBody),
        });
    }

    return res.status(httpCodes.OK).json({});
}
