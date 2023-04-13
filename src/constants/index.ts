/** no trailing slash e.g. https://app.relay.club or http://localhost:3000 */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';
if (!APP_URL) throw new Error('APP_URL not found');

export const RELAY_DOMAIN = 'relay.club';

// https://www.emailregex.com/
export const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const urlRegex =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

export const IQDATA_MAINTENANCE = process.env.NEXT_PUBLIC_IQDATA_MAINTENANCE === 'true';

export const appCacheDBKey = 'app-cache';
export const appCacheStoreKey = 'app-cache-store';
