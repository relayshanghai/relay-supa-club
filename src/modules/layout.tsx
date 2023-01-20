import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { LanguageToggle } from 'src/components/common/language-toggle';
import { HamburgerMenu, Spinner } from 'src/components/icons';
import { Sidebar } from 'src/components/sidebar';

import { useCompany } from 'src/hooks/use-company';
import { useSubscription } from 'src/hooks/use-subscription';
import { useUser } from 'src/hooks/use-user';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export const Layout = ({ children }: any) => {
    const router = useRouter();
    const { t } = useTranslation();
    const { profile, loading } = useUser();
    const { company } = useCompany();
    const { subscription } = useSubscription();
    const supabase = useSupabaseClient();

    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const accountMenuRef = useRef(null);
    const accountMenuButtonRef = useRef(null);
    useOnOutsideClick(accountMenuRef, () => setAccountMenuOpen(false), accountMenuButtonRef);

    const [sideBarOpen, setSideBarOpen] = useState(true);

    return (
        <div className="w-full h-full">
            <div className="flex flex-row h-full">
                <Sidebar
                    loggedIn={!!profile?.id && !loading}
                    open={sideBarOpen}
                    setOpen={setSideBarOpen}
                />
                <div className="flex flex-col w-full overflow-hidden">
                    <div className="flex items-center justify-between bg-white border-b border-gray-100">
                        <Button
                            onClick={() => setSideBarOpen(!sideBarOpen)}
                            variant="neutral"
                            className="flex items-center p-4 hover:text-primary-500"
                        >
                            <HamburgerMenu height={24} width={24} />
                        </Button>

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
                                {!loading && !!profile?.id && (
                                    <div>
                                        <button
                                            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                                            ref={accountMenuButtonRef}
                                        >
                                            <p className="w-9 h-9 p-2 rounded-full bg-primary-50 text-primary-600 text-xs font-bold">
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
                                                <Button
                                                    className="px-4 py-2 text-sm hover:bg-gray-100 active:bg-gray-200"
                                                    variant="neutral"
                                                    onClick={async () => {
                                                        await supabase.auth.signOut();
                                                        // need to trigger a page reload to get the new auth state, so don't use router.push
                                                        window.location.href = '/signup';
                                                    }}
                                                >
                                                    {t('navbar.button.logout')}
                                                </Button>
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
