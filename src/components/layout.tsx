import { Menu } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { Spinner } from 'src/components/spinner';
import { Title } from 'src/components/title';
import { useUser } from 'src/hooks/use-user';
import { supabase } from 'src/utils/supabase-client';

const ActiveLink = ({ href, children }: any) => {
    const router = useRouter();
    const isRouteActive = router.pathname === href;

    return (
        <Link href="/dashboard">
            <a
                className={`text-sm transition hover:text-primary-500 ${
                    isRouteActive ? 'text-primary-600' : ''
                }`}
            >
                {children}
            </a>
        </Link>
    );
};

export const Layout = ({ children }: any) => {
    const router = useRouter();
    const { session, profile, loading } = useUser();

    useEffect(() => {
        // If we don't have a user and is not loading
        // means the user is logged out
        if (!session && !loading) {
            router.push('/');
        }
    }, [router, session, loading]);

    return (
        <div className="w-full h-full">
            <div className="flex flex-row h-full">
                <div className="px-4 py-4 flex flex-col bg-white border-r border-gray-100 w-64">
                    <Title />
                    <div className="flex flex-col space-y-4 mt-8">
                        <ActiveLink href="/dashboard">KOLs</ActiveLink>
                        <ActiveLink href="/campaigns">Campaigns</ActiveLink>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex flex-row justify-between bg-white border-b border-gray-100">
                        <div></div>
                        <div className="px-8 py-4">
                            {!loading && session ? (
                                <Menu>
                                    <Menu.Button>
                                        <div className="p-2 rounded-full bg-primary-50 text-primary-600 text-sm font-bold">
                                            {profile.first_name ? profile.first_name[0] : ''}
                                            {profile.last_name ? profile.last_name[0] : ''}
                                        </div>
                                    </Menu.Button>
                                    <Menu.Items className="flex flex-col overflow-hidden w-48 absolute right-8 mt-2 origin-top-right bg-white border border-gray border-opacity-40 rounded-md shadow-lg z-10">
                                        <Menu.Item>
                                            <>
                                                <Link href="/account" passHref>
                                                    <a className="hover:bg-neutral-gray active:bg-neutral-gray-50 px-4 py-2 text-sm">
                                                        Account
                                                    </a>
                                                </Link>
                                            </>
                                        </Menu.Item>
                                        <Menu.Item>
                                            <>
                                                <div
                                                    onClick={async () => {
                                                        await supabase.auth.signOut();
                                                    }}
                                                    className="hover:bg-neutral-gray active:bg-neutral-gray-50 px-4 py-2 cursor-pointer text-sm"
                                                >
                                                    Log out
                                                </div>
                                            </>
                                        </Menu.Item>
                                    </Menu.Items>
                                </Menu>
                            ) : loading ? (
                                <div className="p-2 rounded-full bg-primary-50 text-primary-600 text-sm font-bold">
                                    <Spinner />
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="overflow-hidden">{children}</div>
                </div>
            </div>
        </div>
    );
};
