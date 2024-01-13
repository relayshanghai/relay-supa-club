import { useSearch } from 'src/hooks/use-search';
import type { CreatorPlatform } from 'types';
import { Spinner } from '../icons';
import { useSearchTrackers } from '../rudder/searchui-rudder-calls';

export const platforms: {
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
    const { trackPlatformChange } = useSearchTrackers();

    return (
        <div className="flex flex-row space-x-2">
            {platforms.map(({ id, label, icon }) => (
                <button
                    className={`rounded-lg px-2 transition duration-300 hover:shadow-md ${
                        platform === id ? 'bg-white shadow-md' : ''
                    }`}
                    disabled={loading}
                    key={label}
                    onClick={() => {
                        setPlatform(id);
                        trackPlatformChange({ platform: id, current_platform: platform });
                    }}
                >
                    {loading && platform === id ? (
                        <Spinner
                            data-testid={`platform-select-loading-${platform}`}
                            className="h-6 w-6 fill-primary-600 text-white"
                        />
                    ) : (
                        <img src={icon} height={32} width={32} alt={label} />
                    )}
                </button>
            ))}
        </div>
    );
};
