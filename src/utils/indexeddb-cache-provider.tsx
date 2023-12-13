import { useCacheProvider } from 'src/utils/cache-provider';
import { SWRConfig } from 'swr';
import { appCacheDBKey, appCacheStoreName } from 'src/constants';
import type { FC, PropsWithChildren } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';

export const CacheProvider: FC<PropsWithChildren> = ({ children }) => {
    const { session } = useSessionContext();

    const cacheProvider = useCacheProvider({
        dbName: appCacheDBKey(session?.user.id ?? ''),
        storeName: appCacheStoreName,
    });
    if (!cacheProvider) {
        return <>Loading...</>;
    }
    return <SWRConfig value={{ provider: cacheProvider, revalidateOnFocus: false }}>{children}</SWRConfig>;
};
