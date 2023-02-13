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

const MAX_CHARACTER_LENGTH = 600;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const openai = new OpenAIApi(configuration);
    if (req.method !== 'POST') {
        return res.status(httpCodes.METHOD_NOT_ALLOWED).json({});
    }

    try {
        const {
            brandName,
            influencerName,
            instructions,
            language,
            productDescription,
            productName,
            senderName,
        } = JSON.parse(req.body) as AIEmailGeneratorPostBody;

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
        if (
            brandName.length > 100 ||
            influencerName.length > 100 ||
            productName.length > 100 ||
            senderName.length > 100 ||
            productDescription.length < MAX_CHARACTER_LENGTH ||
            (instructions && instructions.length > 100)
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
            language === 'zh' ? 'Simplified Mandarin Chinese,' : 'American English language'
        }`;
        const trimmedDescription = productDescription.trim();
        const trimDescriptionPunctuation = trimmedDescription.endsWith('.')
            ? trimmedDescription.slice(0, trimmedDescription.length - 1)
            : trimmedDescription;

        const instructionsPrompt = instructions
            ? 'The email should include the following instructions for the receiver: ' +
              instructions
            : '';

        const prompt = `write an email starting with "Dear ${influencerName}", to receiver: ${influencerName}, from sender: ${senderName}, regarding the sender's brand "${brandName}", and the sender's product "${productName}". The email should ask the receiver if they will advertise and promote the sender's product on the receiver's social media platforms. ${productName} can be described as: "${trimDescriptionPunctuation}". ${languagePrompt}. ${instructionsPrompt}.`;

        const data = await openai.createCompletion({
            prompt,
            model: 'text-babbage-001',
            max_tokens: 500,
            n: 1,
            stop: '',
            temperature: 0.5,
        });

        if (data?.data?.choices[0]?.text) {
            const result: AIEmailGeneratorPostResult = { text: data.data.choices[0].text };
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
