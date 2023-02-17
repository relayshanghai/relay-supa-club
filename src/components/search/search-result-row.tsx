/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
// import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { ShareLink } from 'src/components/icons';
import { useSearch } from 'src/hooks/use-search';
import { imgProxy } from 'src/utils/fetcher';
// import Heart from 'src/components/icons/Heart';
import { formatter } from 'src/utils/formatter';
import { CreatorSearchAccountObject } from 'types';

export const SearchResultRow = ({
    creator,

    setShowCampaignListModal,
    setSelectedCreator,
}: {
    creator: CreatorSearchAccountObject;
    setSelectedCreator: (creator: CreatorSearchAccountObject) => void;
    setShowCampaignListModal: (show: boolean) => void;
}) => {
    const { t } = useTranslation();
    const { platform, setLookalike } = useSearch();
    const handle =
        creator.account.user_profile.username ||
        creator.account.user_profile.custom_name ||
        creator.account.user_profile.fullname ||
        '';

    // placeholder if we want to reimplement 'pools'
    // const [addedToPool, setAddedToPool] = useState(false);

    const addToCampaign = () => {
        setShowCampaignListModal(true);
        if (creator) setSelectedCreator(creator);
    };

    return (
        <tr className={`relative group duration-1 hover:bg-primary-100`}>
            <td className="invisible absolute flex right-28 -top-3 group-hover:visible">
                <div className="flex space-x-4">
                    <Button onClick={addToCampaign} variant="secondary">
                        {t('creators.addToCampaign')}
                    </Button>
                    <Button onClick={() => setLookalike(creator)} variant="secondary">
                        {t('creators.similarInfluencer')}
                    </Button>
                    <Button>
                        <Link
                            href={`/influencer/${platform}/${creator.account.user_profile.user_id}`}
                        >
                            <a target="_blank">{t('creators.analyzeProfile')}</a>
                        </Link>
                    </Button>

                    {creator.account.user_profile.url && (
                        <Button>
                            <Link href={creator.account.user_profile.url}>
                                <a target="_blank" rel="noopener noreferrer">
                                    <ShareLink className="w-3.5 h-3.5 fill-current text-white" />
                                </a>
                            </Link>
                        </Button>
                    )}
                </div>
            </td>

            <td className="py-2 px-4 flex flex-row items-center space-x-2 min-w-min">
                <img
                    src={imgProxy(creator.account.user_profile.picture) as string}
                    className="w-12 h-12"
                    alt={handle}
                />
                <div>
                    <div className="font-bold line-clamp-2">
                        {creator.account.user_profile.fullname}
                    </div>
                    <div className="text-primary-500 text-sm line-clamp-1">
                        {handle ? `@${handle}` : null}
                    </div>
                </div>
            </td>
            <td className="text-sm">{formatter(creator.account.user_profile.followers)}</td>
            <td className="text-sm">{formatter(creator.account.user_profile.engagements)}</td>
            <td className="text-sm">{formatter(creator.account.user_profile.engagement_rate)}</td>
            <td className="text-sm">{formatter(creator.account.user_profile.avg_views)}</td>
        </tr>
    );
};
