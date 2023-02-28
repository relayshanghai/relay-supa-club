import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useUser } from 'src/hooks/use-user';
import { nextFetch } from 'src/utils/fetcher';

export default function Logout() {
    const router = useRouter();
    const { supabaseClient, refreshProfile, profile, user, getProfileController } = useUser();
    const { email } = router.query;
    const signOut = useCallback(async () => {
        getProfileController.current?.abort();
        if (!supabaseClient) return;
        await supabaseClient.auth.signOut();

        const data = await nextFetch('logout');
        if (data.success) {
            if (profile?.id || user?.id) {
                await refreshProfile(undefined, {
                    revalidate: false,
                    optimisticData: undefined,
                    rollbackOnError: false,
                    throwOnError: false,
                });
                return;
            }
            window.location.href = email ? `/login?email=${email}` : '/login';
        }
    }, [email, getProfileController, profile?.id, refreshProfile, supabaseClient, user?.id]);

    useEffect(() => {
        signOut();
    }, [signOut]);

    return <></>;
}
