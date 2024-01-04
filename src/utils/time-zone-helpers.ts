import { enUS } from 'src/constants';

/**
 * @param timeZone passed to Date().toLocalestring() timeZone option, which is an IANA location. See `timeZone` at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @returns "Monday"|...|"Sunday"
 */
export const getWeekday = (date: Date, timeZone: string) => {
    return date.toLocaleString(enUS, {
        timeZone,
        weekday: 'long',
    });
};

/**
 * @example getDayWithoutTime(new Date('2021-07-17T14:00:00.000Z'), 'America/New_York') // returns 2021-07-17
 */
export const getDateStringWithoutTime = (date: Date, timeZone: string) => {
    const year = date.toLocaleString('en', { timeZone, year: 'numeric' });
    const month = date.toLocaleString('en', { timeZone, month: '2-digit' });
    const day = date.toLocaleString('en', { timeZone, day: '2-digit' });

    return `${year}-${month}-${day}`;
};

export const weekDayAsNumber = (day: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const found = days.indexOf(day);
    if (found === -1) {
        throw new Error(`Could not find day ${day}`);
    }
    return found;
};

/**
 * @param timeZone passed to Date().toLocalestring() timeZone option, which is an IANA location. See `timeZone` at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 */
export const isWeekend = (date: Date, timeZone: string) => {
    const dayOfWeek = getWeekday(date, timeZone);
    return dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
};

/**
 * @param timeZone passed to Date().toLocalestring() timeZone option, which is an IANA location. See `timeZone` at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @returns 0|...|23
 */
export const getHours = (date: Date, timeZone: string) => {
    return parseInt(
        date.toLocaleString(enUS, {
            timeZone,
            hour: '2-digit',
            hour12: false,
        }),
    );
};

export const addHours = (date: Date, hours: number) => {
    const newDate = new Date(date);
    newDate.setTime(newDate.getTime() + hours * 60 * 60 * 1000);
    return newDate;
};

export const subtractHours = (date: Date, hours: number) => {
    const newDate = new Date(date);
    newDate.setTime(newDate.getTime() - hours * 60 * 60 * 1000);
    return newDate;
};

/**
 * @param timeZone passed to Date().toLocalestring() timeZone option, which is an IANA location. See `timeZone` at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 */
export const isSameDay = (date1: Date, date2: Date, timeZone: string) => {
    return (
        date1.toLocaleString(enUS, {
            timeZone,
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        }) ===
        date2.toLocaleString(enUS, {
            timeZone,
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        })
    );
};
