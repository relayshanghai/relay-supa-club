import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger';

import { Configuration, OpenAIApi } from 'openai';

export type AIEmailSubjectGeneratorPostBody = {
    brandName: string;
    influencerName: string;
    productName: string;
    productDescription: string;
};

export type AIEmailSubjectGeneratorPostResult = { text: string };

const configuration = new Configuration({
    organization: process.env.OPENAI_API_ORG,
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const openai = new OpenAIApi(configuration);
    if (req.method !== 'POST') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json([]);
    }
    try {
        const { brandName, influencerName, productDescription, productName } = JSON.parse(
            req.body,
        ) as AIEmailSubjectGeneratorPostBody;

        if (!brandName || !influencerName || !productDescription || !productName) {
            return res.status(httpCodes.BAD_REQUEST).json({});
        }
        if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_ORG) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }

        const prompt = `Generate an email subject line, regarding a marketing campaign collaboration for our product ${productName}. The subject line should mention an invitation to marketing campaign collaboration/sponsorship in the beginning.`;

        const data = await openai.createCompletion({
            prompt,
            model: 'text-babbage-001',
            max_tokens: 100,
            n: 1,
            stop: '',
            temperature: 0.7,
        });

        if (data?.data?.choices[0]?.text) {
            const result: AIEmailSubjectGeneratorPostResult = {
                text: data.data.choices[0].text,
            };
            return res.status(httpCodes.OK).json(result);
        } else {
            serverLogger('No data returned from OpenAI API: ' + JSON.stringify(data), 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    } catch (error) {
        serverLogger(error, 'error');
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
}
