import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger';

import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY, OPENAI_API_ORG } from 'src/constants/openai';

export type AIEmailGeneratorPostBody = {
    brandName: string;
    language: 'en-US' | 'zh';
    influencerName: string;
    productName: string;
    productDescription: string;
    instructions?: string;
    senderName: string;
};

export type AIEmailGeneratorPostResult = { text: string };

const configuration = new Configuration({
    organization: OPENAI_API_ORG,
    apiKey: OPENAI_API_KEY,
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
            } = JSON.parse(req.body);

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

            const languagePrompt = `The email should be in ${
                language === 'zh' ? 'Simplified Mandarin Chinese,' : 'English language'
            }`;

            const instructionsPrompt = instructions
                ? ' The email should include the following instructions for the receiver: ' +
                  instructions
                : '';

            const prompt = `Generate an email to ${influencerName}, regarding a marketing campaign collaboration with our brand ${brandName}, for our product ${productName} which can be described as: ${productDescription}. ${languagePrompt}. It should be sent by ${senderName}. ${instructionsPrompt}`;

            const data = await openai.createCompletion({
                prompt,
                model: 'text-babbage-001',
                max_tokens: 500,
                n: 1,
                stop: '',
                temperature: 0.5,
            });

            let filteredData: AIEmailGeneratorPostResult = { text: '' };
            if (data.data && data.data.choices && data.data.choices[0].text !== undefined) {
                filteredData = { text: data.data.choices[0].text };
            } else {
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
            }

            const result: AIEmailGeneratorPostResult = filteredData;

            return res.status(httpCodes.OK).json(result);
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    }
    return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
}
