import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';

import { useTranslation } from 'react-i18next';
import { useSearch } from 'src/hooks/use-search';
import { numberFormatter } from 'src/utils/formatter';
import { Button } from '../button';
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
            <div className="py-4 w-full font-light">
                <SearchTopics
                    path="/api/influencer-search/topics"
                    placeholder={t('creators.searchTopic')}
                    topics={tags}
                    platform={platform}
                    onSetTopics={(topics: any) => {
                        setTopicTags(topics);
                    }}
                />
            </div>
            <div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0 items-start space-y-2">
                {/* remove all lookalike code: https://toil.kitemaker.co/0JhYl8-relayclub/8sxeDu-v2_project/items/154 */}
                {/* <SearchTopics
                    path="/api/influencer-search/lookalike"
                    placeholder={t('creators.similarInfluencer')}
                    topics={lookalike}
                    platform={platform}
                    onSetTopics={(topics: any) => {
                        setLookalike(topics);
                    }}
                    SuggestionComponent={({
                        followers,
                        username,
                        custom_name,
                        fullname,
                        picture,
                        onClick,
                    }: any) => {
                        const handle = `@${fullname || custom_name || username}`;
                        return (
                            <div
                                className="p-2 hover:bg-gray-100 flex flex-row items-center space-x-2 cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onClick({ title: handle });
                                }}
                            >
                                <div className="w-8 h-8">
                                    <img
                                        src={`https://image-cache.brainchild-tech.cn/?link=${picture}`}
                                        className="w-8 h-8 rounded-full"
                                        alt={handle}
                                    />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <div className="font-bold whitespace-nowrap text-ellipsis overflow-hidden">
                                        {handle}
                                    </div>
                                    <div className="text-sm">{formatter(followers)}</div>
                                </div>
                            </div>
                        );
                    }}
                /> */}
                <SearchTopics
                    path="/api/influencer-search/locations"
                    placeholder={t('creators.filter.locationPlaceholder')}
                    topics={influencerLocation}
                    platform={platform}
                    filter={filterCountry}
                    onSetTopics={(topics: any) => {
                        setInfluencerLocation(topics);
                    }}
                />
                <SearchTopics
                    path="/api/influencer-search/locations"
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
                                className="pl-2 pr-1 text-gray-900 rounded bg-gray-100 whitespace-nowrap hover:bg-gray-200 cursor-pointer flex items-center flex-row"
                                key={item.id}
                                onClick={onClick}
                            >
                                {item.value || item.title}
                                <select
                                    value={selected.weight}
                                    className="ml-2 bg-primary-200 rounded-md"
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
                        className={`group text-gray-900 ring-gray-900 ring-opacity-5 bg-white rounded-md border border-transparent shadow ring-1 sm:text-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none flex flex-row items-center px-2 py-1`}
                    >
                        <AdjustmentsVerticalIcon
                            className={`h-6 w-6 text-gray-400 transition duration-150 ease-in-out group-hover:text-opacity-80 mr-2`}
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
                        className="text-gray-900 ring-gray-900 ring-opacity-5 bg-white rounded-md border border-transparent shadow ring-1 sm:text-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none flex flex-row items-center cursor-pointer p-1 hover:text-opacity-80 ml-4 mr-2"
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
                    <p className="text-gray-500 text-sm mr-2 ml-1">
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
