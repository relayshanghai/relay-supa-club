import { describe, expect, it } from 'vitest';
import { findNextAvailableDateIfMaxEmailsPerDayMet, findNextBusinessDayTime } from './schedule-emails';
import { getHours, getWeekday, isSameDay } from 'src/utils/time-zone-helpers';

const timeZone = 'America/Chicago';
const chicagoOffset = '-05:00';

describe('findNextBusinessDayTime', () => {
    it('findNextBusinessDayTime on Saturday or Sunday', async () => {
        const saturday_september_30th_2pm_chicago_time = new Date(`2023-09-30T14:00:00${chicagoOffset}`);

        // confirm test date is a Saturday in Chicago
        const dayOfWeek = getWeekday(saturday_september_30th_2pm_chicago_time, timeZone);
        expect(dayOfWeek).toEqual('Saturday');

        const businessDay = findNextBusinessDayTime(saturday_september_30th_2pm_chicago_time);
        expect(getWeekday(businessDay, timeZone)).toEqual('Monday');
        const hour = getHours(businessDay, timeZone);
        expect(hour).toBeGreaterThanOrEqual(9);
        expect(hour).toBeLessThan(17);

        const expectedDate = new Date(`2023-10-02T14:00:00${chicagoOffset}`);
        expect(isSameDay(businessDay, expectedDate, timeZone)).toEqual(true);

        const sunday_september_31st_2pm_chicago_time = new Date(`2023-09-31T14:00:00${chicagoOffset}`);

        // confirm test date is a Sunday
        const weekday2 = getWeekday(sunday_september_31st_2pm_chicago_time, timeZone);
        expect(weekday2).toEqual('Sunday');

        const businessDay2 = findNextBusinessDayTime(sunday_september_31st_2pm_chicago_time);
        expect(getWeekday(businessDay2, timeZone)).toEqual('Monday');
        const hour2 = getHours(businessDay2, timeZone);
        expect(hour2).toBeGreaterThanOrEqual(9);
        expect(hour2).toBeLessThan(17);

        const expectedDate2 = new Date(`2023-10-02T14:00:00${chicagoOffset}`);
        expect(isSameDay(businessDay2, expectedDate2, timeZone)).toEqual(true);
    });
    it('findNextBusinessDayTime on Friday after 5 pm', async () => {
        const friday_september_29th_6pm_chicago_time = new Date(`2023-09-29T18:00:00${chicagoOffset}`);

        // confirm test date is a Friday in Chicago
        const dayOfWeek = getWeekday(friday_september_29th_6pm_chicago_time, timeZone);
        expect(dayOfWeek).toEqual('Friday');

        const businessDay = findNextBusinessDayTime(friday_september_29th_6pm_chicago_time);
        expect(getWeekday(businessDay, timeZone)).toEqual('Monday');
        const hour = getHours(businessDay, timeZone);
        expect(hour).toBeGreaterThanOrEqual(9);
        expect(hour).toBeLessThan(17);

        const expectedDate = new Date(`2023-10-02T18:00:00${chicagoOffset}`);
        expect(isSameDay(businessDay, expectedDate, timeZone)).toEqual(true);
    });
    it('findNextBusinessDayTime on Friday before 5 pm', async () => {
        const friday_september_29th_2pm_chicago_time = new Date(`2023-09-29T14:00:00${chicagoOffset}`);

        // confirm test date is a Friday in Chicago
        const dayOfWeek = getWeekday(friday_september_29th_2pm_chicago_time, timeZone);
        expect(dayOfWeek).toEqual('Friday');

        const businessDay = findNextBusinessDayTime(friday_september_29th_2pm_chicago_time);
        expect(getWeekday(businessDay, timeZone)).toEqual('Friday');
        const hour = getHours(businessDay, timeZone);
        expect(hour).toBeGreaterThanOrEqual(9);
        expect(hour).toBeLessThan(17);

        const expectedDate = new Date(`2023-09-29T14:00:00${chicagoOffset}`);
        expect(isSameDay(businessDay, expectedDate, timeZone)).toEqual(true);
    });
});

