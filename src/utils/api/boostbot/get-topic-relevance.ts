import { Configuration, OpenAIApi } from 'openai';
import { RelayError } from 'src/utils/api-handler';
import { serverLogger } from 'src/utils/logger-server';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

export type TopicsAndRelevance = {
    topic_en: string;
    topic_zh: string;
    relevance: number;
};

export const getTopicsAndRelevance = async (topics: string[]): Promise<TopicsAndRelevance[]> => {
    const openai = new OpenAIApi(configuration);

    const systemPrompt = `Based on the given influencer topics, please generate 7 diverse niche groups and its relevance to the given topics. The groups should have good relevance to the topics. Do not use more than two words for the labels.

    Influencer topics: ["makeup", "makeupartist", "howtobeauty", "vancouvermua", "beautyenthusiast"]

Example response:
[
    { "topic_en": "Locations", "topic_zh": "位置", "relevance": 0.48 },
    { "topic_en": "Retail", "topic_zh": "零售", "relevance": 0.36 },
    { "topic_en": "Makeup Skills", "topic_zh": "化妆技巧", "relevance": 0.38 },
    { "topic_en": "Beauty", "topic_zh": "美容", "relevance": 0.28 },
    { "topic_en": "Fashion", "topic_zh": "时尚", "relevance": 0.24 },
    { "topic_en": "Makeup Artists", "topic_zh": "化妆师", "relevance": 0.32 },
    { "topic_en": "Ethnic Themes", "topic_zh": "民族主题", "relevance": 0.34 }
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
        const topicsAndRelevanceString = chatCompletion?.data?.choices[0]?.message?.content as string;
        const fixedString = topicsAndRelevanceString
            .replace(/[“”]/g, '"') // fix quotation marks
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // remove control characters
            .replace(/,\s*]/g, ']') // remove trailing commas
            .replace(/,\s*}/g, '}'); // remove trailing commas
        const topicsAndRelevance = JSON.parse(fixedString);

        return topicsAndRelevance;
    } catch (error) {
        serverLogger(error);
        throw new RelayError('Invalid topic relevance response from OpenAI');
    }
};
