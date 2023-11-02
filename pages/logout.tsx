import { deleteDB } from 'idb';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { appCacheDBKey } from 'src/constants';
import { useMixpanel } from 'src/hooks/use-mixpanel';
import { useRudder } from 'src/hooks/use-rudderstack';
import { useUser } from 'src/hooks/use-user';
import { useAnalytics } from 'use-analytics';
import * as Sentry from '@sentry/nextjs';

export default function Logout() {
    const router = useRouter();
    const { supabaseClient, refreshProfile } = useUser();
    const analytics = useAnalytics();
    const rudderstack = useRudder();
    const mixpanel = useMixpanel();
    const { email } = router.query;

    const signOut = useCallback(async () => {
        if (!supabaseClient || !mixpanel || !rudderstack) return;

        await supabaseClient.auth.signOut().then(() => {
            rudderstack.reset(true);
            mixpanel.reset();
        });

        await refreshProfile(undefined, {
            revalidate: false,
            optimisticData: undefined,
            rollbackOnError: false,
            throwOnError: false,
        });
        deleteDB(appCacheDBKey);
        Sentry.setUser(null);
        analytics.reset();

        window.location.href = email ? `/login?email=${email}` : '/login';
    }, [analytics, email, supabaseClient, refreshProfile, mixpanel, rudderstack]);

    useEffect(() => {
        signOut();
    }, [signOut]);

    return <>Logging out...</>;
}
