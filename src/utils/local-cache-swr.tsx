import { useUser } from '../hooks/use-user';
import type { PropsWithChildren } from 'react';
import { createContext } from 'react';
import type { Cache } from 'swr';
import { SWRConfig } from 'swr';

export const appCacheKey = (userId: string) => 'app-cache-' + userId;

/** see https://swr.vercel.app/docs/advanced/cache#examples
 * This is a custom cache provider that uses `localStorage` as the cache.
 * 
 * @example // use as a provider
 *  <SWRConfig value={{ provider: localStorageProvider }}>
      <App/>
    </SWRConfig>
 */
export function localStorageProvider(userId: string) {
    // check if `localStorage` is available
    if (typeof localStorage === 'undefined') return new Map() as Cache<any>;

    // When initializing, we restore the data from `localStorage` into a map.
    const map = new Map(JSON.parse(localStorage.getItem(appCacheKey(userId)) || '[]'));

    // Before unloading the app, we write back all the data into `localStorage`.
    window.addEventListener('beforeunload', () => {
        const appCache = JSON.stringify(Array.from(map.entries()));
        localStorage.setItem(appCacheKey(userId), appCache);
    });

    // We still use the map for write & read for performance.
    return map as Cache<any>;
}

export const localCacheContext = createContext<Cache<any>>(new Map());

export const LocalCacheProvider = ({ children }: PropsWithChildren) => {
    const { profile } = useUser();
    const userId = profile?.id || '';

    return <SWRConfig value={{ provider: () => localStorageProvider(userId) }}>{children}</SWRConfig>;
};
