/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
// import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { ShareLink } from 'src/components/icons';
// import Heart from 'src/components/icons/Heart';
import { formatter } from 'src/utils/formatter';
import { CreatorPlatform, CreatorSearchAccountObject } from 'types';

export const SearchResultRow = ({
    creator,
    platform,
    setLookalike,
    setShowCampaignListModal,
    setSelectedCreator
}: {
    creator?: CreatorSearchAccountObject;
    platform: CreatorPlatform;
    setLookalike: (creator: CreatorSearchAccountObject) => void;
    setSelectedCreator: (creator: CreatorSearchAccountObject) => void;
    setShowCampaignListModal: (show: boolean) => void;
}) => {
    const { t } = useTranslation();
    const placeholder = !creator;
    const handle = !placeholder
        ? creator.account.user_profile.username ||
          creator.account.user_profile.custom_name ||
          creator.account.user_profile.fullname
        : '';

    // placeholder if we want to reimplement 'pools'
    // const [addedToPool, setAddedToPool] = useState(false);

    const addToCampaign = () => {
        setShowCampaignListModal(true);
        if (creator) setSelectedCreator(creator);
    };

    return (
        <tr
            className={`${
                placeholder ? 'bg-gray-50' : ''
            } relative group duration-1 hover:bg-primary-100`}
        >
            {!placeholder && (
                <td className="invisible absolute flex right-28 -top-3 group-hover:visible">
                    <div className="flex space-x-4">
                        <Button onClick={addToCampaign} variant="secondary">
                            {t('creators.index.addToCampaign')}
                        </Button>
                        <Button onClick={() => setLookalike(creator)} variant="secondary">
                            {t('creators.index.similarKol')}
                        </Button>
                        <Button>
                            <Link
                                href={`/creator/${platform}/${creator.account.user_profile.user_id}`}
                            >
                                <a>{t('creators.index.analyzeProfile')}</a>
                            </Link>
                        </Button>
                        {/* placeholder if we want to reimplement 'pools' */}
                        {/* <Button
                            onClick={() => setAddedToPool(!addedToPool)}
                            variant="secondary"
                            className={`border-none ${
                                addedToPool
                                    ? ' bg-primary-100 hover:bg-primary-200 text-primary-500'
                                    : ' bg-gray-50 hover:bg-primary-100 text-gray-300'
                            }`}
                        >
                            <Heart className="w-4 h-4 fill-current" />
                        </Button> */}
                        {creator.account.user_profile.url && (
                            <Button>
                                <Link href={creator.account.user_profile.url}>
                                    <a target="_blank" rel="noreferrer">
                                        <ShareLink className="w-3.5 h-3.5 fill-current text-white" />
                                    </a>
                                </Link>
                            </Button>
                        )}
                    </div>
                </td>
            )}
            <td className="py-2 px-4 flex flex-row items-center space-x-2">
                {!placeholder ? (
                    <>
                        <img
                            src={`https://image-cache.brainchild-tech.cn/?link=${creator.account.user_profile.picture}`}
                            className="w-12 h-12"
                            alt={handle}
                        />
                        <div>
                            <div className="font-bold whhitespace-nowrap">
                                {creator.account.user_profile.fullname}
                            </div>
                            <div className="text-primary-500 text-sm">
                                {handle ? `@${handle}` : null}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-12 h-12 rounded-full bg-gray-100" />
                        <div className="space-y-2">
                            <div className="font-bold bg-gray-100 w-40 h-4" />
                            <div className="text-primary-500 text-sm bg-gray-100 w-20 h-4" />
                        </div>
                        <div className="absolute top-0 left-0 translate-x-1/2 translate-y-1/2 p-2 text-sm">
                            <Link href="/account" passHref>
                                <a className="text-primary-500">
                                    {t('creators.filter.upgradeSubscriptionToSeeMore')}
                                </a>
                            </Link>
                        </div>
                    </>
                )}
            </td>
            <td className="text-sm">
                {!placeholder ? (
                    formatter(creator.account.user_profile.followers)
                ) : (
                    <div className="text-primary-500 text-sm bg-gray-100 w-10 h-4" />
                )}
            </td>
            <td className="text-sm">
                {!placeholder ? (
                    formatter(creator.account.user_profile.engagements)
                ) : (
                    <div className="text-primary-500 text-sm bg-gray-100 w-10 h-4" />
                )}
            </td>
            <td className="text-sm">
                {!placeholder ? (
                    formatter(creator.account.user_profile.engagement_rate)
                ) : (
                    <div className="text-primary-500 text-sm bg-gray-100 w-10 h-4" />
                )}
            </td>
            <td className="text-sm">
                {!placeholder ? (
                    formatter(creator.account.user_profile.avg_views)
                ) : (
                    <div className="text-primary-500 text-sm bg-gray-100 w-10 h-4" />
                )}
            </td>
        </tr>
    );
};
