import dayjs from 'dayjs';
export const getDayDifference = (date1: Date, date2: Date) => {
    const d1 = dayjs(date1).set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);
    const d2 = dayjs(date2).set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);

    const diff = d1.diff(d2, 'day');
    return diff;
};
