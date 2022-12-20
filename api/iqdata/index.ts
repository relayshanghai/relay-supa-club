import { headers } from 'src/utils/api/constants';

/**
 *
 * @param path will be prefixed by `https://socapi.icu/v2.0/api/`
 * @returns fetch .json() data
 * @description fetcher for IQData API. API docs: https://iqdata.social/docs/api
 */
export const iqDataFetch = async (
    /** will be prefixed by `https://socapi.icu/v2.0/api/` */
    path: string,
    options: RequestInit = {}
) => {
    const res = await fetch('https://socapi.icu/v2.0/api/' + path, {
        ...options,
        headers: {
            ...headers,
            ...options.headers
        }
    });
    return await res.json();
};
