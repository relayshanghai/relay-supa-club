export const getWeekday = (date: Date, timeZone: string) => {
    return date.toLocaleString('en-US', {
        timeZone,
        weekday: 'long',
    });
};

export const isWeekend = (date: Date, timeZone: string) => {
    const dayOfWeek = getWeekday(date, timeZone);
    return dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
};

export const getHours = (date: Date, timeZone: string) => {
    return parseInt(
        date.toLocaleString('en-US', {
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
