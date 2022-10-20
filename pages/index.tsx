import Link from 'next/link';
import { Title } from 'src/components/title';
import { useUser } from 'src/hooks/use-user';

const Home = () => {
    const { session, loading } = useUser();
    return (
        <div className="w-full h-full px-10 py-8">
            <div className="flex flex-row justify-between">
                <Title />
                <div>
                    {loading ? null : session && !loading ? (
                        <Link href="/dashboard" passHref>
                            <a className="text-sm px-4 py-2 rounded-md cursor-pointer flex-shrink-0 text-white bg-primary-500 hover:bg-primary-700 duration-300 font-bold disabled:bg-gray-300 disabled:cursor-default">
                                Dashboard
                            </a>
                        </Link>
                    ) : (
                        <div className="space-x-2">
                            <Link href="/signup" passHref>
                                <a className="text-sm px-4 py-2 rounded-md cursor-pointer flex-shrink-0 text-white bg-primary-500 hover:bg-primary-700 duration-300 font-bold disabled:bg-gray-300 disabled:cursor-default">
                                    Create account
                                </a>
                            </Link>
                            <Link href="/login" passHref>
                                <a className="text-sm text-primary-500 px-4 py-2 rounded-md cursor-pointer flex-shrink-0 text-white border border-primary-500 hover:border-primary-700 duration-300 font-bold disabled:bg-gray-300 disabled:cursor-default">
                                    Log in
                                </a>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <div className="py-16 text-center">Imagine the landing page content goes here</div>
        </div>
    );
};

export default Home;
