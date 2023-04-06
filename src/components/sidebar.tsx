import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useAboveScreenWidth from 'src/hooks/use-above-screen-width';
import EmailOutline from './icons/EmailOutline';
import { useUser } from 'src/hooks/use-user';
import { Compass, FourSquare, Account, Team, PieChart } from './icons';
import { Title } from './title';
import { useTranslation } from 'react-i18next';
import { FEAT_PERFORMANCE } from 'src/constants/feature-flags';
import React from 'react';

const ActiveLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const router = useRouter();
    const pathRoot = router.pathname.split('/')[1]; // /dashboard/influencers => dashboard
    const hrefRoot = href.split('/')[1]; // /dashboard/influencers => dashboard

    let isRouteActive = pathRoot === hrefRoot;

    // influencers page special case
    if (pathRoot === 'influencer' && hrefRoot === 'dashboard') {
        isRouteActive = true;
    }
    if (href === '/admin/clients' && router.pathname === '/admin/clients') {
        isRouteActive = true;
    }

    return (
        <Link
            href={href}
            className={`flex items-center border-l-4 stroke-gray-800 py-2 px-4 text-sm transition hover:stroke-primary-700 hover:text-primary-700 ${
                isRouteActive ? 'border-l-4 border-primary-500 stroke-primary-500 text-primary-500' : ''
            }`}
        >
            {(hrefRoot === 'influencer' || hrefRoot === 'dashboard') && (
                <Compass height={18} width={18} className="mr-4 text-inherit" />
            )}
            {hrefRoot === 'campaigns' && <FourSquare height={18} width={18} className="mr-4 stroke-inherit" />}
            {hrefRoot === 'ai-email-generator' && (
                <EmailOutline height={18} width={18} className="mr-4 stroke-inherit" />
            )}
            {hrefRoot === 'account' && <Account height={18} width={18} className="mr-4 stroke-inherit" />}
            {href === '/admin/clients' && <Team height={18} width={18} className="mr-4 stroke-inherit" />}
            {href === '/performance' && <PieChart height={18} width={18} className="mr-4 stroke-inherit" />}
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
                <ActiveLink href="/dashboard">{t('navbar.influencers')}</ActiveLink>
                <ActiveLink href="/campaigns">{t('navbar.campaigns')}</ActiveLink>

                <ActiveLink href="/ai-email-generator">
                    {t('navbar.aiEmailGenerator')}
                    <span className="py-1/2 font-base ml-2 w-fit rounded-2xl bg-primary-500 px-2 text-[0.65rem] text-white">
                        BETA
                    </span>
                </ActiveLink>
                {loggedIn && <ActiveLink href="/account">{t('navbar.account')}</ActiveLink>}
                {FEAT_PERFORMANCE && <ActiveLink href="/performance">{t('navbar.performance')}</ActiveLink>}
            </div>
            {isRelayEmployee && (
                <div className="mt-8 flex flex-col space-y-4">
                    <h2 className="ml-6">ADMIN</h2>
                    <ActiveLink href="/admin/clients">Clients</ActiveLink>
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
