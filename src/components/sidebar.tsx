import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import useAboveScreenWidth from 'src/hooks/use-above-screen-width';
import EmailOutline from './icons/EmailOutline';
import { useUser } from 'src/hooks/use-user';
import { Compass, FourSquare, Team, Guide, Send, Engagements, ProfilePlus, BarGraph } from './icons';
import { Title } from './title';
import { useTranslation } from 'react-i18next';
import { featEmail } from 'src/constants/feature-flags';

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
};

// eslint-disable-next-line complexity
const ActiveLink = ({ href, children }: { href: string; children: ReactNode }) => {
    const router = useRouter();

    const pathRoot = router.pathname; // /dashboard/influencers => dashboard

    const isRouteActive = pathRoot === href;

    return (
        <Link
            href={href}
            className={`flex items-center overflow-hidden border-l-4 stroke-gray-800 py-2 pl-4 text-sm transition hover:stroke-primary-700 hover:text-primary-700 ${
                isRouteActive ? 'border-l-4 border-primary-500 stroke-primary-500 text-primary-500' : ''
            }`}
        >
            {(href === links.influencer || href === links.discover) && (
                <Compass height={18} width={18} className="my-0.5 mr-4 stroke-inherit" />
            )}

            {href === links.campaigns && <FourSquare height={18} width={18} className="my-0.5 mr-4 stroke-inherit" />}

            {href === links.aiEmailGenerator && (
                <EmailOutline height={18} width={18} className="my-0.5 mr-4 stroke-inherit" />
            )}

            {href === links.admin && <Team height={18} width={18} className="my-0.5 mr-4 stroke-inherit" />}

            {href === links.performance && <BarGraph height={18} width={18} className="my-0.5 mr-4 stroke-inherit" />}

            {href === links.guide && <Guide height={18} width={18} className="my-0.5 mr-4 stroke-inherit" />}

            {href === links.sequences && <Send height={18} width={18} className="my-0.5 mr-4 stroke-inherit" />}
            {href === links.inbox && <Engagements height={18} width={18} className="my-0.5 mr-4 stroke-inherit" />}
            {href === links.influencerManager && (
                <ProfilePlus height={18} width={18} className="my-0.5 mr-4 stroke-inherit" />
            )}
            {children}
        </Link>
    );
};

// eslint-disable-next-line complexity
const NavBarInner = ({
    loggedIn,
    profileFirstName,
    isRelayEmployee,
    open,
    desktop,
}: {
    loggedIn: boolean | null;
    profileFirstName?: string;
    isRelayEmployee: boolean;
    open: boolean;
    desktop: boolean;
}) => {
    const { t } = useTranslation();

    return (
        <>
            <div className={`pt-5`}>
                <Title open={open && desktop} />
            </div>
            <div className="flex h-full flex-col justify-between gap-4 pt-8">
                <section className="flex flex-col gap-4">
                    <ActiveLink href={links.discover}>
                        <p className={`whitespace-nowrap text-sm ${open && desktop ? 'visible' : 'hidden'}`}>
                            {t('navbar.discover')}
                        </p>
                    </ActiveLink>
                    {featEmail() && (
                        <ActiveLink href={links.sequences}>
                            <p className={`whitespace-nowrap text-sm ${open && desktop ? 'visible' : 'hidden'}`}>
                                {t('navbar.sequences')}
                            </p>
                        </ActiveLink>
                    )}
                    {featEmail() && (
                        <ActiveLink href={links.inbox}>
                            <p className={`whitespace-nowrap text-sm ${open && desktop ? 'visible' : 'hidden'}`}>
                                {t('navbar.inbox')}
                            </p>
                        </ActiveLink>
                    )}
                    {featEmail() && (
                        <ActiveLink href={links.influencerManager}>
                            <p className={`whitespace-nowrap text-sm ${open && desktop ? 'visible' : 'hidden'}`}>
                                {t('navbar.influencerManager')}
                            </p>
                        </ActiveLink>
                    )}
                    <ActiveLink href={links.campaigns}>
                        <p className={`whitespace-nowrap text-sm ${open && desktop ? 'visible' : 'hidden'}`}>
                            {t('navbar.campaigns')}
                        </p>
                    </ActiveLink>
                    <ActiveLink href={links.performance}>
                        <p className={`whitespace-nowrap text-sm ${open && desktop ? 'visible' : 'hidden'}`}>
                            {t('navbar.performance')}
                        </p>
                    </ActiveLink>
                    <ActiveLink href={links.aiEmailGenerator}>
                        <p className={`whitespace-nowrap text-sm ${open && desktop ? 'visible' : 'hidden'}`}>
                            {t('navbar.aiEmailGenerator')}
                        </p>
                    </ActiveLink>
                    <ActiveLink href="/guide">
                        <p className={`whitespace-nowrap text-sm ${open && desktop ? 'relative' : 'hidden'}`}>
                            {t('navbar.guide')}
                        </p>
                    </ActiveLink>
                </section>
                {loggedIn && profileFirstName && (
                    <ActiveLink href="/account">
                        <div className="-ml-1.5 mb-4 flex flex-row items-center gap-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-400 p-2 text-lg">
                                {profileFirstName[0]}
                            </div>
                            <div
                                className={`flex flex-col whitespace-nowrap text-xs ${
                                    open && desktop ? 'visible' : 'hidden'
                                }`}
                            >
                                <p className="font-semibold">{profileFirstName}</p>
                                <p className="font-light">
                                    Discover beta!
                                    <span className="align-super text-[8px] text-primary-500">Upgrade</span>
                                </p>
                            </div>
                        </div>
                    </ActiveLink>
                )}
            </div>
            {isRelayEmployee && (
                <div className="flex flex-col space-y-4 pt-8">
                    <h2 className="ml-6">ADMIN</h2>
                    <ActiveLink href={links.admin}>Clients</ActiveLink>
                </div>
            )}
        </>
    );
};

export const Sidebar = ({
    loggedIn,
    profileFirstName,
    open,
    setOpen,
}: {
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
