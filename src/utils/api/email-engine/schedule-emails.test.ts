import { describe, expect, it } from 'vitest';
import type { EmailCountPerDayPerStep } from './schedule-emails';
import { findNextAvailableDateIfMaxEmailsPerDayMet, findNextBusinessDayTime, scheduleEmails } from './schedule-emails';
import { getDateStringWithoutTime, getHours, getWeekday, isSameDay } from 'src/utils/time-zone-helpers';
import type { SequenceStep } from '../db';
import { v4 } from 'uuid';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { addHours } from 'date-fns';

const timeZone = 'America/Chicago';
const chicagoOffset = '-05:00';

const byteToMegabyte = (bytes: number) => bytes / 1000000;

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
    // This test serves as a guard in case a similar scenario happens
    // This test should be updated if `findNextBusinessDayTime` gets updated
    // While `findNextBusinessDayTime` properly returns a timestamp at a random hour within the day,
    // an initial outreach email "sent" before 9AM can be possibly be sent on 3PM of the same day instead
    it('Find next available schedule on Monday before 9 am', async () => {
        const friday_september_29th_2pm_chicago_time = new Date(`2023-09-25T02:59:59${chicagoOffset}`);

        const dayOfWeek = getWeekday(friday_september_29th_2pm_chicago_time, timeZone);
        expect(dayOfWeek).toEqual('Monday');

        const businessDay = findNextBusinessDayTime(friday_september_29th_2pm_chicago_time);
        expect(getWeekday(businessDay, timeZone)).toEqual('Monday');
        const hour = getHours(businessDay, timeZone);
        expect(hour).toBeGreaterThanOrEqual(9);
        expect(hour).toBeLessThan(17);

        const expectedDate = new Date(`2023-09-25T14:00:00${chicagoOffset}`);
        expect(isSameDay(businessDay, expectedDate, timeZone)).toEqual(true);
    });
});

