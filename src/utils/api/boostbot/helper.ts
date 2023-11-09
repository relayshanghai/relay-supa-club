import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';
import type { GenderPerAge } from 'types';

interface InfluencerEvaluatedStats {
    [key: string]: number;
}
export const evaluateStat = (stat: InfluencerEvaluatedStats) => {
    const statName = Object.keys(stat)[0];
    const statValue = stat[statName];
    //the cutoff standard can be find in KiteMaker ticket V2-1063
    switch (statName) {
        case 'audienceEngagementRateYTInt':
        case 'engagementRateRaw':
            return statValue <= 0.005 ? 'alert' : 'good';
        case 'avgViewsRaw':
        case 'avgReelsPlaysRaw':
            return statValue <= 0.1 ? 'alert' : 'good';
        case 'followersGrowthRaw':
            return statValue <= 0.02 ? 'alert' : 'good';
        case 'totalPosts':
            return statValue <= 10 ? 'alert' : 'good';
        default:
            return;
    }
};

export const processedAudienceDemoData = (influencer: BoostbotInfluencer) => {
    const { audience_genders_per_age: audienceDemoData, audience_genders } = influencer;
    const maleAudienceWeight = audience_genders && audience_genders[0].weight;
    const WEIGHT_TO_PERCENTAGE = 10000;

    if (!audienceDemoData || !maleAudienceWeight) {
        return [];
    }

    const processRawData = (rawData: GenderPerAge[], maleAudienceWeight: number) => {
        const totalMale = rawData.reduce((sum, item) => sum + (item.male ?? 0), 0);
        const femaleAudienceWeight = 1 - maleAudienceWeight;

        return rawData.map((item) => ({
            category: item.code,
            male: (item.male ?? 0) * maleAudienceWeight * WEIGHT_TO_PERCENTAGE,
            female:
                totalMale === 0 || item.male === undefined ? 0 : (item.male / totalMale) * femaleAudienceWeight * 10000,
        }));
    };

    return processRawData(audienceDemoData, maleAudienceWeight);
};
