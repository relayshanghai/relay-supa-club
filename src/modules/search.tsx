import { useEffect, useState } from 'react';
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
    }, [search, channel, subscription]);

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
                        <th className="px-4 py-4 text-xs text-gray-500 font-normal text-left">
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
                    {Array.isArray(results?.accounts)
                        ? results.accounts.map((item: any, i: any) => {
                              const handle =
                                  item.account.user_profile.username ||
                                  item.account.user_profile.custom_name;
                              return (
                                  <tr key={i}>
                                      <td className="py-2 px-4 flex flex-row items-center space-x-2">
                                          <img
                                              src={`https://image-cache.brainchild-tech.cn/?link=${item.account.user_profile.picture}`}
                                              className="w-12 h-12"
                                          />
                                          <div>
                                              <div className="font-bold">
                                                  {item.account.user_profile.fullname}
                                              </div>
                                              <div className="text-primary-500 text-sm">
                                                  {handle ? `@${handle}` : null}
                                              </div>
                                          </div>
                                      </td>
                                      <td className="text-sm">
                                          {formatter(item.account.user_profile.followers)}
                                      </td>
                                      <td className="text-sm">
                                          {formatter(item.account.user_profile.engagements)}
                                      </td>
                                      <td className="text-sm">
                                          {formatter(item.account.user_profile.engagement_rate)}
                                      </td>
                                      <td className="text-sm">
                                          {formatter(item.account.user_profile.avg_views)}
                                      </td>
                                  </tr>
                              );
                          })
                        : null}
                </tbody>
            </table>
        </div>
    );
};