describe('findNextAvailableDateIfMaxEmailsPerDayMet', () => {
    it('finds the next available date if max emails per day is met', async () => {
        const mondayDate = new Date(`2023-09-25T14:00:00${chicagoOffset}`);
        const tuesdayDate = new Date(`2023-09-26T14:00:00${chicagoOffset}`);
        const wednesdayDate = new Date(`2023-09-27T14:00:00${chicagoOffset}`);
        const step0Id = v4();

        const emailCountPerDay: EmailCountPerDayPerStep = [
            // monday has 3 emails scheduled
            {
                date: getDateStringWithoutTime(mondayDate, timeZone),
                emails_count: 3,
                step_id: step0Id,
            },
            // tuesday has 3 emails scheduled
            {
                date: getDateStringWithoutTime(tuesdayDate, timeZone),
                emails_count: 3,
                step_id: step0Id,
            },
            // wednesday has 2 emails scheduled
            {
                date: getDateStringWithoutTime(wednesdayDate, timeZone),
                emails_count: 2,
                step_id: step0Id,
            },
        ];

        const result = findNextAvailableDateIfMaxEmailsPerDayMet(step0Id, emailCountPerDay, mondayDate, 3, timeZone);
        const dayOfWeek = getWeekday(result, timeZone);
        expect(dayOfWeek).toEqual('Wednesday');

        const hour = getHours(result, timeZone);
        expect(hour).toBeGreaterThanOrEqual(9);
        expect(hour).toBeLessThan(17);

        const expectedDate = new Date(`2023-09-27T14:00:00${chicagoOffset}`);
        expect(isSameDay(result, expectedDate, timeZone)).toEqual(true);
    });
    it('finds the next available date if max emails per day is met and next day is a weekend and across months', async () => {
        const fridayDate = new Date(`2023-09-29T14:00:00${chicagoOffset}`);
        // confirm it is friday
        expect(getWeekday(new Date(fridayDate), timeZone)).toEqual('Friday');
        const mondayDate = new Date(`2023-10-02T14:00:00${chicagoOffset}`);
        expect(getWeekday(new Date(mondayDate), timeZone)).toEqual('Monday');
        const tuesdayDate = new Date(`2023-10-03T14:00:00${chicagoOffset}`);
        expect(getWeekday(new Date(tuesdayDate), timeZone)).toEqual('Tuesday');

        const step0Id = v4();

        const emailCountPerDay: EmailCountPerDayPerStep = [
            // friday has 3 emails scheduled
            {
                date: getDateStringWithoutTime(fridayDate, timeZone),
                emails_count: 3,
                step_id: step0Id,
            },
            // monday has 3 emails scheduled
            {
                date: getDateStringWithoutTime(mondayDate, timeZone),
                emails_count: 3,
                step_id: step0Id,
            },
            // tuesday has 2 emails scheduled
            {
                date: getDateStringWithoutTime(tuesdayDate, timeZone),
                emails_count: 2,
                step_id: step0Id,
            },
        ];

        const result = findNextAvailableDateIfMaxEmailsPerDayMet(step0Id, emailCountPerDay, fridayDate, 3, timeZone);
        const dayOfWeek = getWeekday(result, timeZone);
        expect(dayOfWeek).toEqual('Tuesday');

        const hour = getHours(result, timeZone);
        expect(hour).toBeGreaterThanOrEqual(9);
        expect(hour).toBeLessThan(17);

        const expectedDate = new Date(`2023-10-03T14:00:00${chicagoOffset}`);
        expect(isSameDay(result, expectedDate, timeZone)).toEqual(true);
    });
    it('Find available slot over weekend', async () => {
        const fridayDate = new Date(`2028-12-29T14:00:00${chicagoOffset}`);
        expect(getWeekday(new Date(fridayDate), timeZone)).toEqual('Friday');

        const mondayDate = new Date(`2029-01-01T18:00:00${chicagoOffset}`);
        expect(getWeekday(new Date(mondayDate), timeZone)).toEqual('Monday');

        const tuesdayDate = new Date(`2029-01-02T14:00:00${chicagoOffset}`);
        expect(getWeekday(new Date(tuesdayDate), timeZone)).toEqual('Tuesday');
        const step0Id = v4();

        const emailCountPerDay: EmailCountPerDayPerStep = [
            // friday has 3 emails scheduled
            {
                date: getDateStringWithoutTime(fridayDate, timeZone),
                emails_count: 3,
                step_id: step0Id,
            },
            // monday has 3 emails scheduled
            {
                date: getDateStringWithoutTime(mondayDate, timeZone),
                emails_count: 3,
                step_id: step0Id,
            },
            // tuesday has 2 emails scheduled
            {
                date: getDateStringWithoutTime(tuesdayDate, timeZone),
                emails_count: 2,
                step_id: step0Id,
            },
        ];

        const result = findNextAvailableDateIfMaxEmailsPerDayMet(step0Id, emailCountPerDay, fridayDate, 3, timeZone);
        const dayOfWeek = getWeekday(result, timeZone);
        expect(dayOfWeek).toEqual('Tuesday');

        const hour = getHours(result, timeZone);
        expect(hour).toBeGreaterThanOrEqual(9);
        expect(hour).toBeLessThan(17);

        const expectedDate = new Date(`2029-01-02T14:00:00${chicagoOffset}`);
        expect(isSameDay(result, expectedDate, timeZone)).toEqual(true);
    });
});

