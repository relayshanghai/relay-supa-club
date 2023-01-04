import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { LanguageToggle } from 'src/components/common/language-toggle';
import { Spinner } from 'src/components/icons';
import { Title } from 'src/components/title';
import { useCompany } from 'src/hooks/use-company';
import { useSubscription } from 'src/hooks/use-subscription';
import { useUser } from 'src/hooks/use-user';
import useOnOutsideClick from 'src/hooks/useOnOutsideClick';
import { supabase } from 'src/utils/supabase-client';

const ActiveLink = ({ href, children }: any) => {
    const router = useRouter();
    const isRouteActive = router.pathname === href;

    return (
        <Link href={href}>
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
    const { t } = useTranslation();
    const { session, profile, loading } = useUser();
    const { company } = useCompany();
    const { subscription } = useSubscription();

    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const accountMenuRef = useRef(null);
    const accountMenuButtonRef = useRef(null);
    useOnOutsideClick(accountMenuRef, () => setAccountMenuOpen(false), accountMenuButtonRef);

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
                <div className="px-4 py-4 flex-col bg-white border-r border-gray-100 w-64 hidden md:flex">
                    <Title />
                    <div className="flex flex-col space-y-4 mt-8">
                        <ActiveLink href="/dashboard">{t('navbar.button.creators')}</ActiveLink>
                        <ActiveLink href="/campaigns">{t('navbar.button.campaigns')}</ActiveLink>
                    </div>
                </div>
                <div className="flex flex-col w-full overflow-hidden">
                    <div className="flex flex-row justify-between bg-white border-b border-gray-100">
                        <div className="flex md:hidden px-4 py-4">
                            <Title />
                        </div>
                        <div />
                        <div className="px-8 py-4 flex flex-row items-center space-x-4">
                            <div className="text-sm flex flex-row items-center space-x-4">
                                <LanguageToggle />
                                {!!subscription && (
                                    <Button onClick={() => router.push('/account')}>
                                        {t('navbar.button.subscribeNow')}
                                    </Button>
                                )}
                                <p>
                                    {`${t('navbar.usage')}: ${company?.usages?.length || '0'}/${
                                        company?.usage_limit || '0'
                                    }`}
                                </p>
                            </div>
                            <div>
                                {!loading && session && (
                                    <div>
                                        <button
                                            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                                            ref={accountMenuButtonRef}
                                        >
                                            <p className="w-9 l-9 p-2 rounded-full bg-primary-50 text-primary-600 text-sm font-bold">
                                                {profile?.first_name ? profile.first_name[0] : ''}
                                                {profile?.last_name ? profile.last_name[0] : ''}
                                            </p>
                                        </button>
                                        {accountMenuOpen && (
                                            <div
                                                className="flex flex-col overflow-hidden w-28 absolute right-8 mt-2 origin-top-right bg-white border border-gray border-opacity-40 rounded-md shadow-lg z-10"
                                                ref={accountMenuRef}
                                            >
                                                <Link href="/account" passHref>
                                                    <a className="px-4 py-2 text-sm hover:bg-gray-100 active:bg-gray-200">
                                                        {t('navbar.button.account')}
                                                    </a>
                                                </Link>

                                                <p
                                                    onClick={async () => {
                                                        await supabase.auth.signOut();
                                                    }}
                                                    className="px-4 py-2 text-sm hover:bg-gray-100 active:bg-gray-200"
                                                >
                                                    {t('navbar.button.logout')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {loading && (
                                    <Spinner className="w-9 h-9 p-2 fill-primary-600 text-white" />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="overflow-auto h-full">{children}</div>
                </div>
            </div>
        </div>
    );
};
