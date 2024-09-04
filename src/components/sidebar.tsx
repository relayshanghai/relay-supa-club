import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, type MutableRefObject, type ReactNode } from 'react';
import { useUser } from 'src/hooks/use-user';
import { OldSearch, Team, Guide, BarGraph, ThunderSearch, FourSquare, ThunderMail } from './icons';
import { Title } from './title';
import { useTranslation } from 'react-i18next';
import { featEmail } from 'src/constants/feature-flags';
import { Button } from './button';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { OpenAccountModal, ToggleNavbarSize, NavigateToPage } from 'src/utils/analytics/events';
import { Tooltip } from './library';

const links: Record<string, (pathRoot: string, hovering?: boolean) => JSX.Element> = {
    '/dashboard': (_pathRoot: string) => <OldSearch height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/influencer': (_pathRoot: string) => <OldSearch height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/account': (_pathRoot: string) => <Team height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/admin/clients': (_pathRoot: string) => <Team height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/performance': (_pathRoot: string) => <BarGraph height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/guide': (_pathRoot: string) => <Guide height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/sequences': (_pathRoot: string) => <ThunderMail height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/boostbot': (_pathRoot: string) => <ThunderSearch height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/campaigns': (_pathRoot: string) => <FourSquare height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/outreach': (_pathRoot: string) => <FourSquare height={20} width={20} className="my-0.5 stroke-inherit" />,
} as const;

// eslint-disable-next-line complexity
const ActiveLink = ({ href, children, expandedName }: { href: string; children: ReactNode; expandedName: string }) => {
    const router = useRouter();

    const pathRoot = router.pathname === '/' ? '/' : `/${router.pathname.split('/')[1]}`; // /dashboard/influencers => dashboard

    const [hovering, setHovering] = useState(false);

    const isRouteActive = pathRoot === href;

    const { track } = useRudderstackTrack();

    return (
        <Tooltip content={expandedName} position="inset-right" contentSize="small" delay={500} enabled={false}>
            <Link
                onMouseOver={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                href={href}
                className={`flex flex-col items-center gap-1 overflow-visible border-l-4 stroke-gray-400 py-2 font-poppins text-sm text-gray-400 transition hover:stroke-primary-700 hover:text-primary-700 ${
                    isRouteActive ? 'border-primary-500 stroke-primary-500 text-primary-500' : 'border-transparent'
                }`}
                onClick={() => track(NavigateToPage, { destination_url: href })}
            >
                {links[href](pathRoot, hovering) ?? null}
                {children}
            </Link>
        </Tooltip>
    );
};

// eslint-disable-next-line complexity
const NavBarInner = ({
    accountMenuOpen,
    setAccountMenuOpen,
    accountMenuButtonRef,
    accountMenuRef,
    loggedIn,
    profileFirstName,
    isRelayEmployee,
}: {
    accountMenuOpen: boolean;
    accountMenuButtonRef: MutableRefObject<null>;
    accountMenuRef: MutableRefObject<null>;
    setAccountMenuOpen: (menu: boolean) => void;
    loggedIn: boolean | null;
    profileFirstName?: string;
    isRelayEmployee: boolean;
}) => {
    const { t } = useTranslation();
    const { track } = useRudderstackTrack();
    const { profile } = useUser();
    const { defaultPage } = { defaultPage: '/sequences' };

    return (
        <>
            <div className="flex items-center justify-center py-3.5">
                <Title />
            </div>
            <div className="flex h-full flex-col justify-between gap-4 pt-8">
                <section className="flex flex-1 flex-col gap-4">
                    {profile?.created_at && featEmail(new Date(profile.created_at)) && (
                        <ActiveLink href={'/boostbot'} expandedName={t('navbar.boostbot')}>
                            <p className={`whitespace-nowrap text-xs`}>{t('navbar.boostbot')}</p>
                        </ActiveLink>
                    )}
                    <ActiveLink href="/dashboard" expandedName={t('navbar.discover')}>
                        <p className={`whitespace-nowrap text-xs`}>{t('navbar.discover')}</p>
                    </ActiveLink>
                    {profile?.created_at && featEmail(new Date(profile.created_at)) && (
                        <ActiveLink href={defaultPage} expandedName={t('navbar.sequences')}>
                            <p className={`whitespace-nowrap text-xs`}>{t('navbar.sequences')}</p>
                        </ActiveLink>
                    )}
                    {!(profile?.created_at && featEmail(new Date(profile.created_at))) && (
                        <ActiveLink href="/campaigns" expandedName={t('navbar.campaigns')}>
                            <p className={`whitespace-nowrap text-xs`}>{t('navbar.campaigns')}</p>
                        </ActiveLink>
                    )}
                    {!(profile?.created_at && featEmail(new Date(profile.created_at))) && (
                        <ActiveLink href="/performance" expandedName={t('navbar.performance')}>
                            <p className={`whitespace-nowrap text-xs`}>{t('navbar.performance')}</p>
                        </ActiveLink>
                    )}

                    <ActiveLink href="/guide" expandedName={t('navbar.guide')}>
                        <p className={`whitespace-nowrap text-xs`}>{t('navbar.guide')}</p>
                    </ActiveLink>

                    {isRelayEmployee && (
                        <div className="flex flex-col space-y-4 pt-8">
                            <h2 className="text-center text-xs">ADMIN</h2>
                            <ActiveLink href="/admin/clients" expandedName={t('navbar.Clients')}>
                                <p className={`whitespace-nowrap text-xs`}>Clients</p>
                            </ActiveLink>
                        </div>
                    )}
                </section>
                {loggedIn && profileFirstName && (
                    <div className="mb-4 flex w-full flex-row items-center justify-center">
                        <div
                            data-testid="layout-account-menu"
                            onClick={() => {
                                setAccountMenuOpen(!accountMenuOpen);
                                track(OpenAccountModal);
                            }}
                            ref={accountMenuButtonRef}
                            className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 p-2 text-base text-gray-800 shadow-sm"
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
                                        onClick={() => {
                                            window.stop(); // cancel any inflight requests
                                            window.location.href = '/logout';
                                        }}
                                    >
                                        {t('navbar.logout')}
                                    </Button>
                                </div>
                            )}
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
    loggedIn,
    profileFirstName,
}: {
    accountMenuOpen: boolean;
    accountMenuButtonRef: MutableRefObject<null>;
    accountMenuRef: MutableRefObject<null>;
    setAccountMenuOpen: (menu: boolean) => void;
    loggedIn: boolean | null;
    profileFirstName?: string;
}) => {
    // 768px is 'md' in our tailwind
    const { profile } = useUser();
    const { track } = useRudderstackTrack();

    return (
        // mask is the dark overlay that appears when the sidebar is open
        <nav className="z-20 h-full">
            <div
                className={`pointer-events-none fixed inset-0 opacity-0 transition-all`}
                onClick={() => {
                    track(ToggleNavbarSize, {
                        navbar_action: 'Collapse',
                    });
                }}
            />
            <div className="inset-y-0 left-0 flex h-full w-20 transform flex-col border-r border-gray-100 bg-white transition-all">
                <NavBarInner
                    accountMenuOpen={accountMenuOpen}
                    accountMenuButtonRef={accountMenuButtonRef}
                    accountMenuRef={accountMenuRef}
                    setAccountMenuOpen={setAccountMenuOpen}
                    profileFirstName={profileFirstName}
                    loggedIn={loggedIn}
                    isRelayEmployee={profile?.user_role === 'relay_employee'}
                />
            </div>
        </nav>
    );
};
