import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SimilarUser, CreatorPlatform } from 'types';
import { SimilarCreator } from './creator-similar-creator';

export const CreatorBlock = ({
    similarCreators,
    platform,
    title
}: {
    similarCreators: SimilarUser[];
    platform: CreatorPlatform;
    title: string;
}) => {
    const [showMore, setShowMore] = useState(false);

    const { t } = useTranslation();

    const creators = showMore ? similarCreators : similarCreators.slice(0, 5);
    if (creators.length === 0) return null;
    return (
        <div className="flex flex-col w-full">
            <h2 className="font-semibold text-gray-600 mb-2">{t(`creators.show.${title}`)}</h2>
            <div>
                {creators.map((creator, index) => (
                    <SimilarCreator creator={creator} platform={platform} key={index} />
                ))}
            </div>
            <button onClick={() => setShowMore(!showMore)} className="justify-self-end">
                <p className="text-primary-500 hover:text-primary-700 duration-300 font-semibold text-sm text-right">
                    {showMore ? t('creators.show.seeLess') : t('creators.show.seeMore')}
                </p>
            </button>
        </div>
    );
};
