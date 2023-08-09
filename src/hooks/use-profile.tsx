import { useClientDb } from 'src/utils/client-db/use-client-db';
import useSWR from 'swr';

export const useProfile = (profile_id: string) => {
    const db = useClientDb();
    const { data: profile } = useSWR(profile_id ? 'profiles' : null, async () => await db.getProfileById(profile_id));

    return {
        profile,
    };
};
