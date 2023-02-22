import { NextApiResponse, NextApiRequest } from 'next';
import { nextFetch } from 'src/utils/fetcher';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const slackWebhook = process.env.SLACK_WEBHOOK;

    if (req.method === 'POST') {
        if (req.body.record && slackWebhook) {
            // console.log(req.body.record);

            const reqBody = {
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: ':robot_face:A new customer has signed up:',
                        },
                    },
                    {
                        type: 'section',
                        fields: [
                            {
                                type: 'mrkdwn',
                                text: `*Name:*\n${req.body.record.firstName} ${req.body.record.lastName}`,
                            },
                            {
                                type: 'mrkdwn',
                                text: `*Email:*\n${req.body.record.email}`,
                            },
                            {
                                type: 'mrkdwn',
                                text: `*Company:*\n${req.body.record.company_id}`,
                            },
                        ],
                    },
                ],
            };

            await nextFetch(slackWebhook, { method: 'POST', body: JSON.stringify(reqBody) });
        }

        return res.status(200).json(null);
    }

    return res.status(200).json(null);
}
