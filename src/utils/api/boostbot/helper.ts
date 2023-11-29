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

    const transformAndMergeData = (rawData: GenderPerAge[], genderSearched: 'male' | 'female'): GenderPerAge[] => {
        return rawData.some((audienceData) => audienceData.code === '65-')
            ? rawData.reduce((acc: GenderPerAge[], audienceCategory, index) => {
                  if (audienceCategory.code !== '65-') {
                      acc.push({
                          code: audienceCategory.code === '45-64' ? '45+' : audienceCategory.code,
                          [genderSearched]:
                              audienceCategory.code === '45-64'
                                  ? audienceCategory[genderSearched] ?? 0 + (rawData[index + 1][genderSearched] ?? 0)
                                  : audienceCategory[genderSearched],
                      });
                  }
                  return acc;
              }, [])
            : rawData.map((data) => ({
                  ...data,
                  code: data.code === '45-64' ? '45+' : data.code,
              }));
    };

    const processRawData = (
        rawData: GenderPerAge[],
        searchedGender: 'male' | 'female',
        calculateGender: 'male' | 'female',
        searchedGenderAudienceWeight: number,
    ) => {
        const totalSearchedGender = rawData.reduce((sum, item) => sum + (item[searchedGender] ?? 0), 0);
        const calculateAudienceWeight = 1 - searchedGenderAudienceWeight;

        return rawData.map((item) => {
            return {
                category: item.code,
                [searchedGender]: (item[searchedGender] ?? 0) * searchedGenderAudienceWeight * WEIGHT_TO_PERCENTAGE,
                [calculateGender]:
                    totalSearchedGender === 0 || item[searchedGender] === undefined
                        ? 0
                        : ((item[searchedGender] ?? 0) / totalSearchedGender) * calculateAudienceWeight * 10000,
            };
        });
    };

    const searchedGenderAudienceWeight = audience_genders && audience_genders[0].weight;
    const WEIGHT_TO_PERCENTAGE = 10000;

    if (!audienceDemoData || !searchedGenderAudienceWeight) {
        return [];
    }

    if ('male' in audienceDemoData[1] && !('female' in audienceDemoData[1])) {
        return processRawData(
            transformAndMergeData(audienceDemoData, 'male'),
            'male',
            'female',
            searchedGenderAudienceWeight,
        ) as {
            category: string;
            male: number;
            female: number;
        }[];
    } else if ('female' in audienceDemoData[1] && !('male' in audienceDemoData[1])) {
        return processRawData(
            transformAndMergeData(audienceDemoData, 'female'),
            'female',
            'male',
            searchedGenderAudienceWeight,
        ) as {
            category: string;
            male: number;
            female: number;
        }[];
    }
    return [];
};

export const convertAudienceDataToPercentage = (
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
