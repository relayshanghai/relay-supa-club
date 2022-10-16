import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from 'src/hooks/use-user';

const Home = () => {
    const router = useRouter();
    const { session, loading } = useUser();

    useEffect(() => {
        // If we don't have a user and is not loading
        // means the user is logged out
        if (session && !loading) {
            router.push('/dashboard');
        }
    }, [router, session, loading]);

    return <div></div>;
};

export default Home;
