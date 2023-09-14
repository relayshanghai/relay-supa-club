import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, type MutableRefObject, type ReactNode } from 'react';
import useAboveScreenWidth from 'src/hooks/use-above-screen-width';
import { useUser } from 'src/hooks/use-user';
import {
    Compass,
    Team,
    Guide,
    Send,
    Engagements,
    ProfilePlus,
    BarGraph,
    BoostbotDefault,
    BoostbotSelected,
    FourSquare,
} from './icons';
import { Title } from './title';
import { useTranslation } from 'react-i18next';
import { featEmail } from 'src/constants/feature-flags';
import { Button } from './button';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { OpenAccountModal } from 'src/utils/analytics/events';
import { NavigateToPage } from 'src/utils/analytics/events';

const links: Record<string, (pathRoot: string, hovering?: boolean) => JSX.Element> = {
    '/dashboard': (_pathRoot: string) => <Compass height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/influencer': (_pathRoot: string) => <Compass height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/account': (_pathRoot: string) => <Team height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/admin/clients': (_pathRoot: string) => <Team height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/performance': (_pathRoot: string) => <BarGraph height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/guide': (_pathRoot: string) => <Guide height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/sequences': (_pathRoot: string) => <Send height={20} width={24} className="my-0.5 stroke-inherit" />,
    '/inbox': (_pathRoot: string) => <Engagements height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/influencer-manager': (_pathRoot: string) => (
        <ProfilePlus height={20} width={20} className="my-0.5 stroke-inherit" />
    ),
    '/boostbot': (pathRoot: string, hovering = false) => {
        if (pathRoot === '/boostbot' || hovering) {
            return <BoostbotSelected height={24} width={20} className="my-0.5 stroke-none " />;
        }
        return <BoostbotDefault height={24} width={20} className="my-0.5 border-none stroke-none" />;
    },
    '/campaigns': (_pathRoot: string) => <FourSquare height={20} width={20} className="my-0.5 stroke-inherit" />,
} as const;

// eslint-disable-next-line complexity
const ActiveLink = ({ href, children }: { href: string; children: ReactNode }) => {
    const router = useRouter();

    const pathRoot = router.pathname === '/' ? '/' : `/${router.pathname.split('/')[1]}`; // /dashboard/influencers => dashboard

    const [hovering, setHovering] = useState(false);

    const isRouteActive = pathRoot === href;

    const { track } = useRudderstackTrack();

    return (
        <Link
            onMouseOver={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            href={href}
            className={`flex items-center overflow-hidden border-l-4 stroke-gray-400 py-2 pl-4 text-sm font-semibold text-gray-400 transition hover:stroke-primary-700 hover:text-primary-700 ${
                isRouteActive ? 'border-primary-500 stroke-primary-500 text-primary-500' : 'border-transparent'
            }`}
            onClick={() => track(NavigateToPage, { destination_url: href })}
        >
            {links[href](pathRoot, hovering) ?? null}
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
    const { track } = useRudderstackTrack();
    const sidebarState = open && desktop ? 'visible' : 'hidden';
    const { profile } = useUser();

    return (
        <>
            <div className="pt-2">
                <Title open={open && desktop} />
            </div>
            <div className="flex h-full flex-col justify-between gap-4 pt-8">
                <section className="flex flex-col gap-4">
                    {profile?.created_at && featEmail(new Date(profile.created_at)) && (
                        <ActiveLink href={'/boostbot'}>
                            <p className={`ml-2 whitespace-nowrap text-sm ${sidebarState}`}>{t('navbar.boostbot')}</p>
                        </ActiveLink>
                    )}
                    <ActiveLink href="/dashboard">
                        <p className={`ml-2 whitespace-nowrap text-sm ${sidebarState}`}>{t('navbar.discover')}</p>
                    </ActiveLink>
                    {profile?.created_at && featEmail(new Date(profile.created_at)) && (
                        <ActiveLink href={'/sequences'}>
                            <p className={`ml-2 whitespace-nowrap text-sm ${sidebarState}`}>{t('navbar.sequences')}</p>
                        </ActiveLink>
                    )}
                    {profile?.created_at && featEmail(new Date(profile.created_at)) && (
                        <ActiveLink href="/inbox">
                            <p className={`ml-2 whitespace-nowrap text-sm ${sidebarState}`}>{t('navbar.inbox')}</p>
                        </ActiveLink>
                    )}
                    {profile?.created_at && featEmail(new Date(profile.created_at)) && (
                        <ActiveLink href="/influencer-manager">
                            <p className={`ml-2 whitespace-nowrap text-sm ${sidebarState}`}>
                                {t('navbar.influencerManager')}
                            </p>
                        </ActiveLink>
                    )}
                    {!(profile?.created_at && featEmail(new Date(profile.created_at))) && (
                        <ActiveLink href="/campaigns">
                            <p className={`ml-2 whitespace-nowrap text-sm ${sidebarState}`}>{t('navbar.campaigns')}</p>
                        </ActiveLink>
                    )}
                    {!(profile?.created_at && featEmail(new Date(profile.created_at))) && (
                        <ActiveLink href="/performance">
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
                            <ActiveLink href="/admin/clients">
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
                            onClick={() => {
                                setAccountMenuOpen(!accountMenuOpen);
                                track(OpenAccountModal);
                            }}
                            ref={accountMenuButtonRef}
                            className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 p-2 text-base text-gray-800"
                        >
                            {profileFirstName[0]}
                            {accountMenuOpen && (
                                <div
                                    className="border-gray absolute bottom-[120%] left-[100%] flex w-fit origin-top-right flex-col overflow-hidden rounded-md border border-opacity-40 bg-white shadow-lg"
                                    ref={accountMenuRef}
                                >
                                    <Link
                                        href="/account"
                                        passHref
                                        className="whitespace-nowrap px-4 py-2 text-sm hover:bg-gray-100 active:bg-gray-200"
                                        onClick={() => track(NavigateToPage, { destination_url: '/account' })}
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
                            {/*TODO {profile?.created_at && featEmail(new Date(profile.created_at)) && (
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

    return (
        // mask is the dark overlay that appears when the sidebar is open
        <nav className="z-20 h-full">
            <div
                className={`pointer-events-none fixed inset-0 opacity-0 transition-all`}
                onClick={() => setOpen(false)}
            />
            <div
                className={`inset-y-0 left-0 ${
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
