import { Menu } from '@headlessui/react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { DotsHorizontal, ShareLink } from 'src/components/icons';
import { FEAT_RECOMMENDED } from 'src/constants/feature-flags';
import useAboveScreenWidth from 'src/hooks/use-above-screen-width';
import { useSearch, useSearchResults } from 'src/hooks/use-search';
import { imgProxy } from 'src/utils/fetcher';
import { decimalToPercent, numberFormatter } from 'src/utils/formatter';
import type { CreatorSearchAccountObject } from 'types';
import { Badge, Tooltip } from '../library';
import { SkeletonSearchResultRow } from '../common/skeleton-search-result-row';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { isRecommendedInfluencer } from 'src/utils/utils';

import type { CampaignCreatorDB } from 'src/utils/api/db';

export interface SearchResultRowProps {
    creator: CreatorSearchAccountObject;
    setSelectedCreator: (creator: CreatorSearchAccountObject) => void;
    setShowCampaignListModal: (show: boolean) => void;
    setShowAlreadyAddedModal: (show: boolean) => void;
    allCampaignCreators?: CampaignCreatorDB[];
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
}: MoreResultsRowsProps) => {
    const { t } = useTranslation();
    const { resultsPerPageLimit } = useSearch();
    const { results, loading, error } = useSearchResults(page);

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
    return results ? (
        <>
            {results?.map((creator, i) => (
                <SearchResultRow
                    key={i}
                    creator={creator}
                    setShowCampaignListModal={setShowCampaignListModal}
                    setSelectedCreator={setSelectedCreator}
                    setShowAlreadyAddedModal={setShowAlreadyAddedModal}
                    allCampaignCreators={allCampaignCreators}
                />
            ))}
        </>
    ) : (
        <></>
    );
};
export const SearchResultRow = ({
    creator,
    setShowCampaignListModal,
    setSelectedCreator,
    allCampaignCreators,
    setShowAlreadyAddedModal,
}: SearchResultRowProps) => {
    const { t } = useTranslation();
    const { platform, recommendedInfluencers } = useSearch();
    const { trackEvent } = useRudderstack();
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
    } = creator.account.user_profile;
    const handle = username || custom_name || fullname || '';

    const addToCampaign = async () => {
        setSelectedCreator(creator);
        let isAlreadyInCampaign = false;

        if (allCampaignCreators) {
            for (const campaignCreator of allCampaignCreators) {
                if (campaignCreator?.campaign_id && creator.account.user_profile.user_id) {
                    if (campaignCreator.creator_id === creator?.account.user_profile.user_id) {
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
    };

    const desktop = useAboveScreenWidth(500);

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
                        <div className="text-sm text-primary-500 line-clamp-1">{handle ? `@${handle}` : null}</div>
                    </div>
                </div>
                <div className="mt-2">
                    {FEAT_RECOMMENDED && isRecommendedInfluencer(recommendedInfluencers, platform, user_id) && (
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
                        target="_blank"
                        onClick={() => trackEvent('Opened a report from Search', { platform, user_id })}
                    >
                        <Button className="flex flex-row items-center" variant="secondary">
                            <span className="">{t('creators.analyzeProfile')}</span>
                        </Button>
                    </Link>

                    <Button onClick={addToCampaign} className="flex items-center gap-1">
                        <PlusCircleIcon className="w-5" />
                        <span className="">{t('creators.addToCampaign')}</span>
                    </Button>

                    {url && (
                        <Link href={url} target="_blank" rel="noopener noreferrer">
                            <Button>
                                <ShareLink className="w-5 fill-current text-white" />
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="flex flex-col items-center justify-center gap-1 lg:hidden">
                    <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button as="div" data-testid={`search-result-row-buttons/${user_id}`}>
                            <Button>
                                <DotsHorizontal />
                            </Button>
                        </Menu.Button>

                        <Menu.Items className="absolute right-0 top-0 mr-16 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="px-1 py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                            } group flex w-full items-center justify-center rounded-md px-2 py-2 text-sm`}
                                            onClick={addToCampaign}
                                        >
                                            {t('creators.addToCampaign')}
                                        </button>
                                    )}
                                </Menu.Item>

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
                                                onClick={() =>
                                                    trackEvent('Opened a report from Search', { platform, user_id })
                                                }
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
                        </Menu.Items>
                    </Menu>
                </div>
            </td>
        </tr>
    );
};
