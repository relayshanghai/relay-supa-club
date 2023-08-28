import Link from 'next/link';
import { useRouter } from 'next/router';
import type { MutableRefObject, ReactNode } from 'react';
import { useEffect } from 'react';
import useAboveScreenWidth from 'src/hooks/use-above-screen-width';
import EmailOutline from './icons/EmailOutline';
import { useUser } from 'src/hooks/use-user';
import { Compass, FourSquare, Team, Guide, Send, Engagements, ProfilePlus, BarGraph, Thunder } from './icons';
import { Title } from './title';
import { useTranslation } from 'react-i18next';
import { featEmail } from 'src/constants/feature-flags';
import { Button } from './button';

const links = {
    discover: '/dashboard',
    influencer: '/influencer',
    campaigns: '/campaigns',
    aiEmailGenerator: '/ai-email-generator',
    account: '/account',
    admin: '/admin/clients',
    performance: '/performance',
    guide: '/guide',
    sequences: '/sequences',
    inbox: '/inbox',
    influencerManager: '/influencer-manager',
    boostbot: '/boostbot',
};

// eslint-disable-next-line complexity
const ActiveLink = ({ href, children }: { href: string; children: ReactNode }) => {
    const router = useRouter();

    const pathRoot = router.pathname; // /dashboard/influencers => dashboard

    const isRouteActive = pathRoot === href;

    return (
        <Link
            href={href}
            className={`flex items-center overflow-hidden border-l-4 stroke-gray-400 py-2 pl-4 text-sm font-semibold text-gray-400 transition hover:stroke-primary-700 hover:text-primary-700 ${
                isRouteActive ? 'border-primary-500 stroke-primary-500 text-primary-500' : 'border-transparent'
            }`}
        >
            {(href === links.influencer || href === links.discover) && (
                <Compass height={18} width={18} className="my-0.5 stroke-inherit" />
            )}

            {href === links.boostbot && <Thunder height={18} width={18} className="my-0.5 stroke-inherit" />}

            {href === links.campaigns && <FourSquare height={18} width={18} className="my-0.5 stroke-inherit" />}

            {href === links.aiEmailGenerator && (
                <EmailOutline height={18} width={18} className="my-0.5 stroke-inherit" />
            )}

            {href === links.admin && <Team height={18} width={18} className="my-0.5 stroke-inherit" />}

            {href === links.performance && <BarGraph height={18} width={18} className="my-0.5 stroke-inherit" />}

            {href === links.guide && <Guide height={18} width={18} className="my-0.5 stroke-inherit" />}

            {href === links.sequences && <Send height={18} width={18} className="my-0.5 stroke-inherit" />}
            {href === links.inbox && <Engagements height={18} width={18} className="my-0.5 stroke-inherit" />}
            {href === links.influencerManager && (
                <ProfilePlus height={18} width={18} className="my-0.5 stroke-inherit" />
            )}
            {children}
        </Link>
    );
};

