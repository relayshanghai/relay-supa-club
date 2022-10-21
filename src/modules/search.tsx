/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from 'src/components/button';
import { Input } from 'src/components/input';
import { Spinner } from 'src/components/spinner';
import { useSubscription } from 'src/hooks/use-subscription';
import { formatter } from 'src/utils/formatter';

export const Search = () => {
    const [search, setSearch] = useState('');
    const [channel, setChannel] = useState<any>('youtube');
    const channels = [
        { icon: '/assets/svg/yt.svg', label: 'YouTube', id: 'youtube' },
        { icon: '/assets/svg/instagram.svg', label: 'Instagram', id: 'instagram' },
        { icon: '/assets/svg/tiktok.svg', label: 'TikTok', id: 'tiktok' }
    ];
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<any>(0);
    const [results, setResults] = useState<any>();
    const { subscription } = useSubscription();

    useEffect(() => {
        setLoading(true);
        if (subscription) {
            fetch('/api/kol', {
                method: 'post',
                body: JSON.stringify({
                    platform: channel,
                    term: search,
                    page: page,
                    subscription
                })
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    setLoading(false);
                    setResults(res);
                })
                .catch((e) => {
                    setLoading(false);
                    console.log(e);
                });
        }
    }, [search, channel, subscription, page]);

    const accounts = results?.accounts ?? [];
    const feed =
        accounts.length < 10 ? [...accounts, ...Array.from(Array(10 - accounts.length))] : accounts;

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
            <Input
                type="text"
                placeholder="Search for KOLs"
                value={search}
                onChange={(e: any) => {
                    setSearch(e.target.value);
                }}
            />
            <div>
                {results ? (
                    <div className="font-bold text-sm">
                        Total Results: {formatter(results.total)}
                    </div>
                ) : null}
            </div>
            <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow">
                <thead className="bg-white sticky top-0">
                    <tr>
                        <th className="w-2/4 px-4 py-4 text-xs text-gray-500 font-normal text-left">
                            Account
                        </th>
                        <th className="text-xs text-gray-500 font-normal text-left">Followers</th>
                        <th className="text-xs text-gray-500 font-normal text-left">Engagements</th>
                        <th className="text-xs text-gray-500 font-normal text-left">
                            Engagement Rate
                        </th>
                        <th className="text-xs text-gray-500 font-normal text-left">Avg. views</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="p-4 text-center">
                                <Spinner />
                            </td>
                        </tr>
                    ) : Array.isArray(feed) ? (
                        feed.map((item: any, i: any) => {
                            const placeholder = !item;
                            const handle = !placeholder
                                ? item.account.user_profile.username ||
                                  item.account.user_profile.custom_name ||
                                  item.account.user_profile.fullname
                                : null;
                            return (
                                <tr
                                    key={i}
                                    className={`${placeholder ? 'bg-gray-100' : ''} relative`}
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
                                                <div className="w-12 h-12 rounded-full bg-gray-200" />
                                                <div className="space-y-2">
                                                    <div className="font-bold text-gray-200 bg-gray-200 w-40 h-4" />
                                                    <div className="text-primary-500 text-sm text-gray-200 bg-gray-200 w-20 h-4" />
                                                </div>
                                                <div className="absolute top-0 left-0 translate-x-1/2 translate-y-1/2 p-2 text-sm">
                                                    <Link href="/account" passHref>
                                                        <a className="text-primary-500">
                                                            Upgrade your subscription plan, to view
                                                            more results.
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
                                            <div className="text-primary-500 text-sm text-gray-200 bg-gray-200 w-10 h-4" />
                                        )}
                                    </td>
                                    <td className="text-sm">
                                        {!placeholder ? (
                                            formatter(item.account.user_profile.engagements)
                                        ) : (
                                            <div className="text-primary-500 text-sm text-gray-200 bg-gray-200 w-10 h-4" />
                                        )}
                                    </td>
                                    <td className="text-sm">
                                        {!placeholder ? (
                                            formatter(item.account.user_profile.engagement_rate)
                                        ) : (
                                            <div className="text-primary-500 text-sm text-gray-200 bg-gray-200 w-10 h-4" />
                                        )}
                                    </td>
                                    <td className="text-sm">
                                        {!placeholder ? (
                                            formatter(item.account.user_profile.avg_views)
                                        ) : (
                                            <div className="text-primary-500 text-sm text-gray-200 bg-gray-200 w-10 h-4" />
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    ) : null}
                </tbody>
            </table>
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
