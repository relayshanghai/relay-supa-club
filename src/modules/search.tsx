/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Fragment, useEffect } from 'react';
import { Button } from 'src/components/button';
import { useSearch } from 'src/hooks/use-search';
import { useSubscription } from 'src/hooks/use-subscription';
import { formatter } from 'src/utils/formatter';
import { SearchTopics } from 'src/modules/search-topics';
import { Popover, Transition } from '@headlessui/react';
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';

const filterCountry = (items: any[]) => {
    return items.filter((item: any) => {
        return item.type?.[0] === 'country';
    });
};

export const Search = () => {
    const { subscription } = useSubscription();
    const {
        channels,
        channel,
        setChannel,
        page,
        setPage,
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

    useEffect(() => {
        search();
    }, [search]);

    const accounts = results?.accounts ?? [];
    const feed =
        accounts.length < 10 && (page > 0 || loading)
            ? [...accounts, ...Array.from(Array(10 - accounts.length))]
            : accounts;

    return (
        <div className="space-y-4">
            <div className="flex flex-row space-x-2">
                {channels.map((item, i) => (
                    <button
                        className={`transition px-2 rounded-lg hover:shadow-xl ${
                            channel === item.id ? 'bg-white shadow-xl' : ''
                        }`}
                        key={item.label}
                        onClick={() => {
                            setChannel(item.id);
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
                    channel={channel}
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
                    channel={channel}
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
                    channel={channel}
                    filter={filterCountry}
                    onSetTopics={(topics: any) => {
                        setKOLLocation(topics);
                    }}
                />
                <SearchTopics
                    path="/api/kol/locations"
                    placeholder="Audience locations"
                    topics={audienceLocation}
                    channel={channel}
                    filter={filterCountry}
                    onSetTopics={(topics: any) => {
                        setAudienceLocation(topics);
                    }}
                />
            </div>
            <div>
                <Popover className="relative">
                    {({ open }) => (
                        <>
                            <div className="flex flex-row space-x-4">
                                <Popover.Button
                                    className={`group text-gray-900 ring-gray-900 ring-opacity-5 bg-white rounded-md block border border-transparent shadow ring-1 sm:text-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none flex flex-row items-center px-2 py-1`}
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
                                        type="secondary"
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
                            ? feed.map((item: any, i: any) => {
                                  const placeholder = !item;
                                  const handle = !placeholder
                                      ? item.account.user_profile.username ||
                                        item.account.user_profile.custom_name ||
                                        item.account.user_profile.fullname
                                      : null;
                                  return (
                                      <tr
                                          key={i}
                                          className={`${placeholder ? 'bg-gray-50' : ''} relative`}
                                      >
                                          <td className="py-2 px-4 flex flex-row items-center space-x-2">
                                              {!placeholder ? (
                                                  <>
                                                      <img
                                                          src={`https://image-cache.brainchild-tech.cn/?link=${item.account.user_profile.picture}`}
                                                          className="w-12 h-12"
                                                          alt={handle}
                                                      />
                                                      <div>
                                                          <div className="font-bold whhitespace-nowrap">
                                                              {item.account.user_profile.fullname}
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
                                                                  Upgrade your subscription plan, to
                                                                  view more results.
                                                              </a>
                                                          </Link>
                                                      </div>
                                                  </>
                                              )}
                                          </td>
                                          <td className="text-sm">
                                              {!placeholder ? (
                                                  formatter(item.account.user_profile.followers)
                                              ) : (
                                                  <div className="text-primary-500 text-sm bg-gray-100 w-10 h-4" />
                                              )}
                                          </td>
                                          <td className="text-sm">
                                              {!placeholder ? (
                                                  formatter(item.account.user_profile.engagements)
                                              ) : (
                                                  <div className="text-primary-500 text-sm bg-gray-100 w-10 h-4" />
                                              )}
                                          </td>
                                          <td className="text-sm">
                                              {!placeholder ? (
                                                  formatter(
                                                      item.account.user_profile.engagement_rate
                                                  )
                                              ) : (
                                                  <div className="text-primary-500 text-sm bg-gray-100 w-10 h-4" />
                                              )}
                                          </td>
                                          <td className="text-sm">
                                              {!placeholder ? (
                                                  formatter(item.account.user_profile.avg_views)
                                              ) : (
                                                  <div className="text-primary-500 text-sm bg-gray-100 w-10 h-4" />
                                              )}
                                          </td>
                                      </tr>
                                  );
                              })
                            : null}
                    </tbody>
                </table>
            </div>
            <div className="space-x-2">
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
            </div>
        </div>
    );
};
