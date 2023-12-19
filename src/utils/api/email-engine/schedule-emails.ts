import {
    addHours,
    getHours,
    isWeekend,
    weekDayAsNumber,
    getWeekday,
    getDateStringWithoutTime,
    subtractHours,
} from 'src/utils/time-zone-helpers';
import type { SequenceEmail, SequenceEmailInsert, SequenceStep } from '../db';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { QUICK_SEND_EMAIL_ACCOUNTS } from 'src/constants/employeeContacts';
import { crumb } from 'src/utils/logger-server';

// const MAX_DAILY_SEND = 75; // now split into 25 per (3) steps
const TARGET_TIMEZONE = 'America/Chicago';

const MAX_DAILY_PER_STEP = 25;

/**
 * @example  [7-17-2024]: {
 *    0: 5,     // 5 emails scheduled for step 0
 *    1: 3,     // 3 emails scheduled for step 1
 *    2: 2,     // 2 emails scheduled for step 2
 * } */
type EmailCountPerDay = {
    [date: string]: {
        [step: number]: number;
    };
};

const mapScheduledEmailsToCountPerDay = (
    steps: SequenceStep[],
    scheduledEmails: Pick<SequenceEmail, 'email_send_at' | 'sequence_step_id'>[],
) => {
    const emailCountPerDay: EmailCountPerDay = {};
    scheduledEmails.forEach(({ email_send_at, sequence_step_id }) => {
        if (!email_send_at) {
            return;
        }
        const date = getDateStringWithoutTime(new Date(email_send_at), TARGET_TIMEZONE);
        const step = steps.find((step) => step.id === sequence_step_id);
        if (!step) {
            return;
        }
        if (!emailCountPerDay[date]) {
            emailCountPerDay[date] = {
                0: 0,
                1: 0,
                2: 0,
            };
        }
        emailCountPerDay[date][step.step_number] += 1;
    });
    return emailCountPerDay;
};

export const scheduleEmails = (
    steps: SequenceStep[],
    scheduledEmails: Pick<SequenceEmail, 'email_send_at' | 'sequence_step_id'>[],
    influencer: SequenceInfluencerManagerPage,
    /** email engine account id */
    account: string,
    now = new Date(),
    maxDailyPerStep = MAX_DAILY_PER_STEP,
): { outreachStepInsert: SequenceEmailInsert; followupEmailInserts: SequenceEmailInsert[] } => {
    crumb({ message: `scheduledEmails.length: ${scheduledEmails.length}` });
    const emailCountPerDay = mapScheduledEmailsToCountPerDay(steps, scheduledEmails);
    const followupEmailInserts: SequenceEmailInsert[] = [];
    let outreachStepInsert: SequenceEmailInsert | null = null;
    steps
        .sort((a, b) => a.step_number - b.step_number)
        .forEach(({ wait_time_hours, step_number, id }) => {
            const isOutreachEmail = step_number == 0;

            const previousStepEmailSendAt = isOutreachEmail
                ? null
                : step_number == 1
                ? outreachStepInsert?.email_send_at
                : followupEmailInserts[followupEmailInserts.length - 1]?.email_send_at;

            const sendAt = QUICK_SEND_EMAIL_ACCOUNTS.includes(account)
                ? new Date()
                : calculateSendAt(
                      step_number,
                      wait_time_hours,
                      emailCountPerDay,
                      maxDailyPerStep,
                      previousStepEmailSendAt ? new Date(previousStepEmailSendAt) : now,
                  );

            const date = getDateStringWithoutTime(sendAt, TARGET_TIMEZONE);
            if (!emailCountPerDay[date]) {
                emailCountPerDay[date] = {
                    0: 0,
                    1: 0,
                    2: 0,
                };
            }
            emailCountPerDay[date][step_number] += 1;

            const email: SequenceEmailInsert = {
                sequence_influencer_id: influencer.id,
                sequence_id: influencer.sequence_id,
                sequence_step_id: id,
                email_engine_account_id: account,
                email_send_at: sendAt.toISOString(),

                email_delivery_status: 'Unscheduled',
                email_message_id: '',
            };
            if (isOutreachEmail) {
                outreachStepInsert = email;
            } else {
                followupEmailInserts.push(email);
            }
        });

    if (!outreachStepInsert) {
        throw new Error('Could not find outreach step');
    }

    return { outreachStepInsert, followupEmailInserts };
};

