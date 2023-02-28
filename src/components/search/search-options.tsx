import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';

import { useTranslation } from 'react-i18next';
import { useSearch } from 'src/hooks/use-search';
import { numberFormatter } from 'src/utils/formatter';
import { Button } from '../button';
import { SearchCreators } from './search-creators';
import { SearchTopics } from './search-topics';

const resultsPerPageOptions = [10, 20, 50, 100];

const filterCountry = (items: any[]) => {
    return items.filter((item: any) => {
        return item.type?.[0] === 'country';
    });
};

export const SearchOptions = ({
    setPage,
    setShowFiltersModal,
}: {
    setPage: (page: number) => void;
    setShowFiltersModal: (show: boolean) => void;
}) => {
    const {
        platform,
        tags,
        setTopicTags,
        influencerLocation,
        setInfluencerLocation,
        audienceLocation,
        setAudienceLocation,
        audience,
        setAudience,
        views,
        setViews,
        gender,
        setGender,
        engagement,
        setEngagement,
        lastPost,
        setLastPost,
        setContactInfo,
        resultsPerPageLimit,
        setResultsPerPageLimit,
    } = useSearch();

    const { t } = useTranslation();
    const hasSetViews = views[0] || views[1];
    const hasSetAudience = audience[0] || audience[1];
    return (
        <>
            <div className="flex w-full flex-col items-start space-y-2 py-4 font-light md:flex-row md:space-x-4 md:space-y-0">
                <SearchTopics
                    path="influencer-search/topics"
                    placeholder={t('creators.searchTopic')}
                    topics={tags}
                    platform={platform}
                    onSetTopics={(topics: any) => {
                        setTopicTags(topics);
                    }}
                />
                <SearchCreators platform={platform} />
            </div>
            <div className="flex flex-col items-start space-y-2 md:flex-row md:space-x-4 md:space-y-0">
                {/* remove all lookalike code: https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/154 */}

                <SearchTopics
                    path="influencer-search/locations"
                    placeholder={t('creators.filter.locationPlaceholder')}
                    topics={influencerLocation}
                    platform={platform}
                    filter={filterCountry}
                    onSetTopics={(topics: any) => {
                        setInfluencerLocation(topics);
                    }}
                />
                <SearchTopics
                    path="influencer-search/locations"
                    placeholder={t('creators.filter.audienceLocation')}
                    topics={audienceLocation}
                    platform={platform}
                    filter={filterCountry}
                    onSetTopics={(topics: any) => {
                        setAudienceLocation(topics.map((item: any) => ({ weight: 5, ...item })));
                    }}
                    TagComponent={({ onClick, ...item }: any) => {
                        const selected = audienceLocation.find((country) => country.id === item.id);
                        if (!selected) return null;
                        return (
                            <div
                                className="flex cursor-pointer flex-row items-center whitespace-nowrap rounded bg-gray-100 pl-2 pr-1 text-gray-900 hover:bg-gray-200"
                                key={item.id}
                                onClick={onClick}
                            >
                                {item.value || item.title}
                                <select
                                    value={selected.weight}
                                    className="ml-2 rounded-md bg-primary-200"
                                    onClick={(e: any) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onChange={(e: any) => {
                                        const clone = audienceLocation.slice();
                                        const index = audienceLocation.indexOf(selected);

                                        if (index !== -1) {
                                            clone[index] = { ...selected, weight: e.target.value };
                                            setAudienceLocation(clone);
                                        }
                                    }}
                                >
                                    {Array.from(Array(11)).map((_, i) => {
                                        const val = i === 0 ? 1 : i * 5;
                                        return <option value={val} key={val}>{`>${val}%`}</option>;
                                    })}
                                </select>
                            </div>
                        );
                    }}
                />
            </div>
            <div>
                <div className="flex flex-row items-center">
                    <button
                        onClick={() => setShowFiltersModal(true)}
                        className={`group flex flex-row items-center rounded-md border border-transparent bg-white px-2 py-1 text-gray-900 shadow ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm`}
                    >
                        <AdjustmentsVerticalIcon
                            className={`mr-2 h-6 w-6 text-gray-400 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                            aria-hidden="true"
                        />
                        <div className="flex flex-row space-x-5 text-xs">
                            {hasSetAudience && (
                                <p>
                                    {`${t('creators.filter.subs')}: ${
                                        audience[0] ? numberFormatter(audience[0]) : 0
                                    } - ${
                                        audience[1]
                                            ? numberFormatter(audience[1])
                                            : t('creators.filter.max')
                                    }`}
                                </p>
                            )}
                            {hasSetViews && (
                                <p>
                                    {`${t('creators.filter.avgViews')}: ${
                                        views[0] ? numberFormatter(views[0]) : 0
                                    } - ${
                                        views[1]
                                            ? numberFormatter(views[1])
                                            : t('creators.filter.max')
                                    }`}
                                </p>
                            )}
                            {gender && <p>{t(`creators.filter.${gender}`)}</p>}
                            {engagement && (
                                <p>{`${t('creators.filter.engagement')}: >${engagement}%`}</p>
                            )}
                            {lastPost && (
                                <p>{`${t('creators.filter.lastPost')}: ${lastPost} ${t(
                                    'creators.filter.days',
                                )}`}</p>
                            )}
                        </div>
                    </button>
                    <select
                        className="ml-4 mr-2 flex cursor-pointer flex-row items-center rounded-md border border-transparent bg-white p-1 text-gray-900 shadow ring-1 ring-gray-900 ring-opacity-5 hover:text-opacity-80 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                        value={resultsPerPageLimit}
                        onChange={(e) => {
                            setPage(0);
                            setResultsPerPageLimit(Number(e.target.value));
                        }}
                    >
                        {resultsPerPageOptions.map((option) => (
                            <option value={option} key={option}>
                                {numberFormatter(option)}
                            </option>
                        ))}
                    </select>
                    <p className="mr-2 ml-1 text-sm text-gray-500">
                        {t('creators.resultsPerPage')}
                    </p>
                    {hasSetViews || hasSetAudience || gender || engagement || lastPost ? (
                        <Button
                            onClick={(e: any) => {
                                e.preventDefault();
                                setAudience([null, null]);
                                setViews([null, null]);
                                setGender(undefined);
                                setEngagement(undefined);
                                setLastPost(undefined);
                                setContactInfo(undefined);
                            }}
                            variant="secondary"
                        >
                            {t('creators.clearFilter')}
                        </Button>
                    ) : null}
                </div>
            </div>
        </>
    );
};
