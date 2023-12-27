import {
    convertAudienceDataToPercentage,
    evaluateStat,
    flattenInfluencerData,
    processedAudienceDemoData,
} from './helper';
import boostbotGetInfluencers from 'src/mocks/api/boostbot/get-influencers.json';
import indexDefaultSearch from 'src/mocks/api/influencer-search/indexDefaultSearch';
import type { CreatorSearchResult } from 'types';
import { describe, test, expect } from 'vitest';

describe('evaluateStat function works as intended', () => {
    test('evaluateStat return alert if engagementRate is less than or equals 0.005', () => {
        const stat1 = { engagementRateRaw: 0.005 };
        const stat2 = { engagementRateRaw: 0.004 };
        expect(evaluateStat(stat1)).to.equal('alert');
        expect(evaluateStat(stat2)).to.equal('alert');
    });

    test('evaluateStat return good if engagementRate is more than 0.005', () => {
        const stat = { engagementRateRaw: 0.006 };
        expect(evaluateStat(stat)).to.equal('good');
    });

    test('evaluateStat return alert if avgViews or avgReelsPlay is less than or equals 0.1', () => {
        const stat1 = { avgViewsRaw: 0.1 };
        const stat2 = { avgViewsRaw: 0.09 };
        expect(evaluateStat(stat1)).to.equal('alert');
        expect(evaluateStat(stat2)).to.equal('alert');
    });

    test('evaluateStat return good if avgViews or avgReelsPlay is more than 0.1', () => {
        const stat = { avgViewsRaw: 0.11 };
        expect(evaluateStat(stat)).to.equal('good');
    });

    test('evaluateStat return alert if followersGrowth is less than or equals 0.02', () => {
        const stat1 = { followersGrowthRaw: 0.02 };
        const stat2 = { followersGrowthRaw: 0.01 };
        expect(evaluateStat(stat1)).to.equal('alert');
        expect(evaluateStat(stat2)).to.equal('alert');
    });

    test('evaluateStat return good if followersGrowth is more than 0.02', () => {
        const stat = { followersGrowthRaw: 0.03 };
        expect(evaluateStat(stat)).to.equal('good');
    });

    test('evaluateStat return alert if totalPosts is less than or equals 10', () => {
        const stat1 = { totalPosts: 10 };
        const stat2 = { totalPosts: 9 };
        expect(evaluateStat(stat1)).to.equal('alert');
        expect(evaluateStat(stat2)).to.equal('alert');
    });

    test('evaluateStat return good if totalPosts is more than 10', () => {
        const stat = { totalPosts: 11 };
        expect(evaluateStat(stat)).to.equal('good');
    });
});

describe('processedAudienceDemoData function works as intended', () => {
    const influencer = boostbotGetInfluencers[0];
    const result = processedAudienceDemoData(influencer);
    const correctedResult = convertAudienceDataToPercentage(result);
    test('processedAudienceDemoData returns category correctly from data', () => {
        expect(result.length).to.equal(5);
        expect(result[0].category).to.equal('13-17');
        expect(result[1].category).to.equal('18-24');
        expect(result[2].category).to.equal('25-34');
        expect(result[3].category).to.equal('35-44');
        expect(result[4].category).to.equal('45+');
    });

    test('returns correct male and female bar chart data', () => {
        const malePercentageWeight = influencer.audience_genders[0].weight;
        const femalePercentageWeight = 1 - malePercentageWeight;
        const WEIGHT_TO_PERCENTAGE = 10000;

        const totalAudience = result.reduce((sum, item) => sum + item.male + item.female, 0);

        const male13To17 = influencer.audience_genders_per_age[0].male * malePercentageWeight * WEIGHT_TO_PERCENTAGE;
        const female13To17 =
            (influencer.audience_genders_per_age[0].male / malePercentageWeight) *
            femalePercentageWeight *
            WEIGHT_TO_PERCENTAGE;
        expect(result[0].male).to.equal(male13To17);
        expect(result[0].female).to.equal(female13To17);

        expect(correctedResult[0].male).to.equal((male13To17 / totalAudience) * 100);
        expect(correctedResult[0].female).to.equal((female13To17 / totalAudience) * 100);
    });
});

