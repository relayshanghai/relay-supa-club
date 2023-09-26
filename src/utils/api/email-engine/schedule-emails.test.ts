import { describe, expect, it } from 'vitest';
import { findNextAvailableDateIfMaxEmailsPerDayMet, findNextBusinessDayTime } from './schedule-emails';
import { getHours, getWeekday } from 'src/utils/time-zone-helpers';

const timeZone = 'America/Chicago';

describe('findNextBusinessDayTime', () => {
    it('findNextBusinessDayTime on Saturday or Sunday', async () => {
        const saturday_september_30th_2pm_chicago_time = new Date('2023-09-30T14:00:00-05:00');

        // confirm test date is a Saturday in Chicago
        const dayOfWeek = getWeekday(saturday_september_30th_2pm_chicago_time, timeZone);
        expect(dayOfWeek).toEqual('Saturday');

        const businessDay = findNextBusinessDayTime(saturday_september_30th_2pm_chicago_time);
        expect(getWeekday(businessDay, timeZone)).toEqual('Monday');
        const hour = getHours(businessDay, timeZone);
        expect(hour).toBeGreaterThanOrEqual(9);
        expect(hour).toBeLessThan(17);

        const sunday_september_31st_2pm_chicago_time = new Date('2023-09-31T14:00:00-05:00');

        // confirm test date is a Sunday
        const weekday2 = getWeekday(sunday_september_31st_2pm_chicago_time, timeZone);
        expect(weekday2).toEqual('Sunday');

        const businessDay2 = findNextBusinessDayTime(sunday_september_31st_2pm_chicago_time);
        expect(getWeekday(businessDay2, timeZone)).toEqual('Monday');
        const hour2 = getHours(businessDay2, timeZone);
        expect(hour2).toBeGreaterThanOrEqual(9);
        expect(hour2).toBeLessThan(17);
    });
    it('findNextBusinessDayTime on Friday after 5 pm', async () => {
        const friday_september_29th_6pm_chicago_time = new Date('2023-09-29T18:00:00-05:00');

        // confirm test date is a Friday in Chicago
        const dayOfWeek = getWeekday(friday_september_29th_6pm_chicago_time, timeZone);
        expect(dayOfWeek).toEqual('Friday');

        const businessDay = findNextBusinessDayTime(friday_september_29th_6pm_chicago_time);
        expect(getWeekday(businessDay, timeZone)).toEqual('Monday');
        const hour = getHours(businessDay, timeZone);
        expect(hour).toBeGreaterThanOrEqual(9);
        expect(hour).toBeLessThan(17);
    });
    it('findNextBusinessDayTime on Friday before 5 pm', async () => {
        const friday_september_29th_2pm_chicago_time = new Date('2023-09-29T14:00:00-05:00');

        // confirm test date is a Friday in Chicago
        const dayOfWeek = getWeekday(friday_september_29th_2pm_chicago_time, timeZone);
        expect(dayOfWeek).toEqual('Friday');

        const businessDay = findNextBusinessDayTime(friday_september_29th_2pm_chicago_time);
        expect(getWeekday(businessDay, timeZone)).toEqual('Friday');
        const hour = getHours(businessDay, timeZone);
        expect(hour).toBeGreaterThanOrEqual(9);
        expect(hour).toBeLessThan(17);
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

        const dayOfWeek = getWeekday(result, timeZone);
        expect(dayOfWeek).toEqual('Wednesday');

        const hour = getHours(result, timeZone);
        expect(hour).toBeGreaterThanOrEqual(9);
        expect(hour).toBeLessThan(17);
    });
});
