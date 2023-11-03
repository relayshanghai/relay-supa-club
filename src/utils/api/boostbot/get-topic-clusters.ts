import { Configuration, OpenAIApi } from 'openai';
import { RelayError } from 'src/errors/relay-error';
import { serverLogger } from 'src/utils/logger-server';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

export const getTopicClusters = async (productDescription: string, topics: string[]): Promise<string[][]> => {
    const openai = new OpenAIApi(configuration);

    const systemPrompt = `You are an influencer marketing expert. You help clients find relevant trending tag clusters for their product.
Given a product description and a list of tags, please return 3 diverse clusters of 3 tags each to reach a wide range of influencers, while always staying relevant to the product.
Only use the provided tags. Feel free to combine and reuse them to achieve the best niches.

Example product description: "Smart Fitness Tracker Watch with Heart Rate Monitoring, GPS, and Activity Tracking"
Example tags: ["fitness", "fit", "gym", "workout", "fitnessmotivation", "health", "wellness", "healthy", "nutrition", "healthylifestyle", "smartwatch", "smartwatches", "smartband", "iwatch", "applewatch", "heartrate", "heartratetraining", "heartratemonitor", "heartpumping", "cardiovascular", "exercise", "training", "activitytracker", "wearable", "steps", "calories", "sweat", "motivation", "running", "jogging", "cycling", "yoga", "strengthtraining", "getfit", "stayactive"]
Example response:
[
    ["fitness", "workout", "exercise"],
    ["health", "wellness", "nutrition"],
    ["smartwatch", "wearable", "smartband"]
]

Only respond in JSON format with the 3 clusters as an array of arrays of 3 strings. Do not respond with any other text.`;

    const userPrompt = `Product description: "${productDescription}"

Available tags: [${topics.map((topic) => `"${topic}"`).join(', ')}]`;

    const chatCompletion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
    });

    try {
        const topicClustersString = chatCompletion?.data?.choices[0]?.message?.content as string;
        const fixedString = topicClustersString
            .replace(/[“”]/g, '"') // fix quotation marks
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // remove control characters
            .replace(/,\s*]/g, ']') // remove trailing commas
            .replace(/,\s*}/g, '}'); // remove trailing commas
        const topicClusters = JSON.parse(fixedString);

        return topicClusters;
    } catch (error: any) {
        serverLogger(error);
        throw new RelayError('Invalid topic clusters response from OpenAI');
    }
};
