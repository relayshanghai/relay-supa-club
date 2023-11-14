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

    const transformAndMergeData = (rawData: GenderPerAge[]): GenderPerAge[] => {
        return rawData.some((audienceData) => audienceData.code === '65-')
            ? rawData.reduce((acc: GenderPerAge[], audienceCategory, index) => {
                  if (audienceCategory.code !== '65-') {
                      acc.push({
                          code: audienceCategory.code === '45-64' ? '45+' : audienceCategory.code,
                          male:
                              audienceCategory.code === '45-64'
                                  ? (audienceCategory.male ?? 0) + (rawData[index + 1]?.male ?? 0)
                                  : audienceCategory.male,
                      });
                  }
                  return acc;
              }, [])
            : rawData.map((data) => ({
                  ...data,
                  code: data.code === '45-64' ? '45+' : data.code,
              }));
    };

    const processRawData = (rawData: GenderPerAge[], maleAudienceWeight: number) => {
        const totalMale = rawData.reduce((sum, item) => sum + (item.male ?? 0), 0);
        const femaleAudienceWeight = 1 - maleAudienceWeight;

        return rawData.map((item) => {
            return {
                category: item.code,
                male: (item.male ?? 0) * maleAudienceWeight * WEIGHT_TO_PERCENTAGE,
                female:
                    totalMale === 0 || item.male === undefined
                        ? 0
                        : (item.male / totalMale) * femaleAudienceWeight * 10000,
            };
        });
    };

    const convertToPercentage = (
        data: {
            category: string;
            male: number;
            female: number;
        }[],
    ) => {
        const totalAudience = data.reduce((sum, item) => sum + item.male + item.female, 0);
        return data.map((item) => ({
            ...item,
            male: (item.male / totalAudience) * 100,
            female: (item.female / totalAudience) * 100,
        }));
    };

    return convertToPercentage(processRawData(transformAndMergeData(audienceDemoData), maleAudienceWeight));
};
