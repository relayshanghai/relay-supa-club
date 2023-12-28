import { useState, useEffect } from 'react';

import type { CacheProvider, Config } from './types';
import createCacheProvider from './cache-provider';

/**
 * Cache provider hook
 */
export default function useCacheProvider<Data = any, Error = any>({
    dbName,
    storeName,
    storageHandler,
    version,
    onError,
}: Config): CacheProvider | undefined {
    const [cacheProvider, setCacheProvider] = useState<CacheProvider>();

    useEffect(() => {
        if (cacheProvider || !dbName) {
            return;
        }
        createCacheProvider<Data, Error>({ dbName, storeName, storageHandler, version, onError }).then(
            (cp) => !cacheProvider && setCacheProvider(() => cp),
        );
    }, [dbName, storeName, storageHandler, version, onError, cacheProvider]);

    return cacheProvider;
}
