import { NextApiResponse, NextApiRequest } from 'next';
import httpCodes from 'src/constants/httpCodes';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // const URL = process.env.SLACK_WEBHOOK;
    const URL = 'https://hooks.slack.com/services/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'; //testing channel

    if (req.method === 'POST') {
        if (req.body.record && URL) {
            const reqBody = {
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: ':robot_face: A new customer has signed up:',
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

            await fetch(URL, {
                method: 'POST',
                body: JSON.stringify(reqBody),
            });
        }
    }

    return res.status(httpCodes.OK).json({});
}
