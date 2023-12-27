import { useCacheProvider } from 'src/utils/cache-provider';
import { SWRConfig } from 'swr';
import { appCacheDBKey, appCacheStoreName, cacheVersion } from 'src/constants';
import type { FC, PropsWithChildren } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { clientLogger } from './logger-client';

export const CacheProvider: FC<PropsWithChildren> = ({ children }) => {
    const { session } = useSessionContext();

    const cacheProvider = useCacheProvider({
        dbName: session ? appCacheDBKey(session.user.id) : '', // useCacheProvider will check if dbName is empty, so cacheProvider will be null if session is null
        storeName: appCacheStoreName,
        version: cacheVersion,
        onError: (error) => {
            clientLogger('CacheProvider error', error);
        },
    });

    return (
        <SWRConfig value={{ revalidateOnFocus: false }}>
            {cacheProvider ? (
                <SWRConfig value={{ provider: cacheProvider, revalidateOnFocus: false }}>{children}</SWRConfig>
            ) : (
                children
            )}
        </SWRConfig>
    );
};
