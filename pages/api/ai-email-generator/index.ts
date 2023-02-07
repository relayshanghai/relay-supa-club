import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger';

import { Configuration, CreateCompletionResponse, OpenAIApi } from 'openai';

export type AIEmailGeneratorGetQuery = {
    brandName: string;
    language: 'en-US' | 'zh';
    influencerName: string;
    productName: string;
    productDescription: string;
    instructions: string;
    senderName: string;
};

export type AIEmailGeneratorGetResult = CreateCompletionResponse['choices'];

const configuration = new Configuration({
    organization: process.env.OPEN_API_ORGANIZATION_ID,
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const openai = new OpenAIApi(configuration);

    if (req.method === 'POST') {
        try {
            const {
                brandName,
                influencerName,
                instructions,
                language,
                productDescription,
                productName,
                senderName,
            } = req.query as AIEmailGeneratorGetQuery;

            const data = await openai.createCompletion({
                prompt: `Generate an email to ${influencerName}, regarding a marketing campaign collaboration with ${brandName}, for their product ${productName} which can be described as: ${productDescription}. The email should be in ${language} and should be sent by ${senderName}. The email should include the following instructions for the receiver: ${instructions}`,
                model: 'text-davinci-002',
                max_tokens: 7,
                n: 2,
                stop: '',
                temperature: 0.5,
            });

            const result = data.data.choices;

            return res.status(httpCodes.OK).json(result);
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }
    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
