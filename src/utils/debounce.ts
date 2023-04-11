export const debounce = (fn: (...args: any[]) => void) => {
    let timeout: any = null;
    return (...args: any[]) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            fn(...args);
        }, 500);
    };
};
