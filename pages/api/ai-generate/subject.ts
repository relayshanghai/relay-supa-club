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

        const prompt = `Generate an email subject line for an influencer, regarding a marketing campaign collaboration with our company ${brandName} and our product ${productName} which can be described as: ${productDescription}. The subject line should be attention grabbing and mention a marketing collaboration.`;

        const data = await openai.createCompletion({
            prompt,
            model: 'text-babbage-001',
            max_tokens: 50,
            n: 1,
            stop: '',
            temperature: 0.5,
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
