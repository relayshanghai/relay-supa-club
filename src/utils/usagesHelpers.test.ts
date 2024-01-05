import { describe, expect, test, it } from 'vitest';
import { getCurrentMonthPeriod, hasCustomSearchParams } from './usagesHelpers';
import type { FetchCreatorsFilteredParams } from './api/iqdata/transforms';
import type { LocationWeighted } from 'types';

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
    test('should return correct start and end dates for the current month period if already past the day of the month the subscription started', () => {
        // the database query is 'greater than' to start and 'less than or equal to' to end meaning that the day the subscription started is included in the period of the current month.
        // So this should match that by starting the period from the previous month
        const subscriptionStartDate = new Date('2023-03-18');
        const { thisMonthStartDate, thisMonthEndDate } = getCurrentMonthPeriod(subscriptionStartDate, now);

        const expectedStartDate = new Date('2023-04-18');
        const expectedEndDate = new Date('2023-05-18');

        expect(thisMonthStartDate.toISOString()).toEqual(expectedStartDate.toISOString());
        expect(thisMonthEndDate.toISOString()).toEqual(expectedEndDate.toISOString());
    });
    test('should return correct start and end dates for the current month period if on the same day of the month the subscription started', () => {
        const subscriptionStartDate = new Date('2023-03-17');
        const { thisMonthStartDate, thisMonthEndDate } = getCurrentMonthPeriod(subscriptionStartDate, now);

        const expectedStartDate = new Date('2023-04-17');
        const expectedEndDate = new Date('2023-05-17');

        expect(thisMonthStartDate.toISOString()).toEqual(expectedStartDate.toISOString());
        expect(thisMonthEndDate.toISOString()).toEqual(expectedEndDate.toISOString());
    });
    test('should return correct start and end dates for the current month period when subscription starts at the end of the year', () => {
        const subscriptionStartDate = new Date('2022-12-30');
        const { thisMonthStartDate, thisMonthEndDate } = getCurrentMonthPeriod(subscriptionStartDate, now);

        const expectedStartDate = new Date('2023-04-30');
        const expectedEndDate = new Date('2023-05-30');

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
    test('should return correct start and end dates for the current month period crosses a year', () => {
        const subscriptionStartDate = new Date('2022-10-20');
        const now = new Date('2023-1-15');
        const { thisMonthStartDate, thisMonthEndDate } = getCurrentMonthPeriod(subscriptionStartDate, now);

        const expectedStartDate = new Date('2022-12-20');
        const expectedEndDate = new Date('2023-01-20T00:00:00.000Z'); // not sure why, but not including the UTC time here threw it off

        expect(thisMonthStartDate.toISOString()).toEqual(expectedStartDate.toISOString());
        expect(thisMonthEndDate.toISOString()).toEqual(expectedEndDate.toISOString());
    });
    test('should return correct start and end dates for the current month period is after the subscription day and crosses a year', () => {
        const subscriptionStartDate = new Date('2022-10-20');
        const now = new Date('2022-12-25');
        const { thisMonthStartDate, thisMonthEndDate } = getCurrentMonthPeriod(subscriptionStartDate, now);

        const expectedStartDate = new Date('2022-12-20');
        const expectedEndDate = new Date('2023-01-20T00:00:00.000Z');

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

        const location: LocationWeighted = {
            id: 123,
            name: 'test name',
            title: 'test title',
            country: { id: 123, code: 'test code' },
            weight: 1,
            type: ['test type'],
        };
        params.influencerLocation = [location];
        expect(hasCustomSearchParams(params)).toEqual(true);
        params.influencerLocation = [];

        // make sure reset works
        expect(hasCustomSearchParams(params)).toEqual(false);

        params.audienceLocation = [location];
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
