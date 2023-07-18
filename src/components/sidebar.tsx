import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import useAboveScreenWidth from 'src/hooks/use-above-screen-width';
import EmailOutline from './icons/EmailOutline';
import { useUser } from 'src/hooks/use-user';
import { Compass, FourSquare, Account, Team, PieChart, Guide, Send, Engagements } from './icons';
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
};

const ActiveLink = ({ href, children }: { href: string; children: ReactNode }) => {
    const router = useRouter();

    const pathRoot = router.pathname; // /dashboard/influencers => dashboard

    const isRouteActive = pathRoot === href;

    return (
        <Link
            href={href}
            className={`flex items-center border-l-4 stroke-gray-800 px-4 py-2 text-sm transition hover:stroke-primary-700 hover:text-primary-700 ${
                isRouteActive ? 'border-l-4 border-primary-500 stroke-primary-500 text-primary-500' : ''
            }`}
        >
            {(href === links.influencer || href === links.discover) && (
                <Compass height={18} width={18} className="mr-4 stroke-inherit" />
            )}

            {href === links.campaigns && <FourSquare height={18} width={18} className="mr-4 stroke-inherit" />}

            {href === links.aiEmailGenerator && <EmailOutline height={18} width={18} className="mr-4 stroke-inherit" />}

            {href === links.account && <Account height={18} width={18} className="mr-4 stroke-inherit" />}

            {href === links.admin && <Team height={18} width={18} className="mr-4 stroke-inherit" />}

            {href === links.performance && <PieChart height={18} width={18} className="mr-4 stroke-inherit" />}

            {href === links.guide && <Guide height={18} width={18} className="mr-4 stroke-inherit" />}

            {href === links.sequences && <Send height={18} width={18} className="mr-4 stroke-inherit" />}
            {href === links.inbox && <Engagements height={18} width={18} className="mr-4 stroke-inherit" />}
            {children}
        </Link>
    );
};

const NavBarInner = ({ loggedIn, isRelayEmployee }: { loggedIn: boolean | null; isRelayEmployee: boolean }) => {
    const { t } = useTranslation();

    return (
        <>
            <div className="px-1 pt-5">
                <Title />
            </div>
            <div className="mt-8 flex flex-col space-y-4">
                <ActiveLink href={links.discover}>{t('navbar.discover')}</ActiveLink>
                <ActiveLink href={links.campaigns}>{t('navbar.campaigns')}</ActiveLink>
                <ActiveLink href={links.aiEmailGenerator}>{t('navbar.aiEmailGenerator')}</ActiveLink>
                <ActiveLink href={links.performance}>{t('navbar.performance')}</ActiveLink>
                {loggedIn && <ActiveLink href="/account">{t('navbar.account')}</ActiveLink>}
                <ActiveLink href="/guide">{t('navbar.guide')}</ActiveLink>
                {featEmail() && <ActiveLink href={links.sequences}>{t('navbar.sequences')}</ActiveLink>}
                {featEmail() && <ActiveLink href={links.inbox}>{t('navbar.inbox')}</ActiveLink>}
            </div>
            {isRelayEmployee && (
                <div className="mt-8 flex flex-col space-y-4">
                    <h2 className="ml-6">ADMIN</h2>
                    <ActiveLink href={links.admin}>Clients</ActiveLink>
                </div>
            )}
        </>
    );
};

export const Sidebar = ({
    loggedIn,
    open,
    setOpen,
}: {
    loggedIn: boolean | null;
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
        <>
            <div
                className={`fixed inset-0 z-50 transition-all  ${
                    desktop || !open ? 'pointer-events-none opacity-0' : 'bg-black opacity-50'
                }`}
                onClick={() => setOpen(false)}
            />
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-100 bg-white transition-all ${
                    open ? 'translate-x-0' : '-translate-x-full'
                } ${open && desktop ? 'md:relative' : ''}`}
            >
                <NavBarInner loggedIn={loggedIn} isRelayEmployee={profile?.user_role === 'relay_employee'} />
            </div>
        </>
    );
};
