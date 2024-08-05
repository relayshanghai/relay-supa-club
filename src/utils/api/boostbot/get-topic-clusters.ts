import type { ClientOptions } from 'openai';
import OpenAIApi from 'openai';
import type { GetTopicClustersResponse } from 'pages/api/boostbot/get-topic-clusters';
import { RelayError } from 'src/errors/relay-error';
import { serverLogger } from 'src/utils/logger-server';

const configuration: ClientOptions = {
    apiKey: process.env.OPENAI_API_KEY,
};

export const getTopicClusters = async (productDescription: string, topics: string[]): Promise<string[][]> => {
    const openai = new OpenAIApi(configuration);

    const systemPrompt = `You are an influencer marketing expert. You help clients find relevant trending tag clusters for their product.
    Given a product description and a list of tags, please return an object with a "clusters" key containing an array of arrays. Each cluster array is 3 diverse clusters of 3 tags each to reach a wide range of influencers, while always staying relevant to the product.
    Only use the provided tags. Feel free to combine and reuse them to achieve the best niches.

    Example product description: "Smart Fitness Tracker Watch with Heart Rate Monitoring, GPS, and Activity Tracking"
    Example tags: ["fitness", "fit", "gym", "workout", "fitnessmotivation", "health", "wellness", "healthy", "nutrition", "healthylifestyle", "smartwatch", "smartwatches", "smartband", "iwatch", "applewatch", "heartrate", "heartratetraining", "heartratemonitor", "heartpumping", "cardiovascular", "exercise", "training", "activitytracker", "wearable", "steps", "calories", "sweat", "motivation", "running", "jogging", "cycling", "yoga", "strengthtraining", "getfit", "stayactive"]
    
    Example response:
    {   
        "clusters": [
            ["fitness", "workout", "exercise"],
            ["health", "wellness", "nutrition"],
            ["smartwatch", "wearable", "smartband"]
        ]
    }

    Only respond in JSON format with the 3 clusters as an array of arrays of 3 strings in the above format. Make sure the "clusters" key is an array of an arrays. Do not respond with any other text.`;

    const userPrompt = `Product description: "${productDescription}"
        Available tags: [${topics.map((topic) => `"${topic}"`).join(', ')}]`;

    const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-0125',
        response_format: { type: 'json_object' },
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
    });

    let topicClustersString = '';
    let fixedString = '';
    try {
        topicClustersString = chatCompletion?.choices[0]?.message?.content as string;
        fixedString = topicClustersString
            .replace(/[“”]/g, '"') // fix quotation marks
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // remove control characters
            .replace(/,\s*]/g, ']') // remove trailing commas
            .replace(/,\s*}/g, '}') // remove trailing commas
            .replace(/```json/g, ''); // replace ```json
        const topicClusters = JSON.parse(fixedString) as GetTopicClustersResponse | { clusters: string[][] };
        if (typeof topicClusters === 'object' && 'clusters' in topicClusters) {
            return topicClusters.clusters;
        }

        if (
            typeof topicClusters !== 'object' ||
            !Array.isArray(topicClusters) ||
            topicClusters.length !== 3 ||
            !Array.isArray(topicClusters[0]) ||
            topicClusters[0].length !== 3 ||
            !Array.isArray(topicClusters[1]) ||
            topicClusters[1].length !== 3 ||
            !Array.isArray(topicClusters[2]) ||
            topicClusters[2].length !== 3
        ) {
            throw new Error('Invalid topic clusters response from OpenAI');
        }

        return topicClusters;
    } catch (error: any) {
        serverLogger(error);
        throw new RelayError(
            `Invalid topic clusters response from OpenAI. fixedString: ${fixedString} | topicClustersString:${topicClustersString} | error: ${error}`,
        );
    }
};
