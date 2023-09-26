import { describe, expect, it } from 'vitest';
import { findNextAvailableDateIfMaxEmailsPerDayMet, findNextBusinessDayTime } from './schedule-emails';

const timeZone = 'America/Chicago';

describe('findNextBusinessDayTime', () => {
    it('findNextBusinessDayTime on Saturday or Sunday', async () => {
        const saturday_september_30th_2pm_chicago_time = new Date('2023-09-30T14:00:00-05:00');

        // confirm test date is a Saturday in Chicago
        const dayOfWeek = saturday_september_30th_2pm_chicago_time.toLocaleString('en-US', {
            timeZone,
            weekday: 'long',
        });
        expect(dayOfWeek).toEqual('Saturday');

        const businessDay = findNextBusinessDayTime(saturday_september_30th_2pm_chicago_time);
        expect(
            businessDay.toLocaleString('en-US', {
                timeZone,
                weekday: 'long',
            }),
        ).toEqual('Monday');
        const hour = businessDay.toLocaleString('en-US', {
            timeZone,
            hour: '2-digit',
            hour12: false,
        });
        expect(parseInt(hour)).toBeGreaterThanOrEqual(9);
        expect(parseInt(hour)).toBeLessThan(17);

        const sunday_september_31st_2pm_chicago_time = new Date('2023-09-31T14:00:00-05:00');

        // confirm test date is a Sunday
        const weekday2 = sunday_september_31st_2pm_chicago_time.toLocaleString('en-US', {
            timeZone,
            weekday: 'long',
        });
        expect(weekday2).toEqual('Sunday');

        const businessDay2 = findNextBusinessDayTime(sunday_september_31st_2pm_chicago_time);
        expect(
            businessDay2.toLocaleString('en-US', {
                timeZone,
                weekday: 'long',
            }),
        ).toEqual('Monday');
        const hour2 = businessDay2.toLocaleString('en-US', {
            timeZone,
            hour: '2-digit',
            hour12: false,
        });
        expect(parseInt(hour2)).toBeGreaterThanOrEqual(9);
        expect(parseInt(hour2)).toBeLessThan(17);
    });
    it('findNextBusinessDayTime on Friday after 5 pm', async () => {
        const friday_september_29th_6pm_chicago_time = new Date('2023-09-29T18:00:00-05:00');

        // confirm test date is a Friday in Chicago
        const dayOfWeek = friday_september_29th_6pm_chicago_time.toLocaleString('en-US', {
            timeZone,
            weekday: 'long',
        });
        expect(dayOfWeek).toEqual('Friday');
    });
    it.skip('findNextBusinessDayTime on Friday before 5 pm', async () => {
        // TODO
    });
});

describe('findNextAvailableDateIfMaxEmailsPerDayMet', () => {
    it('finds the next available date if max emails per day is met', async () => {
        const mondayDate = new Date('2023-09-25T14:00:00-05:00').toISOString();
        const tuesdayDate = new Date('2023-09-26T14:00:00-05:00').toISOString();
        const wednesdayDate = new Date('2023-09-27T14:00:00-05:00').toISOString();
        const outbox = [
            // monday has 3 emails scheduled

            { account: 'test-account', scheduled: mondayDate },
            { account: 'test-account', scheduled: mondayDate },
            { account: 'test-account', scheduled: mondayDate },
            // tuesday has 3 emails scheduled

            { account: 'test-account', scheduled: tuesdayDate },
            { account: 'test-account', scheduled: tuesdayDate },
            { account: 'test-account', scheduled: tuesdayDate },
            // wednesday has 2 emails scheduled

            { account: 'test-account', scheduled: wednesdayDate },
            { account: 'test-account', scheduled: wednesdayDate },
        ];
        const result = findNextAvailableDateIfMaxEmailsPerDayMet(outbox as any, new Date(mondayDate), timeZone, 3);

        const dayOfWeek = result.toLocaleString('en-US', {
            timeZone,
            weekday: 'long',
        });
        expect(dayOfWeek).toEqual('Wednesday');

        const hour = result.toLocaleString('en-US', {
            timeZone,
            hour: '2-digit',
            hour12: false,
        });
        expect(parseInt(hour)).toBeGreaterThanOrEqual(9);
        expect(parseInt(hour)).toBeLessThan(17);
    });
});