describe('findNextAvailableDateIfMaxEmailsPerDayMet', () => {
    it('finds the next available date if max emails per day is met', async () => {
        const mondayDate = new Date(`2023-09-25T14:00:00${chicagoOffset}`).toISOString();
        const tuesdayDate = new Date(`2023-09-26T14:00:00${chicagoOffset}`).toISOString();
        const wednesdayDate = new Date(`2023-09-27T14:00:00${chicagoOffset}`).toISOString();
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

        const expectedDate = new Date(`2023-09-27T14:00:00${chicagoOffset}`);
        expect(isSameDay(result, expectedDate, timeZone)).toEqual(true);
    });
    it('finds the next available date if max emails per day is met and next day is a weekend and across months', async () => {
        const fridayDate = new Date(`2023-09-29T14:00:00${chicagoOffset}`).toISOString();
        // confirm it is friday
        expect(getWeekday(new Date(fridayDate), timeZone)).toEqual('Friday');
        const mondayDate = new Date(`2023-10-02T14:00:00${chicagoOffset}`).toISOString();
        expect(getWeekday(new Date(mondayDate), timeZone)).toEqual('Monday');
        const tuesdayDate = new Date(`2023-10-03T14:00:00${chicagoOffset}`).toISOString();
        expect(getWeekday(new Date(tuesdayDate), timeZone)).toEqual('Tuesday');
        const outbox = [
            // monday has 3 emails scheduled

            { account: 'test-account', scheduled: fridayDate },
            { account: 'test-account', scheduled: fridayDate },
            { account: 'test-account', scheduled: fridayDate },
            // tuesday has 3 emails scheduled

            { account: 'test-account', scheduled: mondayDate },
            { account: 'test-account', scheduled: mondayDate },
            { account: 'test-account', scheduled: mondayDate },
            // wednesday has 2 emails scheduled

            { account: 'test-account', scheduled: tuesdayDate },
            { account: 'test-account', scheduled: tuesdayDate },
        ];
        const result = findNextAvailableDateIfMaxEmailsPerDayMet(outbox as any, new Date(mondayDate), timeZone, 3);
        const dayOfWeek = getWeekday(result, timeZone);
        expect(dayOfWeek).toEqual('Tuesday');

        const hour = getHours(result, timeZone);
        expect(hour).toBeGreaterThanOrEqual(9);
        expect(hour).toBeLessThan(17);

        const expectedDate = new Date(`2023-10-03T14:00:00${chicagoOffset}`);
        expect(isSameDay(result, expectedDate, timeZone)).toEqual(true);
    });

    it('Find available slot but skip one day', async () => {
        const fridayDate = new Date(`2028-12-29T14:00:00${chicagoOffset}`).toISOString();
        expect(getWeekday(new Date(fridayDate), timeZone)).toEqual('Friday');

        const mondayDate = new Date(`2029-01-01T18:00:00${chicagoOffset}`).toISOString();
        expect(getWeekday(new Date(mondayDate), timeZone)).toEqual('Monday');

        const tuesdayDate = new Date(`2029-01-02T14:00:00${chicagoOffset}`).toISOString();
        expect(getWeekday(new Date(tuesdayDate), timeZone)).toEqual('Tuesday');

        const outbox = [
            // monday has 3 emails scheduled
            { account: 'test-account', scheduled: fridayDate },
            { account: 'test-account', scheduled: fridayDate },
            { account: 'test-account', scheduled: fridayDate },

            // tuesday has 3 emails scheduled
            { account: 'test-account', scheduled: mondayDate },
            { account: 'test-account', scheduled: mondayDate },
            { account: 'test-account', scheduled: mondayDate },

            // wednesday has 2 emails scheduled
            { account: 'test-account', scheduled: tuesdayDate },
            { account: 'test-account', scheduled: tuesdayDate },
        ];
        const result = findNextAvailableDateIfMaxEmailsPerDayMet(outbox as any, new Date(mondayDate), timeZone, 3);
        const dayOfWeek = getWeekday(result, timeZone);
        expect(dayOfWeek).toEqual('Wednesday');

        const hour = getHours(result, timeZone);
        expect(hour).toBeGreaterThanOrEqual(9);
        expect(hour).toBeLessThan(17);

        const expectedDate = new Date(`2029-01-03T14:00:00${chicagoOffset}`);
        expect(isSameDay(result, expectedDate, timeZone)).toEqual(true);
    });
});
