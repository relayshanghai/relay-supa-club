import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from 'src/hooks/use-user';
import { Search } from 'src/modules/search';

const Page = () => {
    const router = useRouter();
    const { session, loading } = useUser();

    useEffect(() => {
        // If we don't have a user and is not loading
        // means the user is logged out
        if (!session && !loading) {
            router.push('/login');
        }
    }, [router, session, loading]);

    return (
        <div className="w-full h-full">
            <div className="px-10 py-8 space-y-8 max-w-4xl mx-auto">
                <div className="flex flex-row justify-between">
                    <div className="font-poppins text-2xl font-bold text-tertiary-600 tracking-wide">
                        relay.club
                    </div>
                    <div></div>
                </div>
                <Search />
            </div>
        </div>
    );
};

export default Page;