// eslint-disable-next-line complexity
const NavBarInner = ({
    accountMenuOpen,
    setAccountMenuOpen,
    accountMenuButtonRef,
    accountMenuRef,
    logout,
    loggedIn,
    profileFirstName,
    isRelayEmployee,
    open,
    desktop,
}: {
    accountMenuOpen: boolean;
    accountMenuButtonRef: MutableRefObject<null>;
    accountMenuRef: MutableRefObject<null>;
    setAccountMenuOpen: (menu: boolean) => void;
    logout: () => void;
    loggedIn: boolean | null;
    profileFirstName?: string;
    isRelayEmployee: boolean;
    open: boolean;
    desktop: boolean;
}) => {
    const { t } = useTranslation();
    const sidebarState = open && desktop ? 'visible' : 'hidden';

    return (
        <>
            <div className="pt-5">
                <Title open={open && desktop} />
            </div>
            <div className="flex h-full flex-col justify-between gap-4 pt-8">
                <section className="flex flex-col gap-4">
                    <ActiveLink href={links.discover}>
                        <p className={`ml-2 whitespace-nowrap text-sm ${sidebarState}`}>{t('navbar.discover')}</p>
                    </ActiveLink>
                    <ActiveLink href={links.boostbot}>
                        <p className={`ml-2 whitespace-nowrap text-sm ${sidebarState}`}>{t('navbar.boostbot')}</p>
                    </ActiveLink>
                    {featEmail() && (
                        <ActiveLink href={links.sequences}>
                            <p className={`whitespace-nowra ml-2 text-sm ${sidebarState}`}>{t('navbar.sequences')}</p>
                        </ActiveLink>
                    )}
                    {featEmail() && (
                        <ActiveLink href={links.inbox}>
                            <p className={`ml-2 whitespace-nowrap text-sm ${sidebarState}`}>{t('navbar.inbox')}</p>
                        </ActiveLink>
                    )}
                    {featEmail() && (
                        <ActiveLink href={links.influencerManager}>
                            <p className={`ml-2 whitespace-nowrap text-sm ${sidebarState}`}>
                                {t('navbar.influencerManager')}
                            </p>
                        </ActiveLink>
                    )}
                    {!featEmail() && (
                        <ActiveLink href={links.campaigns}>
                            <p className={`ml-2 whitespace-nowrap text-sm ${sidebarState}`}>{t('navbar.campaigns')}</p>
                        </ActiveLink>
                    )}
                    {!featEmail() && (
                        <ActiveLink href={links.performance}>
                            <p className={`ml-2 whitespace-nowrap text-sm ${sidebarState}`}>
                                {t('navbar.performance')}
                            </p>
                        </ActiveLink>
                    )}
                    <ActiveLink href="/guide">
                        <p className={`ml-2 whitespace-nowrap text-sm ${open && desktop ? 'relative' : 'hidden'}`}>
                            {t('navbar.guide')}
                        </p>
                    </ActiveLink>
                    {isRelayEmployee && (
                        <div className="flex flex-col space-y-4 pt-8">
                            <h2 className={`${open ? 'ml-6' : 'text-center text-xs'}`}>ADMIN</h2>
                            <ActiveLink href={links.admin}>
                                <p
                                    className={`ml-2 whitespace-nowrap text-sm ${
                                        open && desktop ? 'relative' : 'hidden'
                                    }`}
                                >
                                    Clients
                                </p>
                            </ActiveLink>
                        </div>
                    )}
                </section>
                {loggedIn && profileFirstName && (
                    <div className="m-4 flex flex-row items-center gap-4">
                        <div
                            data-testid="layout-account-menu"
                            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                            ref={accountMenuButtonRef}
                            className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 p-2 text-base text-gray-800"
                        >
                            {profileFirstName[0]}
                            {accountMenuOpen && (
                                <div
                                    className="border-gray absolute bottom-[120%] left-[100%] z-20 flex w-fit origin-top-right flex-col overflow-hidden rounded-md border border-opacity-40 bg-white shadow-lg"
                                    ref={accountMenuRef}
                                >
                                    <Link
                                        href="/account"
                                        passHref
                                        className="whitespace-nowrap px-4 py-2 text-sm hover:bg-gray-100 active:bg-gray-200"
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
                        <div className={`flex flex-col whitespace-nowrap text-xs ${sidebarState}`}>
                            <p className="font-semibold text-gray-800">{profileFirstName}</p>
                            {/*TODO {featEmail() && (
                                <p className="font-light">
                                    Discover beta!
                                    <span className="p-1 align-super text-[8px] text-primary-500">Upgrade</span>
                                </p>
                            )} */}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export const Sidebar = ({
    accountMenuOpen,
    accountMenuButtonRef,
    accountMenuRef,
    setAccountMenuOpen,
    logout,
    loggedIn,
    profileFirstName,
    open,
    setOpen,
}: {
    accountMenuOpen: boolean;
    accountMenuButtonRef: MutableRefObject<null>;
    accountMenuRef: MutableRefObject<null>;
    setAccountMenuOpen: (menu: boolean) => void;
    logout: () => void;
    loggedIn: boolean | null;
    profileFirstName?: string;
    open: boolean;
    setOpen: (open: boolean) => void;
}) => {
    // 768px is 'md' in our tailwind
    const desktop = useAboveScreenWidth(768);
    const { profile } = useUser();

    useEffect(() => {
        if (desktop) setOpen(true);
        else setOpen(false);
    }, [desktop, setOpen]);

    return (
        // mask is the dark overlay that appears when the sidebar is open
        <nav className="h-full">
            <div
                className={`pointer-events-none fixed inset-0 z-50 opacity-0 transition-all`}
                onClick={() => setOpen(false)}
            />
            <div
                className={`inset-y-0 left-0 z-50 ${
                    open ? 'w-64' : 'w-16'
                } flex h-full transform flex-col border-r border-gray-100 bg-white transition-all`}
            >
                <NavBarInner
                    accountMenuOpen={accountMenuOpen}
                    accountMenuButtonRef={accountMenuButtonRef}
                    accountMenuRef={accountMenuRef}
                    setAccountMenuOpen={setAccountMenuOpen}
                    logout={logout}
                    open={open}
                    profileFirstName={profileFirstName}
                    desktop={desktop}
                    loggedIn={loggedIn}
                    isRelayEmployee={profile?.user_role === 'relay_employee'}
                />
            </div>
        </nav>
    );
};
