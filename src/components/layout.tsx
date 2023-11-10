import { useEffect, useRef, useState } from 'react';
import { LanguageToggle } from 'src/components/common/language-toggle';
import { Sidebar } from 'src/components/sidebar';

import { useUser } from 'src/hooks/use-user';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';
import ClientRoleWarning from './search/client-role-warning';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { useRouter } from 'next/router';
import { useSequence } from 'src/hooks/use-sequence';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useCampaigns } from 'src/hooks/use-campaigns';
import { useReport } from 'src/hooks/use-report';
import type { CreatorPlatform } from 'types';
import { VisitPage } from 'src/utils/analytics/events';

const pageNameMap: { [key: string]: string } = {
    sequences: 'sequences',
    dashboard: 'discover',
    campaigns: 'campaigns',
    account: 'account',
    'influencer-manager': 'influencerManager',
    inbox: 'inbox',
    guide: 'guide',
    boostbot: 'boostbot',
};

export const Layout = ({ children }: any) => {
    const { profile, loading, refreshProfile, logout } = useUser();
    const { track } = useRudderstackTrack();

    useEffect(() => {
        track(VisitPage);
    }, [track]);

    useEffect(() => {
        // this fixes a bug where the profile is not loaded on the first page load when coming from signup
        if (!loading && !profile?.id) refreshProfile();
    }, [refreshProfile, profile, loading]);

    const { t } = useTranslation();

    const router = useRouter();

    const routerPath = router.asPath
        .split('/')
        .slice(1)
        .map((p) => p.split('?')[0]);

    const { sequence } = useSequence(routerPath.length > 1 && routerPath.includes('sequences') ? routerPath[1] : '');
    const { campaign } = useCampaigns({
        campaignId: routerPath.length > 1 && routerPath.includes('campaigns') ? routerPath[1] : '',
    });
    const { influencer } = useReport(
        routerPath.length > 1 && routerPath.includes('influencer')
            ? {
                  creator_id: routerPath[2],
                  platform: routerPath[1] as CreatorPlatform,
              }
            : {
                  creator_id: '',
                  platform: 'youtube',
              },
    );

    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const accountMenuRef = useRef(null);
    const accountMenuButtonRef = useRef(null);
    useOnOutsideClick(accountMenuRef, () => setAccountMenuOpen(false), accountMenuButtonRef);

    return (
        <div className="fixed flex h-screen w-screen">
            <Sidebar
                accountMenuOpen={accountMenuOpen}
                accountMenuButtonRef={accountMenuButtonRef}
                accountMenuRef={accountMenuRef}
                setAccountMenuOpen={setAccountMenuOpen}
                logout={logout}
                loggedIn={!!profile?.id && !loading}
                profileFirstName={profile?.first_name}
            />
            <div className="flex w-full max-w-full flex-col overflow-hidden">
                <div className="z-30 flex items-center justify-between bg-white shadow-sm shadow-gray-200">
                    <div className="flex items-center">
                        <p className="flex flex-row items-center gap-2 pl-4">
                            {routerPath.includes('influencer') ? (
                                <p className="text-sm font-semibold text-gray-600">
                                    {influencer && t('navbar.report', { influencerName: influencer.name })}
                                </p>
                            ) : (
                                routerPath.map((path, index) => {
                                    return (
                                        <Link
                                            href={`/${routerPath.slice(0, index + 1).join('/')}`}
                                            className="flex items-center gap-2"
                                            key={index}
                                        >
                                            <span
                                                className={`text-sm ${
                                                    index === routerPath.length - 1
                                                        ? 'font-semibold text-gray-600'
                                                        : 'font-medium text-gray-400'
                                                }`}
                                            >
                                                {routerPath[index - 1] === 'sequences' && sequence?.name}
                                                {routerPath[index - 1] === 'campaigns' && campaign?.name}
                                                {routerPath[index - 1] !== 'sequences' &&
                                                    routerPath[index - 1] !== 'campaigns' &&
                                                    t(`navbar.${pageNameMap[path]}`)}
                                            </span>
                                            <span className="text-[9px] font-semibold text-gray-400">
                                                {index !== routerPath.length - 1 && ' / '}
                                            </span>
                                        </Link>
                                    );
                                })
                            )}
                        </p>
                    </div>
                    <div className="flex flex-row items-center space-x-4 px-8 py-4">
                        <LanguageToggle />
                    </div>
                </div>
                <div className="h-full w-full overflow-auto">{children}</div>
            </div>
            <ClientRoleWarning />
        </div>
    );
};
