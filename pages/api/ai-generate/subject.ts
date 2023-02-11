import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger';

import { Configuration, OpenAIApi } from 'openai';

export type AIEmailSubjectGeneratorPostBody = {
    brandName: string;
    language: 'en-US' | 'zh';
    influencerName: string;
    productName: string;
    productDescription: string;
};

export type AIEmailSubjectGeneratorPostResult = string[];

const configuration = new Configuration({
    organization: process.env.OPENAI_API_ORG,
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<AIEmailSubjectGeneratorPostResult>,
) {
    const openai = new OpenAIApi(configuration);

    if (req.method === 'POST') {
        try {
            const { brandName, influencerName, language, productDescription, productName } =
                JSON.parse(req.body) as AIEmailSubjectGeneratorPostBody;

            if (!brandName || !influencerName || !language || !productDescription || !productName) {
                return res.status(httpCodes.BAD_REQUEST).json([]);
            }
            if (language !== 'en-US' && language !== 'zh') {
                return res.status(httpCodes.BAD_REQUEST).json([]);
            }
            if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_ORG) {
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json([]);
            }

            const languagePrompt =
                'The email should be in ' + language === 'zh'
                    ? 'Simplified Mandarin Chinese'
                    : 'English language';

            const data = await openai.createCompletion({
                prompt: `Generate an attention catching email subject line to ${influencerName}, regarding a marketing campaign collaboration with ${brandName}, for their product ${productName} which can be described as: ${productDescription}. ${languagePrompt}.`,
                model: 'text-davinci-002',
                max_tokens: 25,
                n: 5,
                stop: '',
                temperature: 0.5,
            });

            const filteredData: AIEmailSubjectGeneratorPostResult = [];
            if (data.data && data.data.choices) {
                data.data.choices.forEach((choice) => {
                    const { text } = choice;
                    if (text && text.length > 0) {
                        filteredData.push(text);
                    }
                });
            } else {
                return res.status(httpCodes.INTERNAL_SERVER_ERROR).json([]);
            }

            const result: AIEmailSubjectGeneratorPostResult = filteredData;

            return res.status(httpCodes.OK).json(result);
        } catch (error) {
            serverLogger(error, 'error');
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json([]);
        }
    }
    return res.status(httpCodes.METHOD_NOT_ALLOWED).json([]);
}
