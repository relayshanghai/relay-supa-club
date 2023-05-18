import { describe, expect, test } from 'vitest';
import { getCurrentMonthPeriod, getPeriodUsages } from './usagesHelpers';

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
