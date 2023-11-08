import { evaluateStat, processedAudienceDemoData } from './helper';
import boostbotGetInfluencers from 'src/mocks/api/boostbot/get-influencers.json';
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
    test('processedAudienceDemoData returns category correctly from data', () => {
        expect(result.length).to.equal(5);
        expect(result[0].category).to.equal('13-17');
        expect(result[1].category).to.equal('18-24');
        expect(result[2].category).to.equal('25-34');
        expect(result[3].category).to.equal('35-44');
        expect(result[4].category).to.equal('45-64');
    });

    test('returns correct male and female bar chart data', () => {
        const malePercentageWeight = influencer.audience_genders[0].weight;
        const femalePercentageWeight = 1 - malePercentageWeight;
        const WEIGHT_TO_PERCENTAGE = 10000;
        const male13To17 = influencer.audience_genders_per_age[0].male * malePercentageWeight * WEIGHT_TO_PERCENTAGE;
        const female13To17 =
            (influencer.audience_genders_per_age[0].male / malePercentageWeight) *
            femalePercentageWeight *
            WEIGHT_TO_PERCENTAGE;
        expect(result[0].male).to.equal(male13To17);
        expect(result[0].female).to.equal(female13To17);
    });
});
