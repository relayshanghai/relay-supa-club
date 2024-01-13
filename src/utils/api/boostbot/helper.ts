import type { SearchTableInfluencer as BoostbotInfluencer } from 'types';
import type { GenderPerAge } from 'types';
import type { CreatorSearchAccountObject, CreatorSearchResult, SearchTableInfluencer } from 'types';
import { extractPlatformFromURL } from 'src/utils/extract-platform-from-url';
import type { InfluencerSocialProfileInsert } from 'src/utils/api/db';
import type { Json } from 'types/supabase';

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

export const transformInfluencerToSocialProfile = (influencer: SearchTableInfluencer, insertedInfluencerId: string) => {
    return {
        avatar_url: influencer.picture,
        influencer_id: insertedInfluencerId,
        reference_id: `iqdata:${influencer.user_id}`,
        name: influencer.fullname || influencer.username || influencer.handle || influencer.custom_name || '',
        platform: extractPlatformFromURL(influencer.url),
        url: influencer.url,
        username: influencer.username || influencer.handle || influencer.custom_name || '',
        data: influencer as unknown as Json,
    } as InfluencerSocialProfileInsert;
};

export const processedAudienceDemoData = (influencer: BoostbotInfluencer) => {
    const { audience_genders_per_age: audienceDemoData, audience_genders } = influencer;

    const transformAndMergeData = (rawData: GenderPerAge[], searchedGender: 'male' | 'female'): GenderPerAge[] => {
        return rawData.some((audienceData) => audienceData.code === '65-')
            ? rawData.reduce((acc: GenderPerAge[], audienceCategory, index) => {
                  if (audienceCategory.code !== '65-') {
                      acc.push({
                          code: audienceCategory.code === '45-64' ? '45+' : audienceCategory.code,
                          [searchedGender]:
                              audienceCategory.code === '45-64'
                                  ? audienceCategory[searchedGender] ?? 0 + (rawData[index + 1][searchedGender] ?? 0)
                                  : audienceCategory[searchedGender],
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
    const genders = audienceDemoData[1];

    const searchedMale = genders && 'male' in genders && !(!genders || (genders && 'female' in genders));
    const searchedFemale = genders && 'female' in genders && !(!genders || (genders && 'male' in genders));

    if (searchedMale) {
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
    } else if (searchedFemale) {
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

export function flattenInfluencerData(influencersData: CreatorSearchResult, topics: string[] = []) {
    if (!influencersData.accounts)
        return {
            total: 0,
            influencers: [],
        };
    const structuredResults: SearchTableInfluencer[] = influencersData.accounts
        .map((creator: CreatorSearchAccountObject) => ({
            ...creator.account?.user_profile,
            ...creator.match?.user_profile,
            ...creator.match?.audience_likers?.data,
            topics,
        }))
        .flat();
    return {
        total: influencersData.total,
        influencers: structuredResults,
    };
}
