/**
 * Return the current timestamp
 */
    export const timestamp = () => new Date().getTime();

/**
 * Return the current iso string
 */
export const now = () => new Date().toISOString();

/**
 * Convert the timestamp to an ISO string
 */
export const toISO = (timestamp: number | string) => new Date(+timestamp).toISOString();

const weekDays = [
    { value: 'Sunday', short: 'Sun' },
    { value: 'Monday', short: 'Mon' },
    { value: 'Tuesday', short: 'Tue' },
    { value: 'Wednesday', short: 'Wed' },
    { value: 'Thursday', short: 'Thu' },
    { value: 'Friday', short: 'Fri' },
    { value: 'Saturday', short: 'Sat' },
];

const months = [
    { value: 'January', short: 'Jan' },
    { value: 'February', short: 'Feb' },
    { value: 'March', short: 'Mar' },
    { value: 'April', short: 'Apr' },
    { value: 'May', short: 'May' },
    { value: 'June', short: 'Jun' },
    { value: 'July', short: 'Jul' },
    { value: 'August', short: 'Aug' },
    { value: 'September', short: 'Sep' },
    { value: 'October', short: 'Oct' },
    { value: 'November', short: 'Nov' },
    { value: 'December', short: 'Dec' },
];

export const toJSON = (date: string) => {
    const d = new Date(date);

    const { value: month, short: monthShort } = months[d.getMonth()];
    const { value: day, short: dayShort } = weekDays[d.getDay()];

    return {
        date: d.getDate(),
        day: day,
        dayShort: dayShort,
        dayIndex: d.getDay(),
        fullYear: d.getFullYear(),
        hours: d.getHours(),
        milliseconds: d.getMilliseconds(),
        minutes: d.getMinutes(),
        month: month,
        monthShort: monthShort,
        monthIndex: d.getMonth(),
        seconds: d.getSeconds(),
        time: d.getTime(),
        timezoneoffset: d.getTimezoneOffset(),
    };
};

export const formatDate = (date: string, format: string) => {
    const d = toJSON(date);

    return Object.entries(d).reduce((o, [k, v]) => {
        return o.replace(`[${k}]`, String(v));
    }, format);
};
