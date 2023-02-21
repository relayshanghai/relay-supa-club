import { useSearch } from 'src/hooks/use-search';
import { CreatorPlatform } from 'types';
import { Spinner } from '../icons';

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
    const { platform, setPlatform, loading } = useSearch();
    return (
        <div className="flex flex-row space-x-2">
            {platforms.map(({ id, label, icon }) => (
                <button
                    className={`transition duration-300 px-2 rounded-lg hover:shadow-md ${
                        platform === id ? 'bg-white shadow-md' : ''
                    }`}
                    disabled={loading}
                    key={label}
                    onClick={() => {
                        setPlatform(id);
                    }}
                >
                    {loading && platform === id ? (
                        <Spinner className="fill-primary-600 text-white w-6 h-6" />
                    ) : (
                        <img src={icon} height={32} width={32} alt={label} />
                    )}
                </button>
            ))}
        </div>
    );
};
