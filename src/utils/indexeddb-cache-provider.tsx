import { useCacheProvider } from 'src/utils/cache-provider';
import { SWRConfig } from 'swr';
import { appCacheDBKey, appCacheStoreKey } from 'src/constants';
import type { FC, PropsWithChildren } from 'react';

export const CacheProvider: FC<PropsWithChildren> = ({ children }) => {
    const cacheProvider = useCacheProvider({
        dbName: appCacheDBKey,
        storeName: appCacheStoreKey,
    });

    return <SWRConfig value={{ provider: cacheProvider ?? (() => new Map()) }}>{children}</SWRConfig>;
};
