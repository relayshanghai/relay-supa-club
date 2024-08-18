import IQDataService from 'src/backend/integration/iqdata/iqdata-service';
import OpenAIService from 'src/backend/integration/openai/openai-service';

export default class InfluencerService {
    static service = new InfluencerService();
    static getService = () => InfluencerService.service;

    async getRelevantTopics(username: string, platform: string) {
        const relevantTopics = await IQDataService.getService().getRelevantTopics(username, platform);
        const calculated = await OpenAIService.getService().getTopicsAndRelevance(relevantTopics);
        return calculated;
    }
}
