import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, type MutableRefObject, type ReactNode } from 'react';
import { useUser } from 'src/hooks/use-user';
import { OldSearch, Team, Guide, BarGraph, ThunderSearch, FourSquare, ThunderMail, Inbox } from '../icons';
import { Title } from '../title';
import { useTranslation } from 'react-i18next';
import { featEmail } from 'src/constants/feature-flags';
import { Button } from '../button';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { OpenAccountModal } from 'src/utils/analytics/events';
import { NavigateToPage } from 'src/utils/analytics/events';
import { Tooltip } from '../library';
import { usePathname } from 'next/navigation';

const links: Record<string, (pathRoot: string, hovering?: boolean) => JSX.Element> = {
    '/dashboard': (_pathRoot: string) => <OldSearch height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/influencer': (_pathRoot: string) => <OldSearch height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/account': (_pathRoot: string) => <Team height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/admin/clients': (_pathRoot: string) => <Team height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/performance': (_pathRoot: string) => <BarGraph height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/guide': (_pathRoot: string) => <Guide height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/sequences': (_pathRoot: string) => <ThunderMail height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/inbox': (_pathRoot: string) => <Inbox height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/boostbot': (_pathRoot: string) => <ThunderSearch height={20} width={20} className="my-0.5 stroke-inherit" />,
    '/campaigns': (_pathRoot: string) => <FourSquare height={20} width={20} className="my-0.5 stroke-inherit" />,
} as const;

// eslint-disable-next-line complexity
const ActiveLink = ({ href, children, expandedName }: { href: string; children: ReactNode; expandedName: string }) => {
    const pathname = usePathname();
    const pathRoot = pathname === '/' ? '/' : `/${pathname?.split('/')[1]}`;
    const [hovering, setHovering] = useState(false);
    const isRouteActive = pathRoot === href;

    return (
        <Tooltip content={expandedName} position="inset-right" contentSize="small" delay={500} enabled={false}>
            <Link
                onMouseOver={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                href={href}
                className={`flex flex-col items-center gap-1 overflow-visible border-l-4 stroke-violet-200 py-2 font-poppins text-sm text-violet-200 transition hover:stroke-white hover:text-white ${
                    isRouteActive ? 'border-primary-500 stroke-primary-500 text-primary-500' : 'border-transparent'
                }`}
                onClick={() => null}
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
                        <ActiveLink href={'/sequences'} expandedName={t('navbar.sequences')}>
                            <p className={`whitespace-nowrap text-xs`}>{t('navbar.sequences')}</p>
                        </ActiveLink>
                    )}
                    {profile?.created_at && featEmail(new Date(profile.created_at)) && (
                        <ActiveLink href="/inbox" expandedName={t('navbar.inbox')}>
                            <p className={`whitespace-nowrap text-xs`}>{t('navbar.inbox')}</p>
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

export const SidebarV2 = ({
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
    const { t } = useTranslation();
    return (
        // mask is the dark overlay that appears when the sidebar is open
        <nav className="z-20 h-full">
            <div className="inset-y-0 left-0 flex h-full w-20 transform flex-col border-r bg-gradient-to-tr from-violet-900 to-violet-700 transition-all">
                <div className="flex items-center justify-center">
                    <div className="mt-3 rounded-full bg-white p-3">
                        <Title />
                    </div>
                </div>
                <div className="flex h-full flex-col justify-between gap-4 pt-8">
                    <section className="flex flex-1 flex-col gap-4">
                        <ActiveLink href={'/boostbot'} expandedName={t('navbar.boostbot')}>
                            <p className={`whitespace-nowrap text-xs`}>{t('navbar.boostbot')}</p>
                        </ActiveLink>
                        <ActiveLink href="/dashboard" expandedName={t('navbar.discover')}>
                            <p className={`whitespace-nowrap text-xs`}>{t('navbar.discover')}</p>
                        </ActiveLink>
                        <ActiveLink href={'/sequences'} expandedName={t('navbar.sequences')}>
                            <p className={`whitespace-nowrap text-xs`}>{t('navbar.sequences')}</p>
                        </ActiveLink>
                        <ActiveLink href="/inbox" expandedName={t('navbar.inbox')}>
                            <p className={`whitespace-nowrap text-xs`}>{t('navbar.inbox')}</p>
                        </ActiveLink>
                        <ActiveLink href="/campaigns" expandedName={t('navbar.campaigns')}>
                            <p className={`whitespace-nowrap text-xs`}>{t('navbar.campaigns')}</p>
                        </ActiveLink>
                        <ActiveLink href="/performance" expandedName={t('navbar.performance')}>
                            <p className={`whitespace-nowrap text-xs`}>{t('navbar.performance')}</p>
                        </ActiveLink>
                        <ActiveLink href="/guide" expandedName={t('navbar.guide')}>
                            <p className={`whitespace-nowrap text-xs`}>{t('navbar.guide')}</p>
                        </ActiveLink>
                    </section>
                </div>
            </div>
        </nav>
    );
};
