import type { NextApiRequest, NextApiResponse } from 'next';
import httpCodes from 'src/constants/httpCodes';
import { serverLogger } from 'src/utils/logger-server';
import type { AIEmailSubjectGeneratorPostBody } from './../../../src/utils/api/ai-generate/subject';
import { generateSubjectPrompt } from './../../../src/utils/api/ai-generate/subject';

import { Configuration, OpenAIApi } from 'openai';
import { recordAiEmailGeneratorUsage } from 'src/utils/api/db';

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
        const { brandName, productDescription, productName, company_id, user_id } =
            req.body as AIEmailSubjectGeneratorPostBody;

        if (!brandName || !productDescription || !productName || !company_id || !user_id) {
            return res.status(httpCodes.BAD_REQUEST).json({});
        }

        if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_ORG) {
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }

        const { error: recordError } = await recordAiEmailGeneratorUsage(company_id, user_id);
        if (recordError) {
            res.status(httpCodes.NOT_FOUND).json({ error: recordError });
        }

        let prompt = '';
        try {
            prompt = generateSubjectPrompt({
                brandName,
                company_id,
                productDescription,
                productName,
                user_id,
            });
        } catch (error: any) {
            return res.status(httpCodes.BAD_REQUEST).json({ error: error.message });
        }

        const data = await openai.createChatCompletion({
            messages: [
                {
                    role: 'user', // The user role makes the model follow instructions instead of having a conversation
                    content: prompt,
                },
            ],
            model: 'gpt-3.5-turbo', // [Mar 2 2023] GPT-3 model is the latest and greatest
            max_tokens: 50, // We don't need too long subject lines, 50 tokens should be enough.
            n: 1, // We only need one subject line.
            stop: '',
            temperature: 1, // We want the subject line to be as catchy as possible, so more randomness.
        });

        if (data?.data?.choices[0]?.message?.content) {
            const result: AIEmailSubjectGeneratorPostResult = {
                text: data.data.choices[0].message.content,
            };
            return res.status(httpCodes.OK).json(result);
        } else {
            serverLogger('No data returned from OpenAI API: ' + JSON.stringify(data));
            return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
        }
    } catch (error) {
        serverLogger(error);
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({});
    }
}
