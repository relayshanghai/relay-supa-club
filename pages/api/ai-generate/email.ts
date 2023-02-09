import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger';

import { Configuration, CreateCompletionResponse, OpenAIApi } from 'openai';

export type AIEmailGeneratorGetQuery = {
    brandName: string;
    language: 'en-US' | 'zh';
    influencerName: string;
    productName: string;
    productDescription: string;
    instructions?: string;
    senderName: string;
};

export type AIEmailGeneratorGetResult = CreateCompletionResponse['choices'];

const configuration = new Configuration({
    organization: process.env.OPENAI_API_ORG,
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
            } = JSON.parse(req.body) as AIEmailGeneratorGetQuery;

            if (
                !brandName ||
                !influencerName ||
                !language ||
                !productDescription ||
                !productName ||
                !senderName
            ) {
                return res.status(httpCodes.BAD_REQUEST).json({});
            }
            if (language !== 'en-US' && language !== 'zh') {
                return res.status(httpCodes.BAD_REQUEST).json({});
            }
            if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_ORG) {
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }

            const languagePrompt =
                'The email should be in' + language === 'zh'
                    ? 'Simplified Mandarin Chinese,'
                    : 'English language';
            const instructionsPrompt = instructions
                ? 'The email should include the following instructions for the receiver:' +
                  instructions
                : '';

            const data = await openai.createCompletion({
                prompt: `Generate an email to ${influencerName}, regarding a marketing campaign collaboration with ${brandName}, for their product ${productName} which can be described as: ${productDescription}. ${languagePrompt} and should be sent by ${senderName}. ${instructionsPrompt}}`,
                model: 'text-davinci-002',
                max_tokens: 50,
                n: 1,
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
