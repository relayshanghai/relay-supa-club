import { describe, expect, it } from 'vitest';
import { findNextAvailableDateIfMaxEmailsPerDayMet, findNextBusinessDayTime, scheduleEmails } from './schedule-emails';
import { getDateStringWithoutTime, getHours, getWeekday, isSameDay } from 'src/utils/time-zone-helpers';
import type { SequenceEmail, SequenceStep } from '../db';
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

        const emailCountPerDay = {
            // monday has 3 emails scheduled
            [getDateStringWithoutTime(mondayDate, timeZone)]: { 1: 3 },
            // tuesday has 3 emails scheduled
            [getDateStringWithoutTime(tuesdayDate, timeZone)]: { 1: 3 },
            // wednesday has 2 emails scheduled
            [getDateStringWithoutTime(wednesdayDate, timeZone)]: { 1: 2 },
        };
        const result = findNextAvailableDateIfMaxEmailsPerDayMet(1, emailCountPerDay, mondayDate, 3, timeZone);
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

        const emailCountPerDay = {
            // friday has 3 emails scheduled
            [getDateStringWithoutTime(fridayDate, timeZone)]: { 1: 3 },
            // monday has 3 emails scheduled
            [getDateStringWithoutTime(mondayDate, timeZone)]: { 1: 3 },
            // tuesday has 2 emails scheduled
            [getDateStringWithoutTime(tuesdayDate, timeZone)]: { 1: 2 },
        };

        const result = findNextAvailableDateIfMaxEmailsPerDayMet(1, emailCountPerDay, fridayDate, 3, timeZone);
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

        const emailCountPerDay = {
            // friday has 3 emails scheduled
            [getDateStringWithoutTime(fridayDate, timeZone)]: { 1: 3 },
            // monday has 3 emails scheduled
            [getDateStringWithoutTime(mondayDate, timeZone)]: { 1: 3 },
            // tuesday has 2 emails scheduled
            [getDateStringWithoutTime(tuesdayDate, timeZone)]: { 1: 2 },
        };

        const result = findNextAvailableDateIfMaxEmailsPerDayMet(1, emailCountPerDay, fridayDate, 3, timeZone);
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
        const mondayDate = new Date(`2029-01-01T18:10:00${chicagoOffset}`).toISOString();
        const tuesdayDate = new Date(`2029-01-02T18:10:00${chicagoOffset}`).toISOString();
        const wednesdayDate = new Date(`2029-01-03T18:10:00${chicagoOffset}`).toISOString();
        const thursdayDate = new Date(`2029-01-04T18:10:00${chicagoOffset}`).toISOString();
        const fridayDate = new Date(`2029-01-05T18:10:00${chicagoOffset}`).toISOString();
        const alreadyScheduledEmails: Pick<SequenceEmail, 'email_send_at' | 'sequence_step_id'>[] = [
            // monday has 3 emails scheduled for step 0 and step 1
            { email_send_at: mondayDate, sequence_step_id: step0Id },
            { email_send_at: mondayDate, sequence_step_id: step0Id },
            { email_send_at: mondayDate, sequence_step_id: step0Id },

            { email_send_at: mondayDate, sequence_step_id: step1Id },
            { email_send_at: mondayDate, sequence_step_id: step1Id },
            { email_send_at: mondayDate, sequence_step_id: step1Id },
            // tuesday has 3 emails scheduled for step 0 and 2 for step 1
            { email_send_at: tuesdayDate, sequence_step_id: step0Id },
            { email_send_at: tuesdayDate, sequence_step_id: step0Id },
            { email_send_at: tuesdayDate, sequence_step_id: step0Id },

            { email_send_at: tuesdayDate, sequence_step_id: step1Id },
            { email_send_at: tuesdayDate, sequence_step_id: step1Id },

            // thursday already has 3 step 1 emails scheduled
            { email_send_at: thursdayDate, sequence_step_id: step1Id },
            { email_send_at: thursdayDate, sequence_step_id: step1Id },
            { email_send_at: thursdayDate, sequence_step_id: step1Id },
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
        expect(isSameDay(new Date(outreachStepInsert.email_send_at ?? ''), new Date(wednesdayDate), timeZone)).toEqual(
            true,
        );
        expect(
            isSameDay(new Date(followupEmailInserts[0].email_send_at ?? ''), new Date(fridayDate), timeZone),
        ).toEqual(true);
    });
    it('should not use excessive memory', () => {
        const testLength = 10000;
        const step0Id = v4();
        const step1Id = v4();
        const step2Id = v4();
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
                wait_time_hours: 24,
                step_number: 2,
            } as SequenceStep,
        ];
        const scheduledEmails: Pick<SequenceEmail, 'email_send_at' | 'sequence_step_id'>[] = [];
        for (let i = 0; i < testLength; i++) {
            scheduledEmails.push({
                email_send_at: addHours(
                    new Date(`2029-01-01T18:10:00${chicagoOffset}`),
                    i + Math.floor(Math.random() * 2),
                ).toISOString(),
                sequence_step_id: steps[i % 3].id,
            });
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
        // console.log(`Memory used: ${memoryUsed} mb`);

        expect(outreachStepInsert).toBeTruthy();
        expect(followupEmailInserts.length).toEqual(2);

        expect(memoryUsed).toBeLessThan(20);
    });
});
