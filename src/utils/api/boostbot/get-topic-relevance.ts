import { Configuration, OpenAIApi } from 'openai';
import { RelayError } from 'src/utils/api-handler';
import { serverLogger } from 'src/utils/logger-server';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

export type TopicsAndRelevance = {
    topic: string;
    relevance: number;
};

export const getTopicsAndRelevance = async (topics: string[]): Promise<TopicsAndRelevance[]> => {
    const openai = new OpenAIApi(configuration);

    const systemPrompt = `Based on the given influencer topics, please generate 7 diverse niche groups and its relevance to the given topics.

    Influencer topics: [
    "makeup",
    "makeupartist",
    "makeup",
    "yycmakeupartist",
    "yegbeauty",]

    Example response:
    [
    { "topic": "Geographical Locations", "relevance": 0.28 },
    { "topic": "Brands and Retailers", "relevance": 0.16 },
    { "topic": "Makeup Techniques", "relevance": 0.18 },
    { "topic": "Beauty Issues", "relevance": 0.08 },
    { "topic": "Fashion and Clothing", "relevance": 0.04 },
    { "topic": "Professional Makeup Artists", "relevance": 0.12 },
    { "topic": "Ethnic and Seasonal Themes", "relevance": 0.14 }
    ]
    Only respond in JSON format with the 7 object as an array. Do not respond with any other text.
    `;

    const userPrompt = `Influencer topics: "${topics}"`;

    const chatCompletion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
    });

    try {
        const topicsAndRelevance = chatCompletion?.data?.choices[0]?.message?.content;
        if (!topicsAndRelevance) {
            throw new Error('No topics and relevance returned from OpenAI');
        }
        return JSON.parse(topicsAndRelevance);

        // return topicsAndRelevance;
    } catch (error) {
        serverLogger(error);
        throw new RelayError('Invalid topic relevance response from OpenAI');
    }
};
