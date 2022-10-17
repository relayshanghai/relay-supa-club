import { useState } from 'react';
import { Input } from 'src/components/input';

export const Search = () => {
    const [search, setSearch] = useState('');
    const [channel, setChannel] = useState<any>('YouTube');
    const channels = [
        { icon: '/assets/svg/yt.svg', label: 'YouTube' },
        { icon: '/assets/svg/instagram.svg', label: 'Instagram' },
        { icon: '/assets/svg/tiktok.svg', label: 'TikTok' }
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-row space-x-2">
                {channels.map((item, i) => (
                    <button
                        className={`transition px-2 rounded-lg hover:shadow-xl ${
                            channel === item.label ? 'bg-white shadow-xl' : ''
                        }`}
                        key={item.label}
                        onClick={() => {
                            setChannel(item.label);
                        }}
                    >
                        <img src={item.icon} height={32} width={32} alt={item.label} />
                    </button>
                ))}
            </div>
            <Input
                placeholder="Search for KOLs"
                value={search}
                onChange={(e: any) => {
                    setSearch(e.target.value);
                }}
            />
        </div>
    );
};
