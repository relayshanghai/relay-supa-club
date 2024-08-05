import type { ClientOptions } from 'openai';
import OpenAIApi from 'openai';
import { logger } from 'src/backend/integration/logger';
import { RelayError } from 'src/errors/relay-error';
import { serverLogger } from 'src/utils/logger-server';

const configuration: ClientOptions = {
    apiKey: process.env.OPENAI_API_KEY,
};

export type RelevantTopic = {
    tag: string;
    distance: number;
};

export type TopicsAndRelevance = {
    topic_en: string;
    topic_zh: string;
    relevance: number;
};

export const getTopicsAndRelevance = async (topics: RelevantTopic[]): Promise<TopicsAndRelevance[]> => {
    const openai = new OpenAIApi(configuration);

    const systemPrompt = `Based on the given influencer topics, please generate an array of 7 diverse niche groups and its relevance to the given topics. The groups should have good relevance to the topics. Do not use more than two words for the labels.

    example Influencer topics: [
        { tag: 'makeupartist', distance: 0.75 },
        { tag: 'howtobeauty', distance: 0.15 },
        { tag: 'vancouvermua', distance: 0.45 },
        { tag: 'beautyenthusiast', distance: 0.25 }
      ]

    Example response:
    {
        topics: [
            { "topic_en": "Locations", "topic_zh": "位置", "relevance": 0.48 },
            { "topic_en": "Retail", "topic_zh": "零售", "relevance": 0.36 },
            { "topic_en": "Makeup Skills", "topic_zh": "化妆技巧", "relevance": 0.38 },
            { "topic_en": "Beauty", "topic_zh": "美容", "relevance": 0.28 },
            { "topic_en": "Fashion", "topic_zh": "时尚", "relevance": 0.24 },
            { "topic_en": "Makeup Artists", "topic_zh": "化妆师", "relevance": 0.32 },
            { "topic_en": "Ethnic Themes", "topic_zh": "民族主题", "relevance": 0.34 }
        ]
    }

    Make sure to respond in JSON format. Respond with an array of 7 topic objects in the above format. Do not respond with any other text. Make sure the array is exactly seven items long before responding.
    `;

    const userPrompt = `Influencer topics: "${JSON.stringify(topics)}"`;

    const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-0125',
        response_format: { type: 'json_object' },
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
    });
    let topicsAndRelevanceString = '';
    let fixedString = '';
    try {
        topicsAndRelevanceString = chatCompletion?.choices[0]?.message?.content as string;
        fixedString = topicsAndRelevanceString
            .replace(/[“”]/g, '"') // fix quotation marks
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // remove control characters
            .replace(/,\s*]/g, ']') // remove trailing commas
            .replace(/,\s*}/g, '}') // remove trailing commas
            .replace(/```json/g, ''); // replace ```json

        const parsed = JSON.parse(fixedString);

        if (typeof parsed !== 'object') {
            throw new Error('Unable to parse topic clusters response from OpenAI');
        }
        const topicsAndRelevance = 'topics' in parsed ? parsed.topics : parsed;

        if (!Array.isArray(topicsAndRelevance)) {
            ('Unable to parse topic clusters array response from OpenAI');
        }
        // check each topic has the required fields
        for (const topic of topicsAndRelevance) {
            if (
                !('topic_en' in topic) ||
                typeof topic.topic_en !== 'string' ||
                !('topic_zh' in topic) ||
                typeof topic.topic_zh !== 'string' ||
                !('relevance' in topic) ||
                typeof topic.relevance !== 'number'
            ) {
                logger.info('topic cluster response', topicsAndRelevance);
                throw new Error('Invalid topic clusters response from OpenAI');
            }
        }

        return topicsAndRelevance;
    } catch (error) {
        serverLogger(error);
        throw new RelayError(
            `Invalid topic clusters response from OpenAI. fixedString: ${fixedString} | topicClustersString:${topicsAndRelevanceString} | error: ${error}`,
        );
    }
};
