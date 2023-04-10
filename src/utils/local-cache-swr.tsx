import type { PropsWithChildren } from 'react';
import { createContext } from 'react';
import type { Cache } from 'swr';
import { SWRConfig } from 'swr';
import { clientLogger } from './logger-client';

export const appCacheKey = 'app-cache';

/** see https://swr.vercel.app/docs/advanced/cache#examples
 * This is a custom cache provider that uses `localStorage` as the cache.
 * 
 * @example // use as a provider
 *  <SWRConfig value={{ provider: localStorageProvider }}>
      <App/>
    </SWRConfig>
 */
export function localStorageProvider() {
    // check if `localStorage` is available
    if (typeof localStorage === 'undefined') return new Map() as Cache<any>;

    // When initializing, we restore the data from `localStorage` into a map.
    const map = new Map(JSON.parse(localStorage.getItem(appCacheKey) || '[]'));

    // Before unloading the app, we write back all the data into `localStorage`.
    window.addEventListener('beforeunload', () => {
        const appCache = JSON.stringify(Array.from(map.entries()));
        try {
            localStorage.setItem(appCacheKey, appCache);
        } catch (error) {
            clientLogger(error, 'error');
        }
    });

    // We still use the map for write & read for performance.
    return map as Cache<any>;
}

export const localCacheContext = createContext<Cache<any>>(new Map());

export const LocalCacheProvider = ({ children }: PropsWithChildren) => {
    return <SWRConfig value={{ provider: localStorageProvider }}>{children}</SWRConfig>;
};