/** waitTimeHours is ideally when this email should be scheduled, but if there are more than (default) 25 emails scheduled for that step for that day, it will find the next available day with less than the max scheduled. Email send times will always be a random hour within Monday-Friday, 9am - 12am US Central Time */
export const calculateSendAt = (
    stepNumber: number,
    waitTimeHours: number,
    emailCountPerDay: EmailCountPerDay,
    maxDailyPerStep: number,
    now = new Date(),
): Date => {
    // console.log('calculateSendAt', stepNumber, waitTimeHours, emailCountPerDay, maxDailyPerStep, now);
    const sendAt = addHours(now, waitTimeHours);
    const targetDate = findNextBusinessDayTime(sendAt); // Get initial targetDate
    const targetDateString = getDateStringWithoutTime(targetDate, TARGET_TIMEZONE);
    if (!emailCountPerDay[targetDateString]) {
        return targetDate;
    }
    if (emailCountPerDay[targetDateString][stepNumber] < maxDailyPerStep) {
        return targetDate;
    }

    return findNextAvailableDateIfMaxEmailsPerDayMet(
        stepNumber,
        emailCountPerDay,
        targetDate,
        maxDailyPerStep,
        TARGET_TIMEZONE,
    );
};

export const findNextAvailableDateIfMaxEmailsPerDayMet = (
    stepNumber: number,
    emailCountPerDay: EmailCountPerDay,
    /** ISO time not Chicago time */
    passedDate: Date,
    maxDailyPerStep: number,
    timeZone = TARGET_TIMEZONE,
) => {
    let targetDate = new Date(passedDate);

    const getTargetDaysEmailCount = (targetDate: Date) =>
        emailCountPerDay[getDateStringWithoutTime(targetDate, timeZone)]
            ? emailCountPerDay[getDateStringWithoutTime(targetDate, timeZone)][stepNumber] ?? 0
            : 0;

    // Check if maximum number of emails for the day has been scheduled
    let targetDaysEmailCount = getTargetDaysEmailCount(targetDate);

    // recursively find the next business day if the max number of emails has been scheduled
    let maxTries = 0;

    while (targetDaysEmailCount >= maxDailyPerStep) {
        if (maxTries > 300) {
            throw new Error('Could not find next available date within 300 tries');
        }
        targetDate = findNextBusinessDayTime(addHours(targetDate, 24), timeZone);
        targetDaysEmailCount = getTargetDaysEmailCount(targetDate);
        maxTries++;
    }

    return targetDate;
};

/** Ensures the date is not on a weekend and is within 9AM to 5PM in the given time zone
 * @param currentDate The date to check. An utc string date
 * @param timeZone The timezone to check against
 * @returns The next business day time
 * @example
 * // returns 2021-07-19T14:00:00.000Z
 * findNextBusinessDayTime(new Date('2021-07-17T14:00:00.000Z'));
 *
 */
export const findNextBusinessDayTime = (currentDate: Date, timeZone = TARGET_TIMEZONE): Date => {
    let targetDate = currentDate;
    let maxTries = 0;
    while (
        isWeekend(targetDate, timeZone) ||
        getHours(targetDate, timeZone) < 9 ||
        getHours(targetDate, timeZone) >= 17
    ) {
        if (maxTries > 500) {
            throw new Error('Could not find next business day within 500 tries'); // cause the random add hours is often wrong so it could generate a lot of tries
        }

        let hoursToAdd = 0;

        if (isWeekend(targetDate, timeZone)) {
            hoursToAdd = weekDayAsNumber(getWeekday(targetDate, timeZone)) === 6 ? 48 : 24;
        } else if (getHours(targetDate, timeZone) < 9) {
            // If the current time is before 9 AM
            // Find the difference from 9 AM
            hoursToAdd = 9 - getHours(targetDate, timeZone);
        } else if (getHours(targetDate, timeZone) >= 17) {
            // If the current time is after 5 PM
            // Find the difference from 5 PM today to 9AM tomorrow
            hoursToAdd = 24 - getHours(targetDate, timeZone) + 9;
        }
        // the randomBusinessHour is to prevent all emails from being sent at the same time

        const randomBusinessHour = Math.floor(Math.random() * 8);

        let targetDayAtNineAm = addHours(targetDate, hoursToAdd);
        const differenceToNineAm = getHours(targetDayAtNineAm, timeZone) - 9;
        if (differenceToNineAm < 0) {
            targetDayAtNineAm = addHours(targetDayAtNineAm, differenceToNineAm);
        } else if (differenceToNineAm > 0) {
            targetDayAtNineAm = subtractHours(targetDayAtNineAm, differenceToNineAm);
        }

        targetDate = addHours(targetDayAtNineAm, randomBusinessHour);

        maxTries++;
    }

    // convert back to ISO
    return targetDate;
};
