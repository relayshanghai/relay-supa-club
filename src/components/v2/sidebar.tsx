import Link from 'next/link';
import { useState, type MutableRefObject, type ReactNode } from 'react';
import { OldSearch, Team, Guide, BarGraph, ThunderSearch, FourSquare, ThunderMail, Inbox } from '../icons';
import { Title } from '../title';
import { useTranslation } from 'react-i18next';
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
    '/products': (_pathRoot: string) => <FourSquare height={20} width={20} className="my-0.5 stroke-inherit" />,
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

export const SidebarV2 = ({}: {
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
                        <ActiveLink href="/products" expandedName={t('navbar.products')}>
                            <p className={`whitespace-nowrap text-xs`}>{t('navbar.products')}</p>
                        </ActiveLink>
                        <ActiveLink href={'/sequences'} expandedName={t('navbar.sequences')}>
                            <p className={`whitespace-nowrap text-xs`}>{t('navbar.sequences')}</p>
                        </ActiveLink>
                        <ActiveLink href="/inbox" expandedName={t('navbar.inbox')}>
                            <p className={`whitespace-nowrap text-xs`}>{t('navbar.inbox')}</p>
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
