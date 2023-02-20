import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger';

import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY, OPENAI_API_ORG } from 'src/constants/openai';

export type AIEmailGeneratorPostBody = {
    brandName: string;
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
            productDescription,
            productName,
            senderName,
        } = JSON.parse(req.body) as AIEmailGeneratorPostBody;

        if (!brandName || !influencerName || !productDescription || !productName || !senderName) {
            return res.status(httpCodes.BAD_REQUEST).json({});
        }
        if (
            brandName.length > 100 ||
            influencerName.length > 100 ||
            productName.length > 100 ||
            senderName.length > 100 ||
            productDescription.length > MAX_CHARACTER_LENGTH ||
            (instructions && instructions.length > MAX_CHARACTER_LENGTH)
        ) {
            return res.status(httpCodes.BAD_REQUEST).json({});
        }
        if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_ORG) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }

        const trimmedDescription = productDescription.trim();
        const trimDescriptionPunctuation = trimmedDescription.endsWith('.')
            ? trimmedDescription.slice(0, trimmedDescription.length - 1)
            : trimmedDescription;

        const trimmedInstructions = instructions?.trim();
        const trimmedInstructionsPunctuation = trimmedInstructions?.endsWith('.')
            ? trimmedInstructions?.slice(0, trimmedInstructions?.length - 1)
            : trimmedInstructions;

        const data = await openai.createCompletion({
            prompt:
                'Compose an email to ' +
                influencerName +
                " expressing our brand's interest in collaborating with them to promote our new product offered by our brand " +
                brandName +
                '. Start the email by expressing that I love ' +
                influencerName +
                "'s content and that they would be a great match for our marketing campaign. Explain to them our new product: " +
                productName +
                ', with the relevant description: ' +
                trimDescriptionPunctuation +
                '. ' +
                (instructions
                    ? 'The email should include guidelines for them on how they can participate in the marketing campaign. Tell them that it would be great if they could follow the following guidelines: ' +
                      trimmedInstructionsPunctuation
                    : '') +
                '\nFinally, the email should express gratitude for the their time and consideration, and end with a call-to-action for them to respond if they are interested in the collaboration. Sign the email with the name of the sender, ' +
                senderName +
                ' at the end.',
            model: 'text-babbage-001',
            max_tokens: 1024,
            n: 1,
            stop: '',
            temperature: 0.4,
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
