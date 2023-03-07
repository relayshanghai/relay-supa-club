import { generateEmailPrompt } from './../../../src/utils/api/ai-generate/email';
import type { AIEmailGeneratorPostBody } from './../../../src/utils/api/ai-generate/email';
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

        const prompt = generateEmailPrompt({
            brandName,
            company_id,
            influencerName,
            productDescription,
            productName,
            senderName,
            user_id,
            instructions,
        });

        if (prompt === 'error') {
            return res.status(httpCodes.BAD_REQUEST).json({ message: prompt.message });
        }

        const data = await openai.createChatCompletion({
            messages: [
                {
                    role: 'user', // Ask the model to take the role of the user
                    content: prompt.message,
                },
            ],
            model: 'gpt-3.5-turbo', // [Mar 23 2023] GPT-3 model is the latest and greatest
            max_tokens: 512, // 512 tokens seems to work well for this task, we don't need to waste more tokens for our emails
            n: 1, // Just generate a single email
            stop: '',
            temperature: 0.6, // Higher the number, higher the variation
        });

        if (data?.data?.choices[0]?.message?.content) {
            const result: AIEmailGeneratorPostResult = {
                text: data.data.choices[0].message.content,
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
