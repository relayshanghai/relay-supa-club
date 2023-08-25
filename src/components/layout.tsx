import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { LanguageToggle } from 'src/components/common/language-toggle';
import { HamburgerMenu, Spinner } from 'src/components/icons';
import { Sidebar } from 'src/components/sidebar';

import { useUser } from 'src/hooks/use-user';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';
import ClientRoleWarning from './search/client-role-warning';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { NAVBAR } from 'src/utils/rudderstack/event-names';

export const Layout = ({ children }: any) => {
    const { t } = useTranslation();
    const { profile, loading, refreshProfile, logout } = useUser();

    useEffect(() => {
        // this fixes a bug where the profile is not loaded on the first page load when coming from signup
        if (!loading && !profile?.id) refreshProfile();
    }, [refreshProfile, profile, loading]);

    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const accountMenuRef = useRef(null);
    const accountMenuButtonRef = useRef(null);
    useOnOutsideClick(accountMenuRef, () => setAccountMenuOpen(false), accountMenuButtonRef);
    const { trackEvent } = useRudderstack();
    const [sideBarOpen, setSideBarOpen] = useState(true);

    return (
        <div className="fixed flex h-screen w-screen">
            <Sidebar
                loggedIn={!!profile?.id && !loading}
                profileFirstName={profile?.first_name}
                open={sideBarOpen}
                setOpen={setSideBarOpen}
            />
            <div className="flex w-full max-w-full flex-col overflow-hidden">
                <div className="z-30 flex items-center justify-between bg-white shadow-sm shadow-gray-200">
                    <Button
                        onClick={() => {
                            setSideBarOpen(!sideBarOpen);
                            trackEvent(NAVBAR('Hamburger Menu Clicked'));
                        }}
                        variant="neutral"
                        className="flex items-center p-4 hover:text-primary-500"
                    >
                        <HamburgerMenu height={24} width={24} />
                    </Button>

                    <div className="flex flex-row items-center space-x-4 px-8 py-4">
                        <div className="flex flex-row items-center space-x-4 text-sm">
                            <LanguageToggle />
                        </div>
                        <div>
                            {!loading && !!profile?.id && (
                                <div>
                                    <button
                                        data-testid="layout-account-menu"
                                        onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                                        ref={accountMenuButtonRef}
                                        className="flex justify-center rounded-full bg-primary-50 p-2 align-middle"
                                    >
                                        <p className="text-xs font-bold text-primary-600">
                                            {profile?.first_name ? profile.first_name[0] : ''}
                                            {profile?.last_name ? profile.last_name[0] : ''}
                                        </p>
                                    </button>
                                    {accountMenuOpen && (
                                        <div
                                            className="border-gray absolute right-8 z-10 mt-2 flex w-fit origin-top-right flex-col overflow-hidden rounded-md border border-opacity-40 bg-white shadow-lg"
                                            ref={accountMenuRef}
                                        >
                                            <Link
                                                href="/account"
                                                passHref
                                                className="px-4 py-2 text-sm hover:bg-gray-100 active:bg-gray-200"
                                            >
                                                {t('navbar.account')}
                                            </Link>
                                            <Button
                                                className="px-4 py-2 text-sm hover:bg-gray-100 active:bg-gray-200"
                                                variant="neutral"
                                                onClick={logout}
                                            >
                                                {t('navbar.logout')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                            {loading && <Spinner className="h-9 w-9 fill-primary-600 p-2 text-white" />}
                        </div>
                    </div>
                </div>
                <div className="h-full w-full overflow-auto"> {children}</div>
            </div>
            <ClientRoleWarning />
        </div>
    );
};
