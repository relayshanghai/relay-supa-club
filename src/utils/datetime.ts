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
    { value: 'Sunday', short: 'Sun', number: '01' },
    { value: 'Monday', short: 'Mon', number: '02' },
    { value: 'Tuesday', short: 'Tue', number: '03' },
    { value: 'Wednesday', short: 'Wed', number: '04' },
    { value: 'Thursday', short: 'Thu', number: '05' },
    { value: 'Friday', short: 'Fri', number: '06' },
    { value: 'Saturday', short: 'Sat', number: '07' },
];

const months = [
    { value: 'January', short: 'Jan', number: '01' },
    { value: 'February', short: 'Feb', number: '02' },
    { value: 'March', short: 'Mar', number: '03' },
    { value: 'April', short: 'Apr', number: '04' },
    { value: 'May', short: 'May', number: '05' },
    { value: 'June', short: 'Jun', number: '06' },
    { value: 'July', short: 'Jul', number: '07' },
    { value: 'August', short: 'Aug', number: '08' },
    { value: 'September', short: 'Sep', number: '09' },
    { value: 'October', short: 'Oct', number: '10' },
    { value: 'November', short: 'Nov', number: '11' },
    { value: 'December', short: 'Dec', number: '12' },
];

export const toJSON = (date: string) => {
    const d = new Date(date);

    const { value: month, short: monthShort, number: monthNumber } = months[d.getMonth()];
    const { value: day, short: dayShort, number: dayNumber } = weekDays[d.getDay()];

    return {
        date: d.getDate(),
        day: day,
        dayShort: dayShort,
        dayNum: dayNumber,
        dayIndex: d.getDay(),
        fullYear: d.getFullYear(),
        hours: d.getHours(),
        milliseconds: d.getMilliseconds(),
        minutes: d.getMinutes(),
        month: month,
        monthShort: monthShort,
        monthNum: monthNumber,
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
