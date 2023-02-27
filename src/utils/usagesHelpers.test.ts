import { getCurrentPeriodUsages, SimpleUsage } from './usagesHelpers';

describe('getCurrentPeriodUsages', () => {
    test('should return the correct number of usages', () => {
        const usages: SimpleUsage[] = [
            {
                type: 'search',
                created_at: '2021-08-04T20:44:51.000Z',
            },
        ];
        const result = getCurrentPeriodUsages(
            usages,
            'search',
            new Date('2021-08-04T20:44:51.000Z'),
            new Date('2021-08-04T20:44:51.000Z'),
        );
        expect(result).toEqual(1);
    });
});
