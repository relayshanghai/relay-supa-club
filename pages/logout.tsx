import { deleteDB } from 'idb';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { appCacheDBKey } from 'src/constants';
import { useUser } from 'src/hooks/use-user';
import { useAnalytics } from 'use-analytics';

export default function Logout() {
    const router = useRouter();
    const { supabaseClient, refreshProfile } = useUser();
    const analytics = useAnalytics();
    const { email } = router.query;

    const signOut = useCallback(async () => {
        if (!supabaseClient) {
            return;
        }
        await supabaseClient.auth.signOut();

        await refreshProfile(undefined, {
            revalidate: false,
            optimisticData: undefined,
            rollbackOnError: false,
            throwOnError: false,
        });
        deleteDB(appCacheDBKey);
        analytics.reset();

        window.location.href = email ? `/login?email=${email}` : '/login';
    }, [analytics, email, supabaseClient, refreshProfile]);

    useEffect(() => {
        signOut();
    }, [signOut]);

    return <>Logging out...</>;
}
