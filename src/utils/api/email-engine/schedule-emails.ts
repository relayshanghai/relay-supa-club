import { addHours, getHours, isWeekend, isSameDay, weekDayAsNumber, getWeekday } from 'src/utils/time-zone-helpers';
import type { SequenceEmail } from '../db';

const MAX_DAILY_SEND = 70;
const TARGET_TIMEZONE = 'America/Chicago';

/** waitTimeHours is ideally when this email should be scheduled, but if there are more than (default) 75 emails scheduled for that day, it will find the next available day with less than the max scheduled. Email send times will always be a random hour within Monday-Friday, 9am - 12am US Central Time */
export const calculateSendAt = (
    waitTimeHours: number,
    scheduledEmails: Pick<SequenceEmail, 'email_send_at'>[],
    maxDailySend = MAX_DAILY_SEND,
    now = new Date(),
): Date => {
    const sendAt = addHours(now, waitTimeHours);
    const targetDate = findNextBusinessDayTime(sendAt); // Get initial targetDate

    return findNextAvailableDateIfMaxEmailsPerDayMet(scheduledEmails, targetDate, TARGET_TIMEZONE, maxDailySend);
};

export const findNextAvailableDateIfMaxEmailsPerDayMet = (
    scheduledEmails: Pick<SequenceEmail, 'email_send_at'>[],
    /** ISO time not Chicago time */
    passedDate: Date,
    timeZone = TARGET_TIMEZONE,
    maxDailySend = MAX_DAILY_SEND,
) => {
    let targetDate = new Date(passedDate);

    const getTargetDaysEmails = (targetDate: Date) =>
        scheduledEmails.filter(
            (email) => email.email_send_at && isSameDay(new Date(email.email_send_at), targetDate, timeZone),
        );

    // Check if maximum number of emails for the day has been scheduled
    let targetDaysEmails = getTargetDaysEmails(targetDate);

    // recursively find the next business day if the max number of emails has been scheduled
    let maxTries = 0;

    while (targetDaysEmails.length >= maxDailySend) {
        if (maxTries > 100) {
            throw new Error('Could not find next available date within 100 tries');
        }
        targetDate = findNextBusinessDayTime(addHours(targetDate, 24));
        targetDaysEmails = getTargetDaysEmails(targetDate);
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
            // If the day of the week is Saturday or Sunday
            // Find the difference from Monday and add one day (to reach Monday)
            // Then multiply by 24 to convert days to hours
            const daysUntilMonday = (7 - weekDayAsNumber(getWeekday(targetDate, timeZone))) % 7;
            hoursToAdd = daysUntilMonday * 24;
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
        // if emails can be sent earliest at 9, latest 5(17) then there are 8 possible hours but rarely will we start at 0, so 7
        const randomBusinessHour = Math.floor(Math.random() * 7);
        targetDate = addHours(targetDate, randomBusinessHour + hoursToAdd);

        maxTries++;
    }

    // convert back to ISO
    return targetDate;
};
