import { PlusCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import type { CampaignsIndexGetResult } from 'pages/api/campaigns';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { DotsHorizontal, ShareLink } from 'src/components/icons';
import { FEAT_RECOMMENDED } from 'src/constants/feature-flags';
import { isRecommendedInfluencer } from 'src/constants/recommendedInfluencers';
import useAboveScreenWidth from 'src/hooks/use-above-screen-width';
import { useSearch, useSearchResults } from 'src/hooks/use-search';
import { imgProxy } from 'src/utils/fetcher';
import { decimalToPercent, numberFormatter } from 'src/utils/formatter';
import type { CreatorSearchAccountObject } from 'types';
import { Badge, Tooltip } from '../library';
import { SkeletonSearchResultRow } from '../common/skeleton-search-result-row';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { useRef, useState } from 'react';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';

export interface SearchResultRowProps {
    creator: CreatorSearchAccountObject;
    setSelectedCreator: (creator: CreatorSearchAccountObject) => void;
    setShowCampaignListModal: (show: boolean) => void;
    setShowAlreadyAddedModal: (show: boolean) => void;
    campaigns?: CampaignsIndexGetResult;
    setCampaignsWithCreator: (campaigns: string[]) => void;
}
export interface MoreResultsRowsProps extends Omit<SearchResultRowProps, 'creator'> {
    page: number;
}

export const MoreResultsRows = ({
    page,
    setShowCampaignListModal,
    setSelectedCreator,
    setShowAlreadyAddedModal,
    campaigns,
    setCampaignsWithCreator,
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
                    campaigns={campaigns}
                    setCampaignsWithCreator={setCampaignsWithCreator}
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
    campaigns,
    setShowAlreadyAddedModal,
    setCampaignsWithCreator,
}: SearchResultRowProps) => {
    const { t } = useTranslation();
    const { platform } = useSearch();
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
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);
    useOnOutsideClick(menuRef, () => setMenuOpen(false), menuButtonRef);

    const addToCampaign = () => {
        setMenuOpen(false);
        if (creator) setSelectedCreator(creator);

        const campaignsList: string[] = [];

        campaigns?.forEach((campaign) => {
            if (campaign && creator.account.user_profile.user_id) {
                const creatorInCampaign = campaign?.campaign_creators?.find(
                    (campaignCreator) => campaignCreator.creator_id === creator?.account.user_profile.user_id,
                );

                if (creatorInCampaign) {
                    campaignsList.push(campaign.name);
                }
            }
        });

        if (campaignsList.length > 0) {
            setCampaignsWithCreator(campaignsList);
            setShowAlreadyAddedModal(true);
        } else setShowCampaignListModal(true);
    };

    const desktop = useAboveScreenWidth(1400);

    return (
        <tr className="group hover:bg-primary-100">
            <td className="w-full">
                <div className="flex w-full flex-row gap-x-2 px-4 py-2">
                    <img
                        key={picture}
                        src={imgProxy(picture) as string}
                        className="h-12 w-12 [min-width:3rem]"
                        alt={handle}
                    />
                    <div>
                        <div className="font-bold line-clamp-2">{fullname}</div>
                        <div className="text-sm text-primary-500 line-clamp-1">{handle ? `@${handle}` : null}</div>
                    </div>
                    {FEAT_RECOMMENDED && isRecommendedInfluencer(platform, user_id) && (
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

                {menuOpen && (
                    <div className="relative inline-block text-left lg:hidden">
                        <ul
                            ref={menuRef}
                            className="absolute right-0 top-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                            <li className="px-1 py-1">
                                {/* active classes? className={`${
                                                active ? 'bg-primary-500 text-white' : 'text-gray-900'
                                            }*/}
                                <button
                                    className="flex w-full items-center justify-center rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-primary-300 hover:text-white"
                                    onClick={addToCampaign}
                                >
                                    {t('creators.addToCampaign')}
                                </button>
                            </li>
                            <li className="px-1 py-1">
                                <Link
                                    href={`/influencer/${platform}/${user_id}`}
                                    target="_blank"
                                    data-testid={`analyze-button/${user_id}`}
                                >
                                    <Button
                                        className="flex w-full items-center justify-center rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-primary-300 hover:text-white"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            trackEvent('Opened a report from Search', { platform, user_id });
                                        }}
                                    >
                                        {t('creators.analyzeProfile')}
                                    </Button>
                                </Link>
                            </li>
                            {url && (
                                <li className="px-1 py-1">
                                    <Link
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <button className="flex w-full items-center justify-center rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-primary-300 hover:text-white">
                                            <ShareLink className="w-5 fill-current" />
                                        </button>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                <button
                    ref={menuButtonRef}
                    className="rounded bg-primary-600 px-4 py-2 text-white lg:hidden"
                    data-testid={`search-result-row-buttons/\${user_id}`}
                    onClick={toggleMenu}
                >
                    <DotsHorizontal />
                </button>
            </td>
        </tr>
    );
};
