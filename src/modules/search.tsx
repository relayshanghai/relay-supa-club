/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { Button } from 'src/components/button';
import { useSearch } from 'src/hooks/use-search';
import { formatter } from 'src/utils/formatter';
import { SearchTopics } from 'src/modules/search-topics';
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import { SearchResultRow } from './search-result-row';
import { CreatorSearchAccountObject } from 'types';
import { Modal } from 'src/components/modal';
import { useTranslation } from 'react-i18next';
import { useCampaigns } from 'src/hooks/use-campaigns';
import CampaignModalCard from 'src/components/campaigns/campaign-modal-card';
import { Spinner } from 'src/components/icons';
import { SkeletonSearchResultRow } from 'src/components/common/skeleton-search-result-row';

const filterCountry = (items: any[]) => {
    return items.filter((item: any) => {
        return item.type?.[0] === 'country';
    });
};

const resultsPerPageOptions = [10, 20, 50, 100];
/** Search Filter - Subscribers and Avg view filter options: 1k, 5k, 10k, 15k, 25k, 50k, 100k, 250k, 500k, 1m */
const options = [1e3, 5e3, 1e4, 15e3, 25e3, 50e3, 1e5, 25e4, 50e4, 1e6];
export const Search = () => {
    const { t } = useTranslation();

    const {
        platforms,
        platform,
        setPlatform,
        tags,
        setTopicTags,
        lookalike,
        setLookalike,
        KOLLocation,
        setKOLLocation,
        audienceLocation,
        setAudienceLocation,
        loading,
        resultsTotal,
        resultPages,
        search,
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
        contactInfo,
        setContactInfo,

        resultsPerPageLimit,
        setResultsPerPageLimit,
    } = useSearch();

    const [filterModalOpen, setFilterModalOpen] = useState(false);

    const [showCampaignListModal, setShowCampaignListModal] = useState(false);
    const [selectedCreator, setSelectedCreator] = useState<CreatorSearchAccountObject | null>(null);
    const { campaigns } = useCampaigns();

    const [page, setPage] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        // because search is a useCallback that depends on all the state variables, this will trigger a re-search when any of the state variables change.
        // when the search filters change, we always want to start fresh from page 0
        search({});
    }, [search]);

    const noResults = resultPages.length === 0 || resultPages[0].length === 0;

    return (
        <div className="space-y-4">
            <div className="flex flex-row space-x-2">
                {platforms.map((item) => (
                    <button
                        className={`transition px-2 rounded-lg hover:shadow-xl ${
                            platform === item.id ? 'bg-white shadow-xl' : ''
                        }`}
                        key={item.label}
                        onClick={() => {
                            setPlatform(item.id);
                        }}
                    >
                        <img src={item.icon} height={32} width={32} alt={item.label} />
                    </button>
                ))}
            </div>
            <div>
                <SearchTopics
                    path="/api/kol/topics"
                    placeholder={t('creators.searchTopic')}
                    topics={tags}
                    platform={platform}
                    onSetTopics={(topics: any) => {
                        setTopicTags(topics);
                    }}
                />
            </div>
            <div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0 items-start space-y-2">
                <SearchTopics
                    path="/api/kol/lookalike"
                    placeholder={t('creators.similarKol')}
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
                />
                <SearchTopics
                    path="/api/kol/locations"
                    placeholder={t('creators.filter.locationPlaceholder')}
                    topics={KOLLocation}
                    platform={platform}
                    filter={filterCountry}
                    onSetTopics={(topics: any) => {
                        setKOLLocation(topics);
                    }}
                />
                <SearchTopics
                    path="/api/kol/locations"
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
                        onClick={() => setFilterModalOpen(true)}
                        className={`group text-gray-900 ring-gray-900 ring-opacity-5 bg-white rounded-md border border-transparent shadow ring-1 sm:text-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none flex flex-row items-center px-2 py-1`}
                    >
                        <AdjustmentsVerticalIcon
                            className={`h-6 w-6 text-gray-400 transition duration-150 ease-in-out group-hover:text-opacity-80 mr-2`}
                            aria-hidden="true"
                        />
                        <div className="flex flex-row space-x-5 text-xs">
                            {!!audience.length && (
                                <p>
                                    {`${t('creators.filter.subs')}: ${formatter(
                                        audience[0],
                                    )} - ${formatter(audience[1])}`}
                                </p>
                            )}
                            {!!views.length && (
                                <p>
                                    {`${t('creators.filter.avgViews')}: ${formatter(
                                        views[0],
                                    )} - ${formatter(views[1])}`}
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
                        {resultsPerPageOptions.map((val) => (
                            <option value={val} key={val}>
                                {formatter(val)}
                            </option>
                        ))}
                    </select>
                    <p className="text-gray-500 text-sm">results per page</p>
                    {audience.length || views.length || gender || engagement || lastPost ? (
                        <Button
                            onClick={(e: any) => {
                                e.preventDefault();
                                setAudience([]);
                                setViews([]);
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

                <Modal
                    visible={filterModalOpen}
                    onClose={() => setFilterModalOpen(false)}
                    title={t('creators.filter.title') || ''}
                >
                    <div className="p-8 space-y-5">
                        <h3>{t('creators.filter.intro')}</h3>

                        <div>
                            <label className="text-sm">
                                <h4 className="font-bold text-lg">
                                    {t('creators.filter.subscribers')}
                                </h4>
                                <div className="flex flex-row space-x-4">
                                    <div>
                                        <select
                                            className="bg-primary-200 rounded-md p-1 mt-1"
                                            value={audience[0]}
                                            onChange={(e) => {
                                                setAudience((val) => [e.target.value, val[1]]);
                                            }}
                                        >
                                            <option value={'any'}>
                                                {t('creators.filter.from')}
                                            </option>
                                            {options.map((val) => (
                                                <option value={val} key={val}>
                                                    {formatter(val)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <select
                                            className="bg-primary-200 rounded-md p-1 mt-1"
                                            value={audience[1]}
                                            onChange={(e) => {
                                                setAudience((val) => [val[0], e.target.value]);
                                            }}
                                        >
                                            <option value={'any'}>{t('creators.filter.to')}</option>
                                            {options.map((val) => (
                                                <option value={val} key={val}>
                                                    {formatter(val)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div>
                            <label className="text-sm">
                                <div className="font-bold text-lg">
                                    {t('creators.filter.averageViews')}
                                </div>
                                <div className="flex flex-row space-x-4">
                                    <div>
                                        <select
                                            className="bg-primary-200 rounded-md p-1 mt-1"
                                            value={views[0]}
                                            onChange={(e) => {
                                                setViews((val) => [e.target.value, val[1]]);
                                            }}
                                        >
                                            <option value={'any'}>
                                                {t('creators.filter.from')}
                                            </option>
                                            {options.map((val) => (
                                                <option value={val} key={val}>
                                                    {formatter(val)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <select
                                            className="bg-primary-200 rounded-md p-1 mt-1"
                                            value={views[1]}
                                            onChange={(e) => {
                                                setViews((val) => [val[0], e.target.value]);
                                            }}
                                        >
                                            <option value={'any'}>{t('creators.filter.to')}</option>
                                            {options.map((val) => (
                                                <option value={val} key={val}>
                                                    {formatter(val)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div>
                            <label className="text-sm">
                                <div className="font-bold text-lg">
                                    {t('creators.filter.gender')}
                                </div>
                                <select
                                    className="bg-primary-200 rounded-md p-1 mt-1"
                                    value={gender}
                                    onChange={(e) => {
                                        if (e.target.value === 'any') {
                                            setGender(undefined);
                                        } else {
                                            setGender(e.target.value);
                                        }
                                    }}
                                >
                                    <option value={'any'}>{t('creators.filter.any')}</option>
                                    <option value={'male'}>{t('creators.filter.male')}</option>
                                    <option value={'female'}>{t('creators.filter.female')}</option>
                                </select>
                            </label>
                        </div>
                        <div>
                            <label className="text-sm">
                                <div className="font-bold text-lg">Engagement Rate</div>
                                <select
                                    className="bg-primary-200 rounded-md p-1 mt-1"
                                    value={engagement}
                                    onChange={(e) => {
                                        if (
                                            e.target.value === 'any' ||
                                            Number(e.target.value) === 0
                                        ) {
                                            setEngagement(undefined);
                                        } else {
                                            setEngagement(Number(e.target.value));
                                        }
                                    }}
                                >
                                    <option value={'any'}>{t('creators.filter.any')}</option>
                                    {Array.from(Array(10)).map((_, i) => {
                                        return (
                                            <option key={i} value={i + 1}>
                                                {`>` + (i + 1) + `%`}
                                            </option>
                                        );
                                    })}
                                </select>
                            </label>
                        </div>
                        <div>
                            <label className="text-sm">
                                <div className="font-bold text-lg">Last Post</div>
                                <select
                                    className="bg-primary-200 rounded-md p-1 mt-1"
                                    value={lastPost}
                                    onChange={(e) => {
                                        if (e.target.value === 'any') {
                                            setLastPost(undefined);
                                        } else {
                                            setLastPost(e.target.value);
                                        }
                                    }}
                                >
                                    <option value={'any'}>{t('creators.filter.any')}</option>
                                    <option value={30}>30 {t('creators.filter.days')}</option>
                                    <option value={90}>3 {t('creators.filter.months')}</option>
                                    <option value={120}>6 {t('creators.filter.months')}</option>
                                </select>
                            </label>
                        </div>
                        <div>
                            <label className="text-sm">
                                <div className="font-bold text-lg">
                                    {t('creators.filter.contactInformation')}
                                </div>
                                <select
                                    className="bg-primary-200 rounded-md p-1 mt-1"
                                    value={contactInfo}
                                    onChange={(e) => {
                                        if (e.target.value === 'any') {
                                            setContactInfo(undefined);
                                        } else {
                                            setContactInfo(e.target.value);
                                        }
                                    }}
                                >
                                    <option value={'any'}>{t('creators.filter.any')}</option>
                                    <option value={'email'}>
                                        {t('creators.filter.emailAvailable')}
                                    </option>
                                </select>
                            </label>
                        </div>
                    </div>
                </Modal>
            </div>

            <div className="flex items-center">
                <div className="font-bold text-sm">
                    {`${t('creators.results')}: ${formatter(resultsTotal)}`}
                </div>
            </div>

            <div className="w-full overflow-auto">
                <table
                    className={`min-w-full divide-y divide-gray-200 rounded-lg shadow ${
                        loading ? 'opacity-60' : ''
                    }`}
                >
                    <thead className="bg-white sticky top-0">
                        <tr>
                            <th className="w-2/4 px-4 py-4 text-xs text-gray-500 font-normal text-left">
                                {t('creators.account')}
                            </th>
                            <th className="text-xs pr-4 whitespace-nowrap text-gray-500 font-normal text-left">
                                {t('creators.subscribers')}
                            </th>
                            <th className="text-xs pr-4 whitespace-nowrap text-gray-500 font-normal text-left">
                                {t('creators.engagements')}
                            </th>
                            <th className="text-xs pr-4 whitespace-nowrap text-gray-500 font-normal text-left">
                                {t('creators.engagementRate')}
                            </th>
                            <th className="text-xs pr-4 whitespace-nowrap text-gray-500 font-normal text-left">
                                {t('creators.avgViews')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {!noResults ? (
                            resultPages.map((page) =>
                                page.map((creator, i) => (
                                    <SearchResultRow
                                        key={i}
                                        creator={creator}
                                        platform={platform}
                                        setLookalike={setLookalike}
                                        setShowCampaignListModal={setShowCampaignListModal}
                                        setSelectedCreator={setSelectedCreator}
                                    />
                                )),
                            )
                        ) : loading ? (
                            [...Array(10)].map((_, i) => (
                                <SkeletonSearchResultRow key={i} delay={i * 200} />
                            ))
                        ) : (
                            <tr>
                                <td className="text-center py-4" colSpan={5}>
                                    {t('creators.noResults')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {loadingMore && (
                <div className="w-full flex justify-center p-10">
                    <Spinner className="fill-primary-600 text-white w-12 h-12" />
                </div>
            )}
            {!loading && !loadingMore && !noResults && (
                <Button
                    onClick={async () => {
                        setLoadingMore(true);
                        await search({ page: page + 1 });
                        setLoadingMore(false);
                        setPage(page + 1);
                    }}
                >
                    {t('creators.loadMore')}
                </Button>
            )}
            <Modal
                title={t('campaigns.modal.addToCampaign') || ''}
                visible={!!showCampaignListModal}
                onClose={() => {
                    setShowCampaignListModal(false);
                }}
            >
                <>
                    <div className="py-4 text-sm text-tertiary-800">
                        {t('campaigns.modal.addThisInfluencer')}
                    </div>
                    {campaigns?.length ? (
                        <div>
                            {campaigns.map((campaign, index) => (
                                <CampaignModalCard
                                    campaign={campaign}
                                    creator={selectedCreator}
                                    key={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-600">
                            {t('campaigns.modal.noCampaigns')}
                        </div>
                    )}
                </>
            </Modal>
        </div>
    );
};
