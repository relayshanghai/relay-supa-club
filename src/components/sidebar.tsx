import { t } from 'i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useAboveScreenWidth from 'src/hooks/use-above-screen-width';
import EmailOutline from './icons/EmailOutline';
import { useUser } from 'src/hooks/use-user';
import { Compass, FourSquare, Account, Team } from './icons';
import { Title } from './title';

const ActiveLink = ({ href, children }: { href: string; children: string }) => {
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
        <Link href={href}>
            <a
                className={`flex items-center py-2 px-4 text-sm transition hover:text-primary-700 border-l-4 ${
                    isRouteActive ? 'text-primary-500 border-primary-500 border-l-4' : ''
                }`}
            >
                {(hrefRoot === 'influencer' || hrefRoot === 'dashboard') && (
                    <Compass height={18} width={18} className="mr-4 text-inherit" />
                )}
                {hrefRoot === 'campaigns' && (
                    <FourSquare height={18} width={18} className="mr-4 text-inherit" />
                )}
                {hrefRoot === 'ai-email-generator' && (
                    <EmailOutline height={18} width={18} className="mr-4 text-inherit" />
                )}
                {hrefRoot === 'account' && (
                    <Account height={18} width={18} className="mr-4 text-inherit" />
                )}
                {href === '/admin/clients' && (
                    <Team height={18} width={18} className="mr-4 text-inherit" />
                )}
                {children}
            </a>
        </Link>
    );
};

const NavBarInner = ({
    loggedIn,
    isRelayEmployee,
}: {
    loggedIn: boolean | null;
    isRelayEmployee: boolean;
}) => (
    <>
        <div className="px-1 pt-5">
            <Title />
        </div>
        <div className="flex flex-col space-y-4 mt-8">
            <ActiveLink href="/dashboard">{t('navbar.influencers')}</ActiveLink>
            <ActiveLink href="/campaigns">{t('navbar.campaigns')}</ActiveLink>
            <ActiveLink href="/ai-email-generator">{t('navbar.ai-email-generator')}</ActiveLink>
            {loggedIn && <ActiveLink href="/account">{t('navbar.account')}</ActiveLink>}
        </div>
        {isRelayEmployee && (
            <div className="flex flex-col space-y-4 mt-8">
                <h2 className="ml-6">ADMIN</h2>
                <ActiveLink href="/admin/clients">Clients</ActiveLink>
            </div>
        )}
    </>
);

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
                className={`fixed inset-0 transition-all z-50  ${
                    desktop || !open ? 'opacity-0 pointer-events-none' : 'bg-black opacity-50'
                }`}
                onClick={() => setOpen(false)}
            />
            
            

            <div
                className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 transition-all transform z-50 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                } ${open && desktop ? 'md:relative' : ''}`}
            >
                <NavBarInner
                    loggedIn={loggedIn}
                    isRelayEmployee={profile?.role === 'relay_employee'}
                />
            </div>
        </>
    );
};
