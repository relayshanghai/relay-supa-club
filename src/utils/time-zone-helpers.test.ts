import { describe, it, expect } from 'vitest';
import {
    getWeekday,
    isWeekend,
    getHours,
    addHours,
    isSameDay,
    weekDayAsNumber,
    getDateStringWithoutTime,
} from './time-zone-helpers';

describe('getWeekday', () => {
    it('gets the weekday based on the passed in timezone', () => {
        const saturday_11_thirty_pm_chicago_time = new Date('2023-09-30T23:30:00-05:00');
        // test 11:30 and 1 am to make sure it's not using UTC
        const weekday = getWeekday(saturday_11_thirty_pm_chicago_time, 'America/Chicago');
        expect(weekday).toEqual('Saturday');

        const saturday_1_am_chicago_time = new Date('2023-09-30T01:00:00-05:00');
        const weekday2 = getWeekday(saturday_1_am_chicago_time, 'America/Chicago');
        expect(weekday2).toEqual('Saturday');
    });
});

describe('getDateStringWithoutTime', () => {
    it('returns the date without the time', () => {
        const date = new Date('2021-07-17T14:00:00.000Z');
        const result = getDateStringWithoutTime(date, 'America/New_York');
        expect(result).toEqual('07-17-2021');
    });
});

describe('weekDayAsNumber', () => {
    it('gets the weekday as a number', () => {
        const saturday_11_thirty_pm_chicago_time = new Date('2023-09-30T23:30:00-05:00');
        const weekday = getWeekday(saturday_11_thirty_pm_chicago_time, 'America/Chicago');
        const weekdayAsNumber = weekDayAsNumber(weekday);
        expect(weekdayAsNumber).toEqual(6);

        const monday_11_thirty_pm_chicago_time = new Date('2023-10-02T23:30:00-05:00');
        const weekday2 = getWeekday(monday_11_thirty_pm_chicago_time, 'America/Chicago');
        const weekdayAsNumber2 = weekDayAsNumber(weekday2);
        expect(weekdayAsNumber2).toEqual(1);

        const errored = () => weekDayAsNumber('asdf');
        expect(errored).toThrowError('Could not find day asdf');
    });
});

describe('isWeekend', () => {
    it('returns true if the date is a weekend', () => {
        const saturday_11_thirty_pm_chicago_time = new Date('2023-09-30T23:30:00-05:00');
        const result = isWeekend(saturday_11_thirty_pm_chicago_time, 'America/Chicago');
        expect(result).toEqual(true);

        const sunday_11_thirty_pm_chicago_time = new Date('2023-10-01T23:30:00-05:00');
        const result2 = isWeekend(sunday_11_thirty_pm_chicago_time, 'America/Chicago');
        expect(result2).toEqual(true);

        const monday_11_thirty_pm_chicago_time = new Date('2023-10-02T23:30:00-05:00');
        const result3 = isWeekend(monday_11_thirty_pm_chicago_time, 'America/Chicago');
        expect(result3).toEqual(false);

        const tuesday_11_thirty_pm_chicago_time = new Date('2023-10-03T23:30:00-05:00');
        const result4 = isWeekend(tuesday_11_thirty_pm_chicago_time, 'America/Chicago');
        expect(result4).toEqual(false);
    });
});

describe('getHours', () => {
    it('gets the hours in 24 hour time', () => {
        const saturday_11_thirty_pm_chicago_time = new Date('2023-09-30T23:30:00-05:00');
        const result = getHours(saturday_11_thirty_pm_chicago_time, 'America/Chicago');
        expect(result).toEqual(23);

        const sunday_11_thirty_pm_chicago_time = new Date('2023-10-01T23:30:00-05:00');

        const result2 = getHours(sunday_11_thirty_pm_chicago_time, 'America/Chicago');
        expect(result2).toEqual(23);

        const monday_11_thirty_pm_chicago_time = new Date('2023-10-02T23:30:00-05:00');
        const result3 = getHours(monday_11_thirty_pm_chicago_time, 'America/Chicago');
        expect(result3).toEqual(23);
    });
});

describe('addHours', () => {
    it('adds hours to a date', () => {
        const date = new Date('2023-10-03T04:30:00.000Z');
        const result = addHours(date, 1);
        expect(result.toISOString()).toEqual('2023-10-03T05:30:00.000Z');
        // add 3
        const result2 = addHours(date, 3);
        expect(result2.toISOString()).toEqual('2023-10-03T07:30:00.000Z');
    });
    it('handles skipping to next day', () => {
        const eleven_pm = new Date('2023-10-02T23:30:00-05:00');
        const result = addHours(eleven_pm, 2);
        const weekday = getWeekday(result, 'America/Chicago');
        expect(weekday).toEqual('Tuesday');

        const eleven_am = new Date('2023-10-02T11:30:00-05:00');
        const result2 = addHours(eleven_am, 2);
        const weekday2 = getWeekday(result2, 'America/Chicago');
        expect(weekday2).toEqual('Monday');
    });
});

describe('isSameDay', () => {
    it('returns true if the dates are the same day and false otherwise', () => {
        const date1 = new Date('2023-10-02T23:30:00-05:00');
        const date2 = new Date('2023-10-02T22:30:00-05:00');

        const result = isSameDay(date1, date2, 'America/Chicago');
        expect(result).toEqual(true);

        const date3 = new Date('2023-10-02T23:30:00-05:00');
        const date4 = new Date('2023-11-02T23:30:00-05:00');

        const result2 = isSameDay(date3, date4, 'America/Chicago');
        expect(result2).toEqual(false);
    });
});
