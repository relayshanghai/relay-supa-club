import { useEffect, useState } from 'react';
import { Input } from 'src/components/input';

export const Search = () => {
    const [search, setSearch] = useState('');
    const [channel, setChannel] = useState<any>('youtube');
    const channels = [
        { icon: '/assets/svg/yt.svg', label: 'YouTube', id: 'youtube' },
        { icon: '/assets/svg/instagram.svg', label: 'Instagram', id: 'instagram' },
        { icon: '/assets/svg/tiktok.svg', label: 'TikTok', id: 'tiktok' }
    ];
    const [results, setResults] = useState<any>();

    useEffect(() => {
        console.log('search');
        if (search && search.length > 2) {
            fetch('/api/kol', {
                method: 'post',
                body: JSON.stringify({
                    platform: channel,
                    term: search
                })
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    setResults(res);
                });
        } else {
            setResults(undefined);
        }
    }, [search, channel]);

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
                    <div className="font-bold text-sm">Total Results: {results.total}</div>
                ) : null}
            </div>
            <div className="gap-2 grid grid-cols-3">
                {Array.isArray(results?.accounts)
                    ? results.accounts.map((item: any, i: any) => {
                          return (
                              <div
                                  key={item.account?.user_profile?.user_id ?? i}
                                  className="flex flex-row items-center space-x-2 shadow-xl rounded-xl p-2 bg-white"
                              >
                                  <div className="rounded-full overflow-hidden shadow-lg">
                                      <img
                                          src={item.account.user_profile.picture}
                                          className="w-12 h-12"
                                      />
                                  </div>
                                  <div className="flex flex-col">
                                      <div className="font-bold">
                                          {item.account.user_profile.custom_name}
                                      </div>
                                      <div className="text-sm">
                                          {item.account.user_profile.fullname}
                                      </div>
                                      <div className="font-bold text-sm">
                                          Avg. views: {item.account.user_profile.avg_views}
                                      </div>
                                  </div>
                              </div>
                          );
                      })
                    : null}
            </div>
        </div>
    );
};
