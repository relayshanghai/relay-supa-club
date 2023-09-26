import { addHours, getHours, isWeekend, isSameDay } from 'src/utils/time-zone-helpers';
import { getOutbox } from '.';
import type { OutboxGetMessage } from 'types/email-engine/outbox-get';

const MAX_DAILY_SEND = 75;
const TARGET_TIMEZONE = 'America/Chicago';

/** waitTimeHours is ideally when this email should be scheduled, but if there are more than (default) 75 emails scheduled for that day, it will find the next available day with less than the max scheduled. Email send times will always be within Monday-Friday, 9am - 12am US Central Time */
export const calculateSendAt = async (
    account: string,
    waitTimeHours: number,
    maxDailySend = MAX_DAILY_SEND,
    now = new Date(),
): Promise<Date> => {
    const sendAt = new Date(now);
    sendAt.setTime(sendAt.getTime() + waitTimeHours * 60 * 60 * 1000);
    const targetDate = findNextBusinessDayTime(sendAt); // Get initial targetDate

    const outbox = await getOutbox();

    // Get all emails scheduled for the day for the account
    const outboxEmails = outbox.filter((email) => email.account === account);

    return findNextAvailableDateIfMaxEmailsPerDayMet(outboxEmails, targetDate, TARGET_TIMEZONE, maxDailySend);
};

export const findNextAvailableDateIfMaxEmailsPerDayMet = (
    outboxEmails: OutboxGetMessage[],
    /** ISO time not Chicago time */
    passedDate: Date,
    timeZone = TARGET_TIMEZONE,
    maxDailySend = MAX_DAILY_SEND,
) => {
    let targetDate = new Date(passedDate);

    const getTargetDaysEmails = (targetDate: Date) =>
        outboxEmails.filter((email) => isSameDay(new Date(email.scheduled), targetDate, timeZone));

    // Check if maximum number of emails for the day has been scheduled
    let targetDaysEmails = getTargetDaysEmails(targetDate);

    // recursively find the next business day if the max number of emails has been scheduled
    let maxTries = 0;

    while (maxTries < 50 && targetDaysEmails.length >= maxDailySend) {
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
        (maxTries < 100 && isWeekend(targetDate, timeZone)) ||
        getHours(targetDate, timeZone) < 9 ||
        getHours(targetDate, timeZone) >= 17
    ) {
        let hoursToAdd = 0;

        if (isWeekend(targetDate, timeZone)) {
            // If the day of the week is Saturday or Sunday
            // Find the difference from Monday and add one day (to reach Monday)
            // Then multiply by 24 to convert days to hours, and add 9 to target 9 AM
            const daysUntilMonday = (7 - targetDate.getDay()) % 7;
            hoursToAdd = daysUntilMonday * 24 + 9;
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
        // if emails can be sent earliest at 9, latest 5(17) then there are 8 possible hours
        const randomBusinessHour = Math.floor(Math.random() * 8);
        targetDate = addHours(targetDate, randomBusinessHour + hoursToAdd);

        maxTries++;
    }

    // convert back to ISO
    return targetDate;
};
