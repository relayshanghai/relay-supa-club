import { NextApiResponse, NextApiRequest } from 'next';
import httpCodes from 'src/constants/httpCodes';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // const URL = process.env.SLACK_WEBHOOK;
    const URL = 'https://hooks.slack.com/services/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'; //testing channel

    if (req.method === 'POST') {
        if (req.body.record && URL) {
            // console.log(req.body.record);

            // const reqBody = {
            //     blocks: [
            //         {
            //             type: 'section',
            //             text: {
            //                 type: 'mrkdwn',
            //                 text: ':robot_face:A new customer has signed up:',
            //             },
            //         },
            //         {
            //             type: 'section',
            //             fields: [
            //                 {
            //                     type: 'mrkdwn',
            //                     text: `*Name:*\n${req.body.record.firstName} ${req.body.record.lastName}`,
            //                 },
            //                 {
            //                     type: 'mrkdwn',
            //                     text: `*Email:*\n${req.body.record.email}`,
            //                 },
            //                 {
            //                     type: 'mrkdwn',
            //                     text: `*Company:*\n${req.body.record.company_id}`,
            //                 },
            //             ],
            //         },
            //     ],
            // };

            const data = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({ text: 'Hello, World!' }),
            });
            // console.log(data);
        }

        return res.status(httpCodes.OK).json({});
    }

    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
