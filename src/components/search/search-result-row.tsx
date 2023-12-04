import { useCallback, useEffect, useState } from 'react';
import { Menu } from '@headlessui/react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { DotsHorizontal, ShareLink } from 'src/components/icons';
import { featEmail, featRecommended } from 'src/constants/feature-flags';
import useAboveScreenWidth from 'src/hooks/use-above-screen-width';
import { useSearch, useSearchResults } from 'src/hooks/use-search';
import { imgProxy } from 'src/utils/fetcher';
import { decimalToPercent, numberFormatter } from 'src/utils/formatter';
import { Badge, Tooltip } from '../library';
import { SkeletonSearchResultRow } from '../common/skeleton-search-result-row';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { isRecommendedInfluencer } from 'src/utils/utils';
import type { CampaignCreatorBasicInfo } from 'src/utils/api/db/calls/campaignCreators';
import { useAtom } from 'jotai';
import { clientRoleAtom } from 'src/atoms/client-role-atom';
import { SearchOpenExternalSocialProfile } from 'src/utils/analytics/events';
import { useAnalytics } from '../analytics/analytics-provider';
import { SearchLoadMoreResults } from 'src/utils/analytics/events';
import { SEARCH_RESULT_ROW } from 'src/utils/rudderstack/event-names';
import type { track } from './use-track-event';

import type { AllSequenceInfluencersIqDataIdsAndSequenceNames } from 'src/hooks/use-all-sequence-influencers-iqdata-id-and-sequence';
import { AddToSequenceButton } from './add-to-sequence-button';
import { useUser } from 'src/hooks/use-user';
import type { analyzeInfluencerParams } from 'src/hooks/use-analyze-influencer';
import { useAnalyzeInfluencer } from 'src/hooks/use-analyze-influencer';
import { getJourney } from 'src/utils/analytics/journey';
import { clientLogger } from 'src/utils/logger-client';
import type { ClassicSearchInfluencer } from 'pages/api/influencer-search';

export interface SearchResultRowProps {
    creator: ClassicSearchInfluencer;
    setSelectedCreator: (creator: ClassicSearchInfluencer) => void;
    setShowCampaignListModal: (show: boolean) => void;
    setShowAlreadyAddedModal: (show: boolean) => void;
    allCampaignCreators?: CampaignCreatorBasicInfo[];
    allSequenceInfluencersIqDataIdsAndSequenceNames?: AllSequenceInfluencersIqDataIdsAndSequenceNames[];
    trackSearch?: track;
    batchId: number;
    page: number;
    resultIndex: number;
}
export interface MoreResultsRowsProps extends Omit<SearchResultRowProps, 'creator'> {
    page: number;
}

export const MoreResultsRows = ({
    page,
    setShowCampaignListModal,
    setSelectedCreator,
    setShowAlreadyAddedModal,
    allCampaignCreators,
    allSequenceInfluencersIqDataIdsAndSequenceNames,
    trackSearch,
    batchId,
    resultIndex,
}: MoreResultsRowsProps) => {
    const { t } = useTranslation();
    const { resultsPerPageLimit, searchParams } = useSearch();
    const { results, loading, error, setOnLoad } = useSearchResults(page);

    useEffect(() => {
        if (!trackSearch || page === 0 || searchParams === undefined) return;

        const controller = new AbortController();

        const tracker = (result: any) => {
            trackSearch<typeof SearchLoadMoreResults>({
                event: SearchLoadMoreResults,
                controller,
                payload: {
                    event_id: result.__metadata?.event_id,
                    snapshot_id: result.__metadata?.snapshot_id,
                    parameters_id: result.__metadata?.parameters_id,
                    parameters: searchParams,
                    page: searchParams.page ?? 0,
                },
            });
        };

        setOnLoad(() => tracker);

        return () => controller.abort();
    }, [trackSearch, searchParams, page, setOnLoad]);

    if (error)
        return (
            <tr>
                <td className="py-4 text-center" colSpan={5}>
                    {t('creators.searchResultError')}
                </td>
            </tr>
        );

    if (loading) {
        return (
            <>
                {new Array(resultsPerPageLimit).fill(0).map((_, i) => (
                    <SkeletonSearchResultRow key={i} delay={i * 200} />
                ))}
            </>
        );
    }
    if (results) {
        return (
            <>
                {results?.map((creator) => (
                    <SearchResultRow
                        key={creator.user_id}
                        creator={creator}
                        setShowCampaignListModal={setShowCampaignListModal}
                        setSelectedCreator={setSelectedCreator}
                        setShowAlreadyAddedModal={setShowAlreadyAddedModal}
                        allCampaignCreators={allCampaignCreators}
                        allSequenceInfluencersIqDataIdsAndSequenceNames={
                            allSequenceInfluencersIqDataIdsAndSequenceNames
                        }
                        batchId={batchId}
                        page={page}
                        resultIndex={resultIndex}
                    />
                ))}
            </>
        );
    }
    return null;
};

