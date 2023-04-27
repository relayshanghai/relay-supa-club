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
import { useAtomValue } from 'jotai';
import { clientRoleAtom } from 'src/atoms/client-role-atom';

const ActiveLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const router = useRouter();

    const pathRoot = router.pathname; // /dashboard/influencers => dashboard

    let isRouteActive = pathRoot === href;

    // influencers page special case
    // if (pathRoot === 'influencer' && hrefRoot === 'dashboard') {
    //     isRouteActive = true;
    // }
    // if (href === '/admin/clients' && router.pathname === '/admin/clients') {
    //     isRouteActive = true;
    // }

    if (href.includes('/admin/campaigns') && router.pathname.includes('/admin/campaigns')) {
        isRouteActive = true;
    }

    if (href.includes('/admin/search') && router.pathname.includes('/admin/search')) {
        isRouteActive = true;
    }

    return (
        <Link
            href={href}
            className={`flex items-center border-l-4 stroke-gray-800 px-4 py-2 text-sm transition hover:stroke-primary-700 hover:text-primary-700 ${
                isRouteActive ? 'border-l-4 border-primary-500 stroke-primary-500 text-primary-500' : ''
            }`}
        >
            {(href === '/influencer' || href === '/dashboard' || href.includes('/admin/search')) && (
                <Compass height={18} width={18} className="mr-4 text-inherit" />
            )}

            {href === '/campaigns' ||
                (href.includes('/admin/campaigns') && (
                    <FourSquare height={18} width={18} className="mr-4 stroke-inherit" />
                ))}

            {href === '/ai-email-generator' && <EmailOutline height={18} width={18} className="mr-4 stroke-inherit" />}

            {href === '/account' && <Account height={18} width={18} className="mr-4 stroke-inherit" />}

            {href === '/admin/clients' && <Team height={18} width={18} className="mr-4 stroke-inherit" />}

            {href === '/performance' && <PieChart height={18} width={18} className="mr-4 stroke-inherit" />}
            {children}
        </Link>
    );
};

const NavBarInner = ({ loggedIn, isRelayEmployee }: { loggedIn: boolean | null; isRelayEmployee: boolean }) => {
    const { t } = useTranslation();
    const clientRoleData = useAtomValue(clientRoleAtom);

    return (
        <>
            <div className="px-1 pt-5">
                <Title />
            </div>
            <div className="mt-8 flex flex-col space-y-4">
                <ActiveLink
                    href={
                        clientRoleData.companyId.length > 0 ? `/admin/search/${clientRoleData.companyId}` : '/dashboard'
                    }
                >
                    {t('navbar.influencers')}
                </ActiveLink>
                <ActiveLink
                    href={
                        clientRoleData.companyId.length > 0
                            ? `/admin/campaigns/${clientRoleData.companyId}`
                            : '/campaigns'
                    }
                >
                    {t('navbar.campaigns')}
                </ActiveLink>
                <ActiveLink href="/ai-email-generator">{t('navbar.aiEmailGenerator')}</ActiveLink>
                {FEAT_PERFORMANCE && <ActiveLink href="/performance">{t('navbar.performance')}</ActiveLink>}
                {loggedIn && <ActiveLink href="/account">{t('navbar.account')}</ActiveLink>}
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
