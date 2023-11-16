import { useCacheProvider } from 'src/utils/cache-provider';
import { SWRConfig } from 'swr';
import { appCacheDBKey, appCacheStoreKey } from 'src/constants';
import type { FC, PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { clientLogger } from './logger-client';

export const CacheProvider: FC<PropsWithChildren> = ({ children }) => {
    useEffect(() => {
        localStorage.removeItem(appCacheDBKey); // get rid of our previous localStorage cache. We can remove this line after a few weeks
    }, []);
    const cacheProvider = useCacheProvider({
        dbName: appCacheDBKey,
        storeName: appCacheStoreKey,
    });

    clientLogger('cacheProvider');

    if (!cacheProvider) {
        return <>Hello from Ellie!</>;
    }
    return <SWRConfig value={{ provider: cacheProvider }}>{children}</SWRConfig>;
};
