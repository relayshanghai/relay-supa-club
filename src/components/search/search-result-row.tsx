import { Menu } from '@headlessui/react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { CampaignsIndexGetResult } from 'pages/api/campaigns';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { DotsHorizontal, ShareLink } from 'src/components/icons';
import { useSearch } from 'src/hooks/use-search';
import { imgProxy } from 'src/utils/fetcher';
import { decimalToPercent, numberFormatter } from 'src/utils/formatter';
import type { CreatorSearchAccountObject, CreatorUserProfile } from 'types';

export const SearchResultRow = ({
    creator,
    setShowCampaignListModal,
    setSelectedCreator,
    campaigns,
    selectedCreator,
    setShowAlreadyAddedModal,
}: {
    creator: CreatorSearchAccountObject;
    setSelectedCreator: (creator: CreatorSearchAccountObject) => void;
    setShowCampaignListModal: (show: boolean) => void;
    setShowAlreadyAddedModal: (show: boolean) => void;
    campaigns?: CampaignsIndexGetResult;
    selectedCreator: CreatorUserProfile | null;
}) => {
    const { t } = useTranslation();
    const { platform } = useSearch();
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
    const addToCampaign = () => {
        const campaignsList: string[] = [];

        campaigns?.forEach((campaign) => {
            if (campaign && selectedCreator) {
                const creatorInCampaign = campaign?.campaign_creators?.find(
                    (campaignCreator) => campaignCreator.creator_id === selectedCreator?.user_id,
                );

                if (creatorInCampaign) {
                    campaignsList.push(campaign.name);
                }
            }
        });

        if (campaignsList.length) {
            setShowAlreadyAddedModal(true);
        } else setShowCampaignListModal(true);
        if (creator) setSelectedCreator(creator);
    };

    return (
        <tr className="group hover:bg-primary-100">
            <td className="w-full">
                <div className="flex w-full flex-row gap-x-2 py-2 px-4">
                    <img src={imgProxy(picture) as string} className="h-12 w-12" alt={handle} />
                    <div>
                        <div className="font-bold line-clamp-2">{fullname}</div>
                        <div className="text-sm text-primary-500 line-clamp-1">
                            {handle ? `@${handle}` : null}
                        </div>
                    </div>
                </div>
            </td>
            <td className="pr-4 text-right text-sm">{numberFormatter(followers) ?? '-'}</td>
            <td className="pr-4 text-right text-sm">{numberFormatter(engagements) ?? '-'}</td>
            <td className="pr-4 text-right text-sm">{decimalToPercent(engagement_rate) ?? '-'}</td>
            <td className="pr-4 text-right text-sm">{numberFormatter(avg_views) ?? '-'}</td>

            <td className="sticky right-0 lg:relative">
                <div className="relative hidden flex-row items-center justify-center gap-2 duration-100 group-hover:opacity-100 lg:flex lg:opacity-100">
                    <Link href={`/influencer/${platform}/${user_id}`} target="_blank">
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
                                                active
                                                    ? 'bg-violet-500 text-white'
                                                    : 'text-gray-900'
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
                                                    active
                                                        ? 'bg-violet-500 text-white'
                                                        : 'text-gray-900'
                                                } group flex w-full items-center justify-center rounded-md px-2 py-2 text-sm`}
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
                                                        active
                                                            ? 'bg-violet-500 text-white'
                                                            : 'text-gray-900'
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
