import type { ClientOptions } from 'openai';
import OpenAIApi from 'openai';
import { RelayError } from 'src/errors/relay-error';
import { serverLogger } from 'src/utils/logger-server';

const configuration: ClientOptions = {
    apiKey: process.env.OPENAI_API_KEY,
};

export const getTopics = async (productDescription: string): Promise<string[]> => {
    const openai = new OpenAIApi(configuration);

    const systemPrompt = `You are an influencer marketing expert. You help clients find relevant trending tags for their product. Based on a product description, return 5 biggest relevant youtube/instagram/tiktok tags to reach the widest audience. Make sure each tag individually is related to the product.

The description can be in various languages, but only return your response tags in English!
Example description: The most advanced home use LED facial mask based on light therapy with 11 different treatments for different skin conditions.
Example response: #skincare, #beauty, #facial, #LEDtherapy, #selfcare

Only respond with a comma separated list of 5 English tags.`;

    const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-0125',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: productDescription },
        ],
    });

    const topics = chatCompletion?.choices[0]?.message?.content
        ?.replaceAll('#', '')
        .split(',')
        .map((topic) => topic.trim());

    if (!topics) {
        serverLogger(chatCompletion);
        throw new RelayError('No topics returned from OpenAI');
    }

    return topics;
};
