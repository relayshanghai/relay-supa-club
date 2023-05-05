import { describe, expect, test } from 'vitest';
import { getCurrentPeriodUsages } from './usagesHelpers';

describe('getCurrentPeriodUsages', () => {
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
        const result = getCurrentPeriodUsages(usages, lastMonth, now) as any;
        expect(result?.length).toEqual(2);
        expect(result?.[0].name).toEqual('justRecently');
        expect(result?.[1].name).toEqual('lastMonth');
    });
    test('returns empty array if no usages', () => {
        const usages: any[] = [];
        const result = getCurrentPeriodUsages(usages, lastMonth, now) as any;
        expect(result).toEqual([]);
    });
});
