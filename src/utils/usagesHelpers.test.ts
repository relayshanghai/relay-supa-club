import { describe, expect, test, it } from 'vitest';
import { getCurrentMonthPeriod, getPeriodUsages, hasCustomSearchParams } from './usagesHelpers';
import type { FetchCreatorsFilteredParams } from './api/iqdata/transforms';

describe('getPeriodUsages', () => {
    const now = new Date();
    const justRecently = new Date();
    justRecently.setSeconds(justRecently.getSeconds() - 1);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    test('should return the correct number of usages that happened between the inputted dates', () => {
        // const usages: SimpleUsage[] =
        // changed the type of usages to any[] to make it easier to test which results we get
        const usages: any[] = [
            // included
            {
                type: 'search',
                created_at: justRecently.toISOString(),
                name: 'justRecently', // added this line to make sure we are getting the dates we want back, and not just the length of the array which could be the right length but the wrong dates
            },
            {
                type: 'search',
                created_at: lastMonth.toISOString(),
                name: 'lastMonth',
            },
            // excluded
            {
                type: 'search',
                created_at: twoMonthsAgo.toISOString(),
                name: 'twoMonthsAgo',
            },
            {
                type: 'search',
                created_at: nextMonth.toISOString(),
                name: 'nextMonth',
            },
        ];
        const result = getPeriodUsages(usages, lastMonth, now) as any;
        expect(result?.length).toEqual(2);
        expect(result?.[0].name).toEqual('justRecently');
        expect(result?.[1].name).toEqual('lastMonth');
    });
    test('returns empty array if no usages', () => {
        const usages: any[] = [];
        const result = getPeriodUsages(usages, lastMonth, now) as any;
        expect(result).toEqual([]);
    });
});

describe('getCurrentMonthPeriod', () => {
    const now = new Date('2023-05-17');
    test('should return correct start and end dates for the current month period', () => {
        const subscriptionStartDate = new Date('2023-03-15');
        const { thisMonthStartDate, thisMonthEndDate } = getCurrentMonthPeriod(subscriptionStartDate, now);

        const expectedStartDate = new Date('2023-05-15');
        const expectedEndDate = new Date('2023-06-15');

        expect(thisMonthStartDate.toISOString()).toEqual(expectedStartDate.toISOString());
        expect(thisMonthEndDate.toISOString()).toEqual(expectedEndDate.toISOString());
    });
    test('should return correct start and end dates for the current month period when subscription starts at the end of the year', () => {
        const subscriptionStartDate = new Date('2022-12-31');
        const { thisMonthStartDate, thisMonthEndDate } = getCurrentMonthPeriod(subscriptionStartDate, now);

        const expectedStartDate = new Date('2023-05-31');
        const expectedEndDate = new Date('2023-06-31');

        expect(thisMonthStartDate.toISOString()).toEqual(expectedStartDate.toISOString());
        expect(thisMonthEndDate.toISOString()).toEqual(expectedEndDate.toISOString());
    });

    test('should return correct start and end dates for the current month period when subscription starts on the first day of the year', () => {
        const subscriptionStartDate = new Date('2022-01-01');
        const { thisMonthStartDate, thisMonthEndDate } = getCurrentMonthPeriod(subscriptionStartDate, now);

        const expectedStartDate = new Date('2023-05-01');
        const expectedEndDate = new Date('2023-06-01');

        expect(thisMonthStartDate.toISOString()).toEqual(expectedStartDate.toISOString());
        expect(thisMonthEndDate.toISOString()).toEqual(expectedEndDate.toISOString());
    });
});

describe('hasCustomSearchParams', () => {
    it('should return false if using defaults', () => {
        const params: FetchCreatorsFilteredParams = {
            tags: [],
            username: '',
            influencerLocation: [],
            audienceLocation: [],
            resultsPerPageLimit: 10,
            page: 0,
            audience: [null, null],
            views: [null, null],
        };
        expect(hasCustomSearchParams(params)).toEqual(false);
    });
    it('should return true if any params have been changed', () => {
        const params: FetchCreatorsFilteredParams = {
            tags: [],
            username: '',
            influencerLocation: [],
            audienceLocation: [],
            resultsPerPageLimit: 10,
            page: 0,
            audience: [null, null],
            views: [null, null],
        };
        params.tags = [{ tag: 'test' }];
        expect(hasCustomSearchParams(params)).toEqual(true);
        params.tags = [];

        params.username = 'test';
        expect(hasCustomSearchParams(params)).toEqual(true);
        params.username = '';

        params.influencerLocation = [{ location: 'test' }];
        expect(hasCustomSearchParams(params)).toEqual(true);
        params.influencerLocation = [];

        // make sure reset works
        expect(hasCustomSearchParams(params)).toEqual(false);

        params.audienceLocation = [{ location: 'test' }];
        expect(hasCustomSearchParams(params)).toEqual(true);
        params.audienceLocation = [];

        params.resultsPerPageLimit = 20;
        expect(hasCustomSearchParams(params)).toEqual(true);
        params.resultsPerPageLimit = 10;

        params.page = 1;
        expect(hasCustomSearchParams(params)).toEqual(true);
        params.page = 0;

        params.audience = ['1', '2'];
        expect(hasCustomSearchParams(params)).toEqual(true);
        params.audience = [null, null];

        params.views = ['1', '2'];
        expect(hasCustomSearchParams(params)).toEqual(true);
        params.views = [null, null];
    });
});
