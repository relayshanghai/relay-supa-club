export const debounce = (fn: (...args: any[]) => void, waitMs = 500) => {
    let timeout: any = null;
    return (...args: any[]) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            fn(...args);
        }, waitMs);
    };
};