describe('scheduleEmails', () => {
    it('will schedule the outreach and followup emails', () => {
        const step0Id = v4();
        const step1Id = v4();
        const mondayDate = new Date(`2029-01-01T18:10:00${chicagoOffset}`);
        const tuesdayDate = new Date(`2029-01-02T18:10:00${chicagoOffset}`);
        const wednesdayDate = new Date(`2029-01-03T18:10:00${chicagoOffset}`);
        const thursdayDate = new Date(`2029-01-04T18:10:00${chicagoOffset}`);
        const fridayDate = new Date(`2029-01-05T18:10:00${chicagoOffset}`);
        const alreadyScheduledEmails: EmailCountPerDayPerStep = [
            // monday has 3 emails scheduled for step 0 and step 1
            {
                date: getDateStringWithoutTime(mondayDate, timeZone),
                step_id: step0Id,
                emails_count: 3,
            },

            { date: getDateStringWithoutTime(mondayDate, timeZone), step_id: step1Id, emails_count: 3 },

            // tuesday has 3 emails scheduled for step 0 and 2 for step 1
            { date: getDateStringWithoutTime(tuesdayDate, timeZone), step_id: step0Id, emails_count: 3 },

            { date: getDateStringWithoutTime(tuesdayDate, timeZone), step_id: step1Id, emails_count: 2 },

            // thursday already has 3 step 1 emails scheduled
            { date: getDateStringWithoutTime(thursdayDate, timeZone), step_id: step1Id, emails_count: 3 },
        ];
        // expect step 0 to be scheduled on Wednesday and step 1 to be scheduled on Friday
        const steps: SequenceStep[] = [
            {
                id: step0Id,
                wait_time_hours: 0,
                step_number: 0,
            } as SequenceStep,
            {
                id: step1Id,
                wait_time_hours: 24,
                step_number: 1,
            } as SequenceStep,
        ];
        const memoryBefore = process.memoryUsage().heapUsed;

        const { outreachStepInsert, followupEmailInserts } = scheduleEmails(
            steps,
            alreadyScheduledEmails,
            { id: 'influencer-id', sequence_id: 'sequence-id' } as SequenceInfluencerManagerPage,
            'account',
            new Date(`2029-01-01T18:00:00${chicagoOffset}`),
            3,
        );

        const memoryAfter = process.memoryUsage().heapUsed;
        const memoryUsed = byteToMegabyte(memoryAfter - memoryBefore); // should be under 0.35
        expect(memoryUsed).toBeLessThan(0.5);
        // console.log(`Memory used: ${memoryUsed} mb`);
        expect(isSameDay(new Date(outreachStepInsert.emailSendAt ?? ''), new Date(wednesdayDate), timeZone)).toEqual(
            true,
        );
        expect(isSameDay(new Date(followupEmailInserts[0].emailSendAt ?? ''), new Date(fridayDate), timeZone)).toEqual(
            true,
        );
    });
    it('should not use excessive memory', () => {
        const testLength = 1000;
        const step0Id = v4();
        const step1Id = v4();
        const step2Id = v4();
        const initialDate = new Date(`2029-01-01T18:00:00${chicagoOffset}`);
        const steps: SequenceStep[] = [
            {
                id: step0Id,
                wait_time_hours: 0,
                step_number: 0,
            } as SequenceStep,
            {
                id: step1Id,
                wait_time_hours: 24,
                step_number: 1,
            } as SequenceStep,
            {
                id: step2Id,
                wait_time_hours: 48,
                step_number: 2,
            } as SequenceStep,
        ];
        const scheduledEmails: EmailCountPerDayPerStep = [];
        for (let i = 0; i < testLength; i++) {
            for (const step of steps) {
                scheduledEmails.push({
                    date: getDateStringWithoutTime(addHours(initialDate, i * 24), timeZone),
                    // because each day is full, the algorithm will have to iterate through all the days
                    emails_count: 3,
                    step_id: step.id,
                });
            }
        }

        const memoryBefore = process.memoryUsage().heapUsed;
        const { outreachStepInsert, followupEmailInserts } = scheduleEmails(
            steps,
            scheduledEmails,
            { id: 'influencer-id', sequence_id: 'sequence-id' } as SequenceInfluencerManagerPage,
            'account',
            new Date(`2029-01-01T18:00:00${chicagoOffset}`),
            3,
        );

        const memoryAfter = process.memoryUsage().heapUsed;

        const memoryUsed = byteToMegabyte(memoryAfter - memoryBefore);

        // with 1000 days all full, the scheduled day should be in the 1001th day

        const isThousandthDay = isSameDay(
            new Date(outreachStepInsert.emailSendAt ?? ''),
            addHours(initialDate, 1001 * 24),
            timeZone,
        );
        expect(isThousandthDay).toEqual(true);
        expect(followupEmailInserts.length).toEqual(2);

        expect(
            isSameDay(new Date(followupEmailInserts[0].emailSendAt ?? ''), addHours(initialDate, 1002 * 24), timeZone),
        ).toEqual(true);

        expect(
            isSameDay(new Date(followupEmailInserts[1].emailSendAt ?? ''), addHours(initialDate, 1004 * 24), timeZone),
        ).toEqual(true);

        expect(memoryUsed).toBeLessThan(10);
    });
});
