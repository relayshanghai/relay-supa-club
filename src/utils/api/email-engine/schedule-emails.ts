import {
    addHours,
    getHours,
    isWeekend,
    weekDayAsNumber,
    getWeekday,
    getDateStringWithoutTime,
    subtractHours,
} from 'src/utils/time-zone-helpers';
import type { SequenceEmailInsert, SequenceStep } from '../db';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { QUICK_SEND_EMAIL_ACCOUNTS } from 'src/constants/employeeContacts';
import { crumb } from 'src/utils/logger-server';

// const MAX_DAILY_SEND = 75; // now split into 17 per (4) steps
const TARGET_TIMEZONE = 'America/Chicago';

const MAX_DAILY_PER_STEP = 17;

export type EmailCountPerDayPerStep = {
    /** formatted like 2023-12-25 YYYY-MM-DD */
    date: string;
    emails_count: number;
    step_id: string;
}[];

const getEmailCountPerDayPerStep = (scheduledEmails: EmailCountPerDayPerStep, stepId: string, day: string) => {
    return scheduledEmails.find(({ step_id, date }) => step_id === stepId && date === day);
};

export const scheduleEmails = (
    steps: SequenceStep[],
    scheduledEmails: EmailCountPerDayPerStep,
    influencer: SequenceInfluencerManagerPage,
    /** email engine account id */
    account: string,
    now = new Date(),
    maxDailyPerStep = MAX_DAILY_PER_STEP,
): { outreachStepInsert: SequenceEmailInsert; followupEmailInserts: SequenceEmailInsert[] } => {
    const findPreviousStepEmailSendAt = (isOutreachEmail: boolean, stepNumber: number) =>
        isOutreachEmail
            ? null
            : stepNumber == 1
            ? outreachStepInsert?.email_send_at
            : followupEmailInserts[followupEmailInserts.length - 1]?.email_send_at;

    const incrementEmailCountPerDayPerStep = (stepId: string, day: string) => {
        const emailCountPerDayPerStep = getEmailCountPerDayPerStep(scheduledEmails, stepId, day);
        if (emailCountPerDayPerStep) {
            emailCountPerDayPerStep.emails_count++;
        } else {
            scheduledEmails.push({
                step_id: stepId,
                date: day,
                emails_count: 1,
            });
        }
    };

    crumb({ message: `scheduledEmails.length: ${scheduledEmails.length}` });
    const followupEmailInserts: SequenceEmailInsert[] = [];
    let outreachStepInsert: SequenceEmailInsert | null = null;
    steps
        .sort((a, b) => a.step_number - b.step_number)
        .forEach(({ wait_time_hours, step_number, id }) => {
            const isOutreachEmail = step_number == 0;

            const previousStepEmailSendAt = findPreviousStepEmailSendAt(isOutreachEmail, step_number);

            const sendAt = QUICK_SEND_EMAIL_ACCOUNTS.includes(account)
                ? new Date()
                : calculateSendAt(
                      id,
                      wait_time_hours,
                      scheduledEmails,
                      maxDailyPerStep,
                      previousStepEmailSendAt ? new Date(previousStepEmailSendAt) : now,
                  );

            incrementEmailCountPerDayPerStep(id, getDateStringWithoutTime(sendAt, TARGET_TIMEZONE));

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
    stepId: string,
    waitTimeHours: number,
    emailCountPerDay: EmailCountPerDayPerStep,
    maxDailyPerStep: number,
    now = new Date(),
    timeZone = TARGET_TIMEZONE,
): Date => {
    const sendAt = addHours(now, waitTimeHours);
    const targetDate = findNextBusinessDayTime(sendAt); // Get initial targetDate
    const initialEmailCount =
        getEmailCountPerDayPerStep(emailCountPerDay, stepId, getDateStringWithoutTime(targetDate, timeZone))
            ?.emails_count || 0;

    if (initialEmailCount < maxDailyPerStep) {
        return targetDate;
    }

    return findNextAvailableDateIfMaxEmailsPerDayMet(stepId, emailCountPerDay, targetDate, maxDailyPerStep, timeZone);
};

export const findNextAvailableDateIfMaxEmailsPerDayMet = (
    stepId: string,
    emailCountPerDay: EmailCountPerDayPerStep,
    /** ISO time not Chicago time */
    passedDate: Date,
    maxDailyPerStep: number,
    timeZone = TARGET_TIMEZONE,
) => {
    let targetDate = new Date(passedDate);

    // Check if maximum number of emails for the day has been scheduled
    let targetDaysEmailCount =
        getEmailCountPerDayPerStep(emailCountPerDay, stepId, getDateStringWithoutTime(targetDate, timeZone))
            ?.emails_count || 0;

    // recursively find the next business day if the max number of emails has been scheduled
    let maxTries = 0;

    while (targetDaysEmailCount >= maxDailyPerStep) {
        if (maxTries > 1000) {
            throw new Error('Could not find next available date within 300 tries');
        }
        targetDate = findNextBusinessDayTime(addHours(targetDate, 24), timeZone);
        targetDaysEmailCount =
            getEmailCountPerDayPerStep(emailCountPerDay, stepId, getDateStringWithoutTime(targetDate, timeZone))
                ?.emails_count || 0;
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
