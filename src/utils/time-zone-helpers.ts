/**
 * @param timeZone passed to Date().toLocalestring() timeZone option, which is an IANA location. See `timeZone` at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @returns "Monday"|...|"Sunday"
 */
export const getWeekday = (date: Date, timeZone: string) => {
    return date.toLocaleString('en-US', {
        timeZone,
        weekday: 'long',
    });
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
        date.toLocaleString('en-US', {
            timeZone,
            hour: '2-digit',
            hour12: false,
        }),
    );
};

/**
 * @param timeZone passed to Date().toLocalestring() timeZone option, which is an IANA location. See `timeZone` at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 */
export const addHours = (date: Date, hours: number) => {
    const newDate = new Date(date);
    newDate.setTime(newDate.getTime() + hours * 60 * 60 * 1000);
    return newDate;
};

/**
 * @param timeZone passed to Date().toLocalestring() timeZone option, which is an IANA location. See `timeZone` at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 */
export const isSameDay = (date1: Date, date2: Date, timeZone: string) => {
    return (
        date1.toLocaleString('en-US', {
            timeZone,
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        }) ===
        date2.toLocaleString('en-US', {
            timeZone,
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        })
    );
};
