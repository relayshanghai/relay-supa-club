// IMPORTANT: Do not put any server-side or client-side specific code in this file. It is used by both.

import { enUS } from 'src/constants';
import { SECONDS_IN_MILLISECONDS } from 'src/constants/conversions';
import type { AccountRole } from 'types';
import { serverLogger } from './logger-server';

export const handleError = (error: any) => {
    if (!error || typeof error !== 'object') {
        return 'Oops! Something went wrong. Try again';
    }
    const { response } = error;
    if (response?.data?.error) {
        return response.data.error;
    }
    if (response?.data?.errors) {
        return `${Object.keys(response.data.errors)[0]} ${response.data.errors[Object.keys(response.data.errors)[0]]}`;
    }
    if (response?.data?.email) {
        return `${Object.keys(response.data)[0]} ${response.data.email[0]}`;
    }
    return 'Oops! Something went wrong. Try again';
};

export function numFormatter(num: number) {
    if (!num) return '-';
    if (num > 999999999) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000 && num < 1000000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num > 999 && num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    if (num <= 999) return num.toString();
    else return num.toString();
}

export function isValidUrl(url: string) {
    const matchpattern =
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
    return matchpattern.test(url);
}

export const chinaFilter = (str: string) => {
    if (!str) return 'N/A';
    const filteredLocations = ['taiwan', 'hong kong'];
    if (filteredLocations.includes(str.toLowerCase())) return `China (${str})`;
    return str;
};

/**
 *
 * @param n is the number to be converted to currency
 * @param curr is the currency to be used
 * @param language is the language to be used
 * @param maximumFractionDigits is the minimum fraction to be used
 * @returns
 */
export const toCurrency = (n: number, maximumFractionDigits = 2, curr = 'USD', language = enUS) =>
    Intl.NumberFormat(language, {
        style: 'currency',
        currency: curr,
        maximumFractionDigits: maximumFractionDigits,
    }).format(n);

export const truncateWithDots = (str: string | undefined | null, maxLength: number) => {
    if (!str) return '';
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
};

/**
 * Accepts one or more Unix epoch timestamps and returns
 * the ISOString representation of the first valid one.
 */
export const unixEpochToISOString = (...timestamps: (number | undefined | null)[]) => {
    const firstValidTimestamp = timestamps.find((ts) => ts != undefined && !Number.isNaN(ts));
    if (typeof firstValidTimestamp !== 'number') {
        return;
    }

    return new Date(firstValidTimestamp * SECONDS_IN_MILLISECONDS).toISOString();
};

export const isAdmin = (user_role?: AccountRole) => {
    if (!user_role) {
        return false;
    }
    const isAdmin = user_role === 'company_owner' || user_role === 'relay_employee' || user_role === 'relay_expert';
    return isAdmin;
};

/** returns true if any of the values passed in are falsy */
export const isMissing = (...values: unknown[]) => values.findIndex((value) => !value) > -1;

export const isRecommendedInfluencer = (recommendedInfluencers: string[], platform: string, user_id: string) =>
    recommendedInfluencers.includes(`${platform}/${user_id}`);

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Returns a random integer between the specified minimum and maximum values.
 * @param min - The minimum value of the range (inclusive).
 * @param max - The maximum value of the range (exclusive).
 * @returns A random integer between the specified minimum and maximum values.
 */
const getRandom = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Merges n arrays by taking a random number of elements from each array until they run empty, and appending them to the output array.
 * @param arrays - An array of arrays to be merged.
 * @returns A new array containing elements from all input arrays, merged in a random order.
 */
export const mixArrays = (arrays: any[][]): any[] => {
    const output: any[] = [];

    while (arrays.some((array) => array.length > 0)) {
        for (const array of arrays) {
            const count = getRandom(3, 5);
            for (let i = 0; i < count; i++) {
                if (array.length) {
                    output.push(array.shift());
                }
            }
        }
    }

    return output;
};

/**
 * Filters an array of PromiseSettledResult objects to get only the fulfilled results and returns their values.
 * @param results - An array of PromiseSettledResult objects to filter.
 * @returns An array of the values of the fulfilled results.
 */
export const getFulfilledData = <T>(results: PromiseSettledResult<T>[]) => {
    const errors = getRejectedData(results);
    if (errors.length && errors.length > 0) {
        serverLogger(`getFulfilledData: ${errors.length} errors. ${JSON.stringify(errors)}`, 'error');
    }
    return results.filter((r): r is PromiseFulfilledResult<T> => r.status === 'fulfilled').map((r) => r.value);
};

/**
 * Filters an array of PromiseSettledResult objects to get only the rejected results and returns their reasons.
 * @param results - An array of PromiseSettledResult objects to filter.
 * @returns An array of the reasons for rejection of the rejected results.
 */
export const getRejectedData = <T>(results: PromiseSettledResult<T>[]) => {
    return results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map((r: any) => {
            return (
                (r.reason.response?.data?.message &&
                    `${r.reason.response.status}: ${r.reason.response?.data?.message}`) ||
                r.reason?.message
            );
        });
};

export const randomNumber = (maxDigits = 8) => Math.round(Math.random() * Math.pow(10, maxDigits));

export const languageCodeToHumanReadable = (code: string) => {
    if (code.includes('en')) {
        return 'English';
    } else if (code.includes('zh')) {
        return 'Chinese';
    } else {
        return code;
    }
};

/**
 * Formats the given Stripe price by dividing it by 100 and rounding it to the nearest whole number.
 *
 * @param price - The price to be formatted.
 * @returns The formatted price as a string.
 */
export const formatStripePrice = (price: number) => (price / 100).toFixed(0);
