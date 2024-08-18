import type { GenderPerAge } from 'types';
import { extractPlatformFromURL } from './extract-platform-from-url';
import type { InfluencerSocialProfileEntity } from 'src/backend/database/influencer/influencer-social-profile-entity';
const WEIGHT_TO_PERCENTAGE = 10000;

const engagementRateModifier = (ER: number) => {
    const lowerBound = 0.007;
    const upperBound = 0.18;

    if (lowerBound <= ER && ER <= upperBound) {
        return Math.min(0.99, 0.85 + ER);
    } else if (ER < lowerBound) {
        return Math.max(0, ER / lowerBound);
    } else {
        return Math.max(0, 0.8 - ((ER - upperBound) * 0.3) / (upperBound - lowerBound));
    }
};

const sigmoidIndex = (score: number, platform: string) =>
    platform === 'youtube'
        ? 55 * (1 / (1 + Math.exp(-5 * (score - 0.48)))) + 45
        : 50 * (1 / (1 + Math.exp(-8 * (score - 0.55)))) + 50;

export const calculateIndexScore = (influencer: InfluencerSocialProfileEntity) => {
    const {
        relevance = 0.98,
        engagement_rate,
        avg_views,
        avg_reels_plays,
        followers,
        posts_count = 500,
        url,
    } = influencer.data as any;

    const platform = extractPlatformFromURL(url) ?? 'instagram';
    const isYoutube = platform === 'youtube';
    const averageViews = avg_views || avg_reels_plays || 0;

    let MF, MV, ME;
    if (isYoutube) {
        MF = followers >= 150_000 ? (200_000 - 20_000) / 150_000 : (followers - 3_000) / 100_000;
        MV = averageViews / followers + engagement_rate - 0.005 / 0.395;
        ME = 0;
    } else {
        MF = followers >= 180_000 ? (200_000 - 20_000) / 180_000 : (followers - 15_000) / 180_000;
        MV = Math.log(averageViews / followers + engagement_rate + 1);
        ME = (engagement_rate + (averageViews * 0.5) / followers) / 0.9;
    }

    MF = Math.min(Math.max(MF, 0), 1);
    MV = Math.min(Math.max(MV, 0), 1);
    ME = Math.min(1, ME);

    // Weights
    const WR = isYoutube ? 0.2 : 0.05;
    const WER = isYoutube ? 0.3 : 0.4;
    const WMV = isYoutube ? 0.25 : 0.15;
    const WMF = isYoutube ? 0.2 : 0.05;
    const WP = 0.05; // Same for both platforms
    const WME = isYoutube ? 0 : 0.3;

    const score =
        WR * relevance +
        WER * engagementRateModifier(engagement_rate) +
        WMV * MV +
        WMF * MF +
        WME * ME +
        WP * Math.min(1, posts_count / (isYoutube ? 100 : 500));

    const indexScore = Math.ceil(sigmoidIndex(score, platform));

    // If the score is 99, make it a random value between 93 and 99
    const finalScore = indexScore === 99 ? Math.floor(Math.random() * (99 - 93 + 1) + 93) : indexScore;

    return finalScore;
};
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

export const processedAudienceData = (influencer: InfluencerSocialProfileEntity) => {
    const { audience_genders_per_age: audienceData, audience_genders } = influencer.data as any;

    const searchedGenderAudienceWeight = audience_genders && audience_genders[0].weight;

    if (!audienceData || !searchedGenderAudienceWeight) {
        return [];
    }
    const genders = audienceData[1];

    const searchedMale = genders && 'male' in genders && !(!genders || (genders && 'female' in genders));
    const searchedFemale = genders && 'female' in genders && !(!genders || (genders && 'male' in genders));

    if (searchedMale) {
        return processRawData(
            transformAndMergeData(audienceData, 'male'),
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
            transformAndMergeData(audienceData, 'female'),
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
