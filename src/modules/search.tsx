/* eslint-disable @next/next/no-img-element */
import { Fragment, useEffect } from 'react';
import { Button } from 'src/components/button';
import { useSearch } from 'src/hooks/use-search';
import { formatter } from 'src/utils/formatter';
import { SearchTopics } from 'src/modules/search-topics';
import { Popover, Transition } from '@headlessui/react';
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import { SearchResultRow } from './search-result-row';
import { CreatorSearchResult } from 'types';
import { useState } from 'react';
import { Modal } from 'src/components/modal';
import { useTranslation } from 'react-i18next';
import { useCampaigns } from 'src/hooks/use-campaigns';
import CampaignModalCard from 'src/components/campaigns/CampaignModalCard';

const filterCountry = (items: any[]) => {
    return items.filter((item: any) => {
        return item.type?.[0] === 'country';
    });
};

export const Search = () => {
    const {
        platforms,
        platform,
        setPlatform,
        page,
        // setPage,
        tags,
        setTopicTags,
        lookalike,
        setLookalike,
        KOLLocation,
        setKOLLocation,
        audienceLocation,
        setAudienceLocation,
        loading,
        results,
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
        setContactInfo
    } = useSearch();

    const options = [1e3, 5e3, 1e4, 15e3, 25e3, 50e3, 1e5, 25e4, 50e4, 1e6];
    const [showCampaignListModal, setShowCampaignListModal] = useState(false);
    const { t } = useTranslation();
    const { campaigns } = useCampaigns();

    useEffect(() => {
        search();
    }, [search]);

    const accounts = results?.accounts ?? [];

    const feed: CreatorSearchResult['accounts'] =
        accounts.length < 10 && (page > 0 || loading)
            ? [...accounts, ...Array.from(Array(10 - accounts.length))]
            : accounts;

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
                    placeholder="Search for a topic"
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
                    placeholder="Lookalike"
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
                        onClick
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
                    placeholder="KOL locations"
                    topics={KOLLocation}
                    platform={platform}
                    filter={filterCountry}
                    onSetTopics={(topics: any) => {
                        setKOLLocation(topics);
                    }}
                />
                <SearchTopics
                    path="/api/kol/locations"
                    placeholder="Audience locations"
                    topics={audienceLocation}
                    platform={platform}
                    filter={filterCountry}
                    onSetTopics={(topics: any) => {
                        setAudienceLocation(topics.map((item: any) => ({ weight: 5, ...item })));
                    }}
                    TagComponent={({ onClick, ...item }: any) => {
                        const selected = audienceLocation.find(
                            (country: any) => country.id === item.id
                        );
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
                <Popover className="relative">
                    {() => (
                        <>
                            <div className="flex flex-row space-x-4">
                                <Popover.Button
                                    className={`group text-gray-900 ring-gray-900 ring-opacity-5 bg-white rounded-md border border-transparent shadow ring-1 sm:text-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none flex flex-row items-center px-2 py-1`}
                                >
                                    <AdjustmentsVerticalIcon
                                        className={`h-6 w-6 text-gray-400 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                                        aria-hidden="true"
                                    />
                                    <div className="flex flex-row space-x-2 text-xs">
                                        {audience.length ? (
                                            <div>
                                                Subs: {formatter(audience[0])}
                                                {` `}
                                                To: {formatter(audience[1])}
                                            </div>
                                        ) : null}
                                        {views.length ? (
                                            <div>
                                                Avg. Views: {formatter(views[0])}
                                                {` `}
                                                To: {formatter(views[1])}
                                            </div>
                                        ) : null}
                                        {gender ? <div>{gender}</div> : null}
                                        {engagement ? <div>{'>' + engagement}%</div> : null}
                                        {lastPost ? <div>{lastPost} days</div> : null}
                                    </div>
                                </Popover.Button>
                                {audience.length ||
                                views.length ||
                                gender ||
                                engagement ||
                                lastPost ? (
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
                                        Clear
                                    </Button>
                                ) : null}
                            </div>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-4 sm:px-0">
                                    <div className="overflow-hidden rounded-md shadow-2xl ring-1 ring-black ring-opacity-5">
                                        <div className="relative bg-white p-8 space-y-8">
                                            <div>
                                                <div className="text-xl font-bold">
                                                    Filter Creator
                                                </div>
                                                <div>
                                                    Narrow down to the ideal KOLs for your brand!
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm">
                                                    <div className="font-bold text-lg">
                                                        Subscribers
                                                    </div>
                                                    <div className="flex flex-row space-x-4">
                                                        <div>
                                                            <select
                                                                className="bg-primary-200 rounded-md"
                                                                value={audience[0]}
                                                                onChange={(e) => {
                                                                    setAudience((val) => [
                                                                        e.target.value,
                                                                        val[1]
                                                                    ]);
                                                                }}
                                                            >
                                                                <option value={'any'}>From</option>
                                                                {options.map((val) => (
                                                                    <option value={val} key={val}>
                                                                        {formatter(val)}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <select
                                                                className="bg-primary-200 rounded-md"
                                                                value={audience[1]}
                                                                onChange={(e) => {
                                                                    setAudience((val) => [
                                                                        val[0],
                                                                        e.target.value
                                                                    ]);
                                                                }}
                                                            >
                                                                <option value={'any'}>To</option>
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
                                                        Average Views
                                                    </div>
                                                    <div className="flex flex-row space-x-4">
                                                        <div>
                                                            <select
                                                                className="bg-primary-200 rounded-md"
                                                                value={views[0]}
                                                                onChange={(e) => {
                                                                    setViews((val) => [
                                                                        e.target.value,
                                                                        val[1]
                                                                    ]);
                                                                }}
                                                            >
                                                                <option value={'any'}>From</option>
                                                                {options.map((val) => (
                                                                    <option value={val} key={val}>
                                                                        {formatter(val)}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <select
                                                                className="bg-primary-200 rounded-md"
                                                                value={views[1]}
                                                                onChange={(e) => {
                                                                    setViews((val) => [
                                                                        val[0],
                                                                        e.target.value
                                                                    ]);
                                                                }}
                                                            >
                                                                <option value={'any'}>To</option>
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
                                                    <div className="font-bold text-lg">Gender</div>
                                                    <select
                                                        className="bg-primary-200 rounded-md"
                                                        value={gender}
                                                        onChange={(e) => {
                                                            if (e.target.value === 'any') {
                                                                setGender(undefined);
                                                            } else {
                                                                setGender(e.target.value);
                                                            }
                                                        }}
                                                    >
                                                        <option value={'any'}>Any</option>
                                                        <option value={'male'}>Male</option>
                                                        <option value={'female'}>Female</option>
                                                    </select>
                                                </label>
                                            </div>
                                            <div>
                                                <label className="text-sm">
                                                    <div className="font-bold text-lg">
                                                        Engagement Rate
                                                    </div>
                                                    <select
                                                        className="bg-primary-200 rounded-md"
                                                        value={engagement}
                                                        onChange={(e) => {
                                                            if (e.target.value === 'any') {
                                                                setEngagement(undefined);
                                                            } else {
                                                                setEngagement(e.target.value);
                                                            }
                                                        }}
                                                    >
                                                        <option value={'any'}>Any</option>
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
                                                    <div className="font-bold text-lg">
                                                        Last Post
                                                    </div>
                                                    <select
                                                        className="bg-primary-200 rounded-md"
                                                        value={lastPost}
                                                        onChange={(e) => {
                                                            if (e.target.value === 'any') {
                                                                setLastPost(undefined);
                                                            } else {
                                                                setLastPost(e.target.value);
                                                            }
                                                        }}
                                                    >
                                                        <option value={'any'}>Any</option>
                                                        <option value={30}>30 days</option>
                                                        <option value={90}>3 months</option>
                                                        <option value={120}>6 months</option>
                                                    </select>
                                                </label>
                                            </div>
                                            <div>
                                                <label className="text-sm">
                                                    <div className="font-bold text-lg">
                                                        Contact Information
                                                    </div>
                                                    <select
                                                        className="bg-primary-200 rounded-md"
                                                        value={contactInfo}
                                                        onChange={(e) => {
                                                            if (e.target.value === 'any') {
                                                                setContactInfo(undefined);
                                                            } else {
                                                                setContactInfo(e.target.value);
                                                            }
                                                        }}
                                                    >
                                                        <option value={'any'}>Any</option>
                                                        <option value={'email'}>Has Email</option>
                                                    </select>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>
            </div>
            <div>
                {results ? (
                    <div className="font-bold text-sm">
                        Total Results: {formatter(results.total)}
                    </div>
                ) : null}
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
                                Account
                            </th>
                            <th className="text-xs text-gray-500 font-normal text-left">
                                Followers
                            </th>
                            <th className="text-xs text-gray-500 font-normal text-left">
                                Engagements
                            </th>
                            <th className="text-xs text-gray-500 font-normal text-left">
                                Engagement Rate
                            </th>
                            <th className="text-xs text-gray-500 font-normal text-left">
                                Avg. views
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {Array.isArray(feed)
                            ? feed.map((creator, i) => (
                                  <SearchResultRow
                                      key={i}
                                      creator={creator}
                                      platform={platform}
                                      setLookalike={setLookalike}
                                      setShowCampaignListModal={setShowCampaignListModal}
                                  />
                              ))
                            : null}
                    </tbody>
                </table>
            </div>
            <Modal
                title={t('campaigns.modal.addToCampaign')}
                visible={!!showCampaignListModal}
                onClose={() => {
                    setShowCampaignListModal(false);
                }}
            >
                <div className="py-4 text-sm text-tertiary-500">
                    {t('campaigns.modal.addThisInfluencer')}
                </div>
                {/* TODO: add campaign lists with add button  */}

                {campaigns?.length ? (
                    <div>
                        {campaigns.map((campaign, index) => (
                            <CampaignModalCard
                                campaign={campaign}
                                // setCampaigns={setCampaigns}
                                // index={index}
                                // creator={creator}
                                campaigns={campaigns}
                                key={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-gray-600">You dont have any campaigns yet</div>
                )}
            </Modal>
            {/* <div className="space-x-2">
                {subscription?.plans.amount > 10
                    ? Array.from(Array(Math.ceil(subscription.plans.amount / 10))).map(
                          (_, i: any) => {
                              return (
                                  <Button
                                      type={page === i ? '' : 'secondary'}
                                      key={i}
                                      onClick={() => {
                                          setPage(i);
                                      }}
                                  >
                                      {i + 1}
                                  </Button>
                              );
                          }
                      )
                    : null}
            </div> */}
        </div>
    );
};