// @todo refactor complexity
// eslint-disable-next-line complexity
export const SearchResultRow = ({
    creator,
    setShowCampaignListModal,
    setSelectedCreator,
    allCampaignCreators,
    allSequenceInfluencersIqDataIdsAndSequenceNames,
    setShowAlreadyAddedModal,
    batchId,
    page,
    resultIndex,
}: SearchResultRowProps) => {
    const { t } = useTranslation();
    const { platform, recommendedInfluencers } = useSearch();
    const { profile } = useUser();
    const { trackEvent } = useRudderstack();
    const { track } = useAnalytics();
    const {
        username,
        custom_name,
        fullname,
        user_id,
        url,
        picture,
        followers,
        engagements,
        engagement_rate,
        avg_views,
    } = creator;
    const handle = username || custom_name || fullname || '';

    const addToCampaign = async () => {
        setSelectedCreator(creator);
        let isAlreadyInCampaign = false;

        if (allCampaignCreators) {
            for (const campaignCreator of allCampaignCreators) {
                if (campaignCreator?.campaign_id && creator.user_id) {
                    if (campaignCreator.creator_id === creator.user_id) {
                        isAlreadyInCampaign = true;
                        break;
                    }
                }
            }
        }

        if (isAlreadyInCampaign) {
            setShowAlreadyAddedModal(true);
        } else {
            setShowCampaignListModal(true);
        }
        trackEvent(SEARCH_RESULT_ROW('add to campaign'), { platform, user_id });
    };

    const desktop = useAboveScreenWidth(500);
    const [clientRoleData] = useAtom(clientRoleAtom);
    const inActAsMode = clientRoleData.companyId?.length > 0;
    const journey = getJourney();

    const analyzeInfluencerFn = useAnalyzeInfluencer();
    const analyzeInfluencer = useCallback(
        (params: Omit<analyzeInfluencerParams, 'searchId' | 'initiator' | 'openType'>) => {
            if (!journey) {
                clientLogger('Journey is undefined', 'error', true);
                return;
            }
            analyzeInfluencerFn({ ...params, searchId: journey.id, initiator: 'user', openType: 'single' });
        },
        [analyzeInfluencerFn, journey],
    );

    const openSocialProfile = useCallback(
        (args: { url: string }) => {
            const { url } = args;
            track(SearchOpenExternalSocialProfile, { url });
            trackEvent(SEARCH_RESULT_ROW('open social link'), { url });
        },
        [track, trackEvent],
    );

    const [showMenu, setShowMenu] = useState(false);

    return (
        <tr className="group hover:bg-primary-100">
            <td className="flex w-full">
                <div className="relative flex flex-row gap-x-2 px-4 py-2">
                    <img
                        key={picture}
                        src={imgProxy(picture) as string}
                        className="h-12 w-12 [min-width:3rem]"
                        alt={handle}
                    />
                    <div>
                        <div className="font-bold">{fullname}</div>
                        <Link
                            href={url || ''}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="line-clamp-1 text-sm text-primary-500"
                        >
                            {handle ? `@${handle}` : null}
                        </Link>
                    </div>
                </div>
                <div className="mt-2">
                    {featRecommended() && isRecommendedInfluencer(recommendedInfluencers, platform, user_id) && (
                        <Tooltip
                            content={t('creators.recommendedTooltip')}
                            detail={t('creators.recommendedTooltipDetail')}
                            className="flex flex-wrap items-center"
                        >
                            <Badge size={desktop ? 'medium' : 'small'} data-testid="recommended-badge">
                                {t('creators.recommended')}
                            </Badge>
                        </Tooltip>
                    )}
                </div>
            </td>
            <td className="pr-4 text-right text-sm">{numberFormatter(followers) ?? '-'}</td>
            <td className="pr-4 text-right text-sm">{numberFormatter(engagements) ?? '-'}</td>
            <td className="pr-4 text-right text-sm">{decimalToPercent(engagement_rate) ?? '-'}</td>
            <td className="pr-4 text-right text-sm">{numberFormatter(avg_views) ?? '-'}</td>

            <td className="sticky right-0 lg:relative">
                <div className="relative hidden flex-row items-center justify-center gap-2 duration-100 group-hover:opacity-100 lg:flex lg:opacity-100">
                    <Link
                        href={`/influencer/${platform}/${user_id}`}
                        target={inActAsMode ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        onClick={() => analyzeInfluencer({ platform, user_id, batchId, page, resultIndex })}
                        data-testid={`analyze-button/${user_id}`}
                    >
                        <Button className="flex flex-row items-center" variant="secondary">
                            <span className="">{t('creators.analyzeProfile')}</span>
                        </Button>
                    </Link>

                    {profile?.created_at && featEmail(new Date(profile?.created_at)) ? (
                        <AddToSequenceButton
                            creatorProfile={creator}
                            allSequenceInfluencersIqDataIdsAndSequenceNames={
                                allSequenceInfluencersIqDataIdsAndSequenceNames ?? []
                            }
                            platform={platform}
                        />
                    ) : (
                        <Button
                            onClick={addToCampaign}
                            className="flex items-center gap-1"
                            data-testid={`add-to-campaign-button/${user_id}`}
                        >
                            <PlusCircleIcon className="w-5" />
                            <span className="">{t('creators.addToCampaign')}</span>
                        </Button>
                    )}
                </div>

                <div className="flex flex-col items-center justify-center gap-1 lg:hidden">
                    <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button as="div" data-testid={`search-result-row-buttons/${user_id}`}>
                            <Button onClick={() => setShowMenu(true)}>
                                <DotsHorizontal />
                            </Button>
                        </Menu.Button>

                        <Menu.Items
                            className="absolute right-0 top-0 mr-16 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                            static
                        >
                            {showMenu && (
                                <div className="px-1 py-1">
                                    {profile?.created_at && featEmail(new Date(profile.created_at)) ? (
                                        <Menu.Item>
                                            {({ active }) => (
                                                <AddToSequenceButton
                                                    inMenu
                                                    active={active}
                                                    creatorProfile={creator}
                                                    allSequenceInfluencersIqDataIdsAndSequenceNames={
                                                        allSequenceInfluencersIqDataIdsAndSequenceNames ?? []
                                                    }
                                                    platform={platform}
                                                    setShowMenu={setShowMenu}
                                                />
                                            )}
                                        </Menu.Item>
                                    ) : (
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={`${
                                                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                    } group flex w-full items-center justify-center rounded-md px-2 py-2 text-sm`}
                                                    onClick={() => {
                                                        addToCampaign();
                                                        setShowMenu(false);
                                                    }}
                                                >
                                                    {t('creators.addToCampaign')}
                                                </button>
                                            )}
                                        </Menu.Item>
                                    )}

                                    <Link
                                        href={`/influencer/${platform}/${user_id}`}
                                        target="_blank"
                                        data-testid={`analyze-button/${user_id}`}
                                    >
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={`${
                                                        active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                    } group flex w-full items-center justify-center rounded-md px-2 py-2 text-sm`}
                                                    onClick={() => {
                                                        analyzeInfluencer({
                                                            platform,
                                                            user_id,
                                                            batchId,
                                                            page,
                                                            resultIndex,
                                                        });
                                                        setShowMenu(false);
                                                    }}
                                                >
                                                    {t('creators.analyzeProfile')}
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </Link>

                                    {url && (
                                        <Link href={url} target="_blank" rel="noopener noreferrer">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => {
                                                            openSocialProfile({ url });
                                                            setShowMenu(false);
                                                        }}
                                                        className={`${
                                                            active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                        } group flex w-full items-center justify-center rounded-md px-2 py-2 text-sm`}
                                                    >
                                                        <ShareLink className="w-5 fill-current" />
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </Menu.Items>
                    </Menu>
                </div>
            </td>
        </tr>
    );
};
