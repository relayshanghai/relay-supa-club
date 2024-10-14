import IQDataService from 'src/backend/integration/iqdata/iqdata-service';
import OpenAIService from 'src/backend/integration/openai/openai-service';
import { NotFoundError } from 'src/utils/error/http-error';
import type { CreatorDict, Platforms } from 'types';

export default class InfluencerService {
    static service = new InfluencerService();
    static getService = () => InfluencerService.service;

    async getRelevantTopics(username: string, platform: string) {
        const relevantTopics = await IQDataService.getService().getRelevantTopics(username, platform);
        const calculated = await OpenAIService.getService().getTopicsAndRelevance(relevantTopics);
        return calculated;
    }

    async searchByUsername(username: string, platform: Platforms): Promise<CreatorDict | null> {
        let res = null;
        res = await IQDataService.getService().getDictUsers({ username, platform, type: 'search', limit: 1 });
        if (res.data.length > 0) {
            return res.data[0];
        }
        res = await IQDataService.getService().requestNewReport(platform, username, false);
        if (res.success) {
            return {
                user_id: res.user_profile.user_id,
                custom_name: res.user_profile.custom_name as string,
                handle: res.user_profile.handle as string,
                fullname: res.user_profile.fullname,
                picture: res.user_profile.picture || '',
                followers: res.user_profile.followers,
                is_verified: res.user_profile.is_verified,
            };
        }

        throw new NotFoundError('Influencer not found');
    }
}