describe('flattenInfluencerData function works as intended', () => {
    test('should correctly flatten influencer data when all fields are present', () => {
        const influencersData: CreatorSearchResult = {
            ...indexDefaultSearch,
            accounts: indexDefaultSearch.accounts,
        };

        const topics = ['fashion', 'photography'];

        const expectedResults = [
            {
                user_id: 'UCq-Fj5jknLsUf-MWSy4_brA',
                username: 'tseries',
                handle: 'tseries',
                url: 'https://www.youtube.com/channel/UCq-Fj5jknLsUf-MWSy4_brA',
                picture:
                    'https://yt3.googleusercontent.com/v_PwNTRdcmpaEU6zh9wytm0ERtq2BOAmBQvr1QyZstphlpcPUqjbX3wqIvSRR9bWIgSjmRUJcwE=s480-c-k-c0x00ffffff-no-rj',
                fullname: 'T-Series',
                is_verified: true,
                followers: 239000000,
                engagements: 24227,
                engagement_rate: 0.00010136820083682008,
                avg_views: 1615728,
                topics: ['fashion', 'photography'],
            },
            {
                user_id: 'UCbCmjCuTUZos6Inko4u57UQ',
                username: 'checkgate',
                custom_name: 'CoComelon',
                handle: 'CoComelon',
                url: 'https://www.youtube.com/channel/UCbCmjCuTUZos6Inko4u57UQ',
                picture:
                    'https://yt3.googleusercontent.com/ytc/AL5GRJXB8VWrb_icZhpFOXZJLxGWI-56sDEx8gzXC47VDw=s480-c-k-c0x00ffffff-no-rj',
                fullname: 'Cocomelon - Nursery Rhymes',
                is_verified: false,
                followers: 157000000,
                engagements: 53278,
                engagement_rate: 0.00033935031847133755,
                avg_views: 10552383,
                topics: ['fashion', 'photography'],
            },
            {
                user_id: 'UCpEhnqL0y41EpW2TvWAHD7Q',
                username: 'setindia',
                custom_name: 'setindia',
                handle: 'SETIndia',
                url: 'https://www.youtube.com/channel/UCpEhnqL0y41EpW2TvWAHD7Q',
                picture:
                    'https://yt3.googleusercontent.com/_FmN-rgQ1Wkp9j9xDBbcPHCq5p7pSutDh_QP-CfOz8LPTrYhnWHmDoucvtz7BXy34wsdVu5uZA4=s480-c-k-c0x00ffffff-no-rj',
                fullname: 'SET India',
                is_verified: true,
                followers: 154000000,
                engagements: 641,
                engagement_rate: 0.0000041623376623376625,
                avg_views: 31320,
                topics: ['fashion', 'photography'],
            },
            {
                user_id: 'UCX6OQ3DkcsbYNE6H8uQQuVA',
                username: 'MrBeast6000',
                custom_name: 'MrBeast6000',
                handle: 'MrBeast',
                url: 'https://www.youtube.com/channel/UCX6OQ3DkcsbYNE6H8uQQuVA',
                picture:
                    'https://yt3.googleusercontent.com/ytc/AL5GRJVuqw82ERvHzsmBxL7avr1dpBtsVIXcEzBPZaloFg=s480-c-k-c0x00ffffff-no-rj',
                fullname: 'MrBeast',
                is_verified: true,
                followers: 139000000,
                engagements: 7621103,
                engagement_rate: 0.05482807913669065,
                avg_views: 156317314,
                topics: ['fashion', 'photography'],
            },
            {
                user_id: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw',
                username: 'PewDiePie',
                handle: 'PewDiePie',
                url: 'https://www.youtube.com/channel/UC-lHJZR3Gqxm24_Vd_AJ5Yw',
                picture:
                    'https://yt3.googleusercontent.com/5oUY3tashyxfqsjO5SGhjT4dus8FkN9CsAHwXWISFrdPYii1FudD4ICtLfuCw6-THJsJbgoY=s480-c-k-c0x00ffffff-no-rj',
                fullname: 'PewDiePie',
                is_verified: true,
                followers: 111000000,
                engagements: 287674,
                engagement_rate: 0.0025916576576576577,
                avg_views: 3551438,
                topics: ['fashion', 'photography'],
            },
            {
                user_id: 'UCk8GzjMOrta8yxDcKfylJYw',
                custom_name: 'KidsDianaShow',
                handle: 'KidsDianaShow',
                url: 'https://www.youtube.com/channel/UCk8GzjMOrta8yxDcKfylJYw',
                picture:
                    'https://yt3.googleusercontent.com/ytc/AL5GRJWPo8m4nLhbJ7U1S-lXndOcxwQJhsaGQsHvkCXMSw=s480-c-k-c0x00ffffff-no-rj',
                fullname: '✿ Kids Diana Show',
                is_verified: true,
                followers: 110000000,
                engagements: 74002,
                engagement_rate: 0.0006727454545454545,
                avg_views: 16827996,
                topics: ['fashion', 'photography'],
            },
            {
                user_id: 'UCJplp5SjeGSdVdwsfb9Q7lQ',
                handle: 'LikeNastyaofficial',
                url: 'https://www.youtube.com/channel/UCJplp5SjeGSdVdwsfb9Q7lQ',
                picture:
                    'https://yt3.googleusercontent.com/ytc/AL5GRJWdjxTrvDKtL7mmABKfxUMXRLojq_5xB37iqD1-ng=s480-c-k-c0x00ffffff-no-rj',
                fullname: 'Like Nastya',
                is_verified: true,
                followers: 105000000,
                engagements: 49907,
                engagement_rate: 0.0004753047619047619,
                avg_views: 8464476,
                topics: ['fashion', 'photography'],
            },
            {
                user_id: 'UCvlE5gTbOvjiolFlEm-c_Ow',
                custom_name: 'VladandNiki',
                handle: 'VladandNiki',
                url: 'https://www.youtube.com/channel/UCvlE5gTbOvjiolFlEm-c_Ow',
                picture:
                    'https://yt3.googleusercontent.com/RlnpUc0SBCmYvseTqUqAfYeyHw0nHcmqQIVS0vMcTKpk3gQAY0ZZY1JpUxxjLPAYROhDYKub=s480-c-k-c0x00ffffff-no-rj',
                fullname: 'Vlad and Niki',
                is_verified: true,
                followers: 95800000,
                engagements: 33846,
                engagement_rate: 0.0003532985386221294,
                avg_views: 10651949,
                topics: ['fashion', 'photography'],
            },
            {
                user_id: 'UCJ5v_MCY6GNUBTO8-D3XoAg',
                username: 'WWEFanNation',
                custom_name: 'WWE',
                handle: 'WWE',
                url: 'https://www.youtube.com/channel/UCJ5v_MCY6GNUBTO8-D3XoAg',
                picture:
                    'https://yt3.googleusercontent.com/ytc/AL5GRJUNCk6JcNlEyBPH_K8x4kPzIR5NtFRNaCBebSG7vjo=s480-c-k-c0x00ffffff-no-rj',
                fullname: 'WWE',
                is_verified: true,
                followers: 94200000,
                engagements: 4149,
                engagement_rate: 0.00004404458598726115,
                avg_views: 107721,
                topics: ['fashion', 'photography'],
            },
            {
                user_id: 'UCFFbwnve3yF62-tVXkTyHqg',
                username: 'zeemusiccompany',
                handle: 'zeemusiccompany',
                url: 'https://www.youtube.com/channel/UCFFbwnve3yF62-tVXkTyHqg',
                picture:
                    'https://yt3.googleusercontent.com/EEGERwlaKJd27zSEPQF3d__-tPyppIgFfKvNfBkWa7ssMKBWqQUbuCTLe-kAnTB1r6kJQVxyxwY=s480-c-k-c0x00ffffff-no-rj',
                fullname: 'Zee Music Company',
                is_verified: true,
                followers: 93900000,
                engagements: 12937,
                engagement_rate: 0.00013777422790202344,
                avg_views: 709082,
                topics: ['fashion', 'photography'],
            },
        ];

        const result = flattenInfluencerData(influencersData, topics);

        expect(result.influencers).toEqual(expectedResults);
    });
    test('should return empty influencers array when accounts array is empty', () => {
        const influencersData: CreatorSearchResult = {
            total: 0,
            accounts: [],
            cost: 0,
            shown_accounts: [],
        };

        const topics = ['fashion', 'photography'];

        const result = flattenInfluencerData(influencersData, topics);

        expect(result).toEqual({
            total: 0,
            influencers: [],
        });
    });
});
