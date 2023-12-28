/** Even though our main domain has changed to boostbot.ai, our employee use `company` table row was created with this name, and that's what this is used to check for*/
export const LEGACY_RELAY_DOMAIN = 'relay.club';
/** boostbot.ai */
export const BOOSTBOT_DOMAIN = 'boostbot.ai';

// https://www.emailregex.com/
export const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const urlRegex =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

export const IQDATA_MAINTENANCE = process.env.NEXT_PUBLIC_IQDATA_MAINTENANCE === 'true';

export const appCacheDBKey = (userId?: string) => (userId ? `app-cache-${userId}` : 'app-cache');
export const appCacheStoreName = 'app-cache-store';
export const cacheVersion = 6;
export const isDev = () => process.env.NODE_ENV === 'development';
