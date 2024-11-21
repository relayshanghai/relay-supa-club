import { type SequenceInfluencerEntity } from 'src/backend/database/sequence/sequence-influencer-entity';
import SequenceInfluencerRepository from 'src/backend/database/sequence/sequence-influencer-repository';
import IQDataService from 'src/backend/integration/iqdata/iqdata-service';
import OpenAIService from 'src/backend/integration/openai/openai-service';
import { NotFoundError } from 'src/utils/error/http-error';
import { In } from 'typeorm';
import { stringify } from 'csv-stringify';
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
        res = await IQDataService.getService().getInfluencerFromSavedReports({ username, platform });
        if (res[0]) {
            const d = res[0].user_profile;
            return {
                user_id: d.user_id,
                custom_name: d.fullname as string,
                handle: d.username as string,
                fullname: d.fullname,
                picture: d.picture || '',
                followers: d.followers,
                is_verified: false,
            };
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

    async exportInfluencersToCsv(influencers: string[]) {
        const influencerData = await SequenceInfluencerRepository.getRepository().find({
            where: { id: In(influencers) },
            relations: {
                influencerSocialProfile: true,
            },
        });
        return this.exportInfluencersToCsvProcess(influencerData);
    }

    private async exportInfluencersToCsvProcess(data: SequenceInfluencerEntity[]) {
        // Prepare CSV data
        const csvData: any[] = [];
        const headers = ['Username', 'Email', 'Platform', 'Topics', 'Added Date']; // CSV headers
        csvData.push(headers);

        data.forEach((item) => {
            const formattedDate = new Date(item.createdAt).toLocaleDateString('en-US');
            csvData.push([item.username, item.email, item.platform, item.tags.join(', '), formattedDate]);
        });

        const output = await this.stringifyCsv(csvData);
        return output as string;
    }

    private async stringifyCsv(d: any) {
        return new Promise((resolve, reject) => {
            // Convert to CSV string
            stringify(d, (err, output) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(output);
                }
            });
        });
    }
}
