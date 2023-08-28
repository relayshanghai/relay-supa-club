import { Configuration, OpenAIApi } from 'openai';
import { RelayError } from 'src/utils/api-handler';
import { serverLogger } from 'src/utils/logger-server';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

export const getTopics = async (productDescription: string): Promise<string[]> => {
    const openai = new OpenAIApi(configuration);

    const systemPrompt = `You are an influencer marketing expert. You help clients find relevant trending tags for their product. Based on a product description, return 10 biggest relevant youtube/instagram/tiktok tags to reach the widest audience. Make sure each tag individually is related to the product.

Example description: The most advanced home use LED facial mask based on light therapy with 11 different treatments for different skin conditions.
Example response: #skincare, #beauty, #facial, #facialtreatment, #facialmask, #LEDtherapy, #skinhealth, #selfcare, #glowingskin, #homemasktherapy

Only respond with a comma separated list of 10 tags.`;

    const chatCompletion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: productDescription },
        ],
    });

    const topics = chatCompletion?.data?.choices[0]?.message?.content
        ?.replaceAll('#', '')
        .split(',')
        .map((topic) => topic.trim());

    if (!topics) {
        serverLogger(chatCompletion, 'error');
        throw new RelayError('No topics returned from OpenAI');
    }

    return topics;
};
