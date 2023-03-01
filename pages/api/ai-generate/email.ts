import {
    AIEmailGeneratorPostBody,
    generatePrompt,
} from './../../../src/utils/api/ai-generate/email';
import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger';

import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY, OPENAI_API_ORG } from 'src/constants/openai';
import { recordAiEmailGeneratorUsage } from 'src/utils/api/db';

export type AIEmailGeneratorPostResult = { text: string };

const configuration = new Configuration({
    organization: OPENAI_API_ORG,
    apiKey: OPENAI_API_KEY,
});

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
            company_id,
            user_id,
        } = req.body as AIEmailGeneratorPostBody;

        const { error: recordError } = await recordAiEmailGeneratorUsage(company_id, user_id);
        if (recordError) {
            res.status(httpCodes.NOT_FOUND).json({ error: recordError });
        }

        const prompt = generatePrompt({
            brandName,
            company_id,
            influencerName,
            productDescription,
            productName,
            senderName,
            user_id,
            instructions,
        });

        if (prompt.status === 'error') {
            return res.status(httpCodes.BAD_REQUEST).json({ message: prompt.message });
        }

        const data = await openai.createCompletion({
            prompt: prompt.message,
            model: 'text-curie-001', // Curie is closer to davinci model in terms of quality but is much faster
            max_tokens: 512, // 512 tokens seems to work well for this task, we don't need to waste more tokens for our emails
            n: 1, // Just generate a single email
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
