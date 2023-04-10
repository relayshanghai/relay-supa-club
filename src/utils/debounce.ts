export const debounce = (fn: any) => {
    let timeout: any = null;
    return (...args: any) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            fn(...args);
        }, 500);
    };
};
