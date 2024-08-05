export const serializeQuery = (obj: any) => {
    return '?' + new URLSearchParams(obj).toString();
};
