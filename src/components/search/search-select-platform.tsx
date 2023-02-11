import { useSearch } from 'src/hooks/use-search';
import { CreatorPlatform } from 'types';

const platforms: {
    icon: string;
    label: string;
    id: CreatorPlatform;
}[] = [
    { icon: '/assets/imgs/icons/yt.svg', label: 'YouTube', id: 'youtube' },
    { icon: '/assets/imgs/icons/instagram.svg', label: 'Instagram', id: 'instagram' },
    { icon: '/assets/imgs/icons/tiktok.svg', label: 'TikTok', id: 'tiktok' },
];

export const SelectPlatform = () => {
    const { platform, setPlatform } = useSearch();
    return (
        <div className="flex flex-row space-x-2">
            {platforms.map(({ id, label, icon }) => (
                <button
                    className={`transition px-2 rounded-lg hover:shadow-xl ${
                        platform === id ? 'bg-white shadow-xl' : ''
                    }`}
                    key={label}
                    onClick={() => {
                        setPlatform(id);
                    }}
                >
                    <img src={icon} height={32} width={32} alt={label} />
                </button>
            ))}
        </div>
    );
};
