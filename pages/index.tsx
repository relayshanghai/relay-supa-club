import Link from 'next/link';
import { useUser } from 'src/hooks/use-user';

const Home = () => {
    const { session, loading } = useUser();
    return (
        <div className="w-full h-full px-10 py-8">
            <div className="flex flex-row justify-between">
                <div className="font-poppins text-2xl font-bold text-tertiary-600 tracking-wide">
                    relay.club
                </div>
                <div>
                    {loading ? null : session && !loading ? (
                        <Link href="/dashboard" passHref>
                            <a className="text-sm px-4 py-2 rounded-md cursor-pointer flex-shrink-0 text-white bg-primary-500 hover:bg-primary-700 duration-300 font-bold disabled:bg-gray-300 disabled:cursor-default">
                                Dashboard
                            </a>
                        </Link>
                    ) : (
                        <Link href="/login" passHref>
                            <a className="text-sm px-4 py-2 rounded-md cursor-pointer flex-shrink-0 text-white bg-primary-500 hover:bg-primary-700 duration-300 font-bold disabled:bg-gray-300 disabled:cursor-default">
                                Log in
                            </a>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
