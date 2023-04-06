// IMPORTANT: Do not put any server-side or client-side specific code in this file. It is used by both.

import { SECONDS_IN_MILLISECONDS } from 'src/constants/conversions';
import type { AccountRole } from 'types';

export const parseError = (error: any) => {
    if (!error) {
        return new Error('undefined error');
    }
    if (error.message) {
        if ('stack' in error) return error;
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return JSON.stringify(error);
};

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

export const toCurrency = (n: number, curr = 'USD', LanguageFormat?: string) =>
    Intl.NumberFormat(LanguageFormat, {
        style: 'currency',
        currency: curr,
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
