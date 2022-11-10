/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from 'src/components/button';
import { useSearch } from 'src/hooks/use-search';
import { useSubscription } from 'src/hooks/use-subscription';
import { formatter } from 'src/utils/formatter';
import { SearchTopics } from 'src/modules/search-topics';

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
        search
    } = useSearch();

    useEffect(() => {
        search();
    }, [search]);

    const accounts = results?.accounts ?? [];
    const feed =
        accounts.length < 10 && page > 1
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
                                <div className="">
                                    <img
                                        src={picture}
                                        className="w-8 h-8 rounded-full"
                                        alt={handle}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <div className="font-bold">{handle}</div>
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
                {results ? (
                    <div className="font-bold text-sm">
                        Total Results: {formatter(results.total)}
                    </div>
                ) : null}
            </div>
            <div className="w-full overflow-auto">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow">
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
