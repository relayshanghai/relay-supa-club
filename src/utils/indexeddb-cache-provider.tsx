import { useCacheProvider } from 'src/utils/cache-provider';
import { SWRConfig } from 'swr';
import { appCacheDBKey, appCacheStoreName, cacheVersion } from 'src/constants';
import type { FC, PropsWithChildren } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';

export const CacheProvider: FC<PropsWithChildren> = ({ children }) => {
    const { session } = useSessionContext();

    const cacheProvider = useCacheProvider({
        dbName: appCacheDBKey(session?.user.id ?? ''),
        storeName: appCacheStoreName,
        version: cacheVersion,
    });
    if (!cacheProvider) {
        return <>Loading...</>;
    }
    return <SWRConfig value={{ provider: cacheProvider, revalidateOnFocus: false }}>{children}</SWRConfig>;
};
