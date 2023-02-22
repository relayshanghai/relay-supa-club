import { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger';

import { Configuration, OpenAIApi } from 'openai';
import { recordAiEmailGeneratorUsage } from 'src/utils/api/db';

export type AIEmailSubjectGeneratorPostBody = {
    brandName: string;
    influencerName: string;
    productName: string;
    productDescription: string;
    company_id: string;
    user_id: string;
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
        const { brandName, influencerName, productDescription, productName, company_id, user_id } =
            req.body as AIEmailSubjectGeneratorPostBody;

        if (
            !brandName ||
            !influencerName ||
            !productDescription ||
            !productName ||
            !company_id ||
            !user_id
        ) {
            return res.status(httpCodes.BAD_REQUEST).json({});
        }
        if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_ORG) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }

        const { error: recordError } = await recordAiEmailGeneratorUsage(company_id, user_id);
        if (recordError) {
            res.status(httpCodes.NOT_FOUND).json({ error: recordError });
        }

        const trimmedDescription = productDescription.trim();
        const trimDescriptionPunctuation = trimmedDescription.endsWith('.')
            ? trimmedDescription.slice(0, trimmedDescription.length - 1)
            : trimmedDescription;

        const prompt = `Generate a short email subject line, regarding a marketing campaign collaboration for our product ${productName}. Here is a description of the product: ${trimDescriptionPunctuation}. It should start with a catchy and attention grabbing headline and after that mention that this is a marketing campaign collaboration invitation.`;

        const data = await openai.createCompletion({
            prompt,
            model: 'text-babbage-001',
            max_tokens: 50,
            n: 1,
            stop: '',
            temperature: 1,
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
