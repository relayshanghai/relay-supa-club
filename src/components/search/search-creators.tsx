import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ChangeEvent } from 'react';
import { ChevronDown, Spinner } from '../icons';
import { useSearchTrackers } from '../rudder/searchui-rudder-calls';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { SearchInfluencerByName } from 'src/utils/analytics/events/discover/search-influencer-by-name';
import type { CreatorPlatform } from 'types';
import { clientLogger } from 'src/utils/logger-client';
import toast from 'react-hot-toast';
import { platforms } from './search-select-platform';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';
import { useSearchInfluencersByUsernameV2 } from 'src/hooks/v2/use-search-influencers-by-username';

export const SearchCreators = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [searchUsername, setSearchUsername] = useState('');
    const [searchPlatform, setSearchPlatform] = useState<CreatorPlatform>('youtube');
    const { t } = useTranslation();
    const { trackSearch } = useSearchTrackers();

    const { track } = useRudderstackTrack();
    const { getInfluencerByUsername } = useSearchInfluencersByUsernameV2();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.trim() === '') {
            setSearchUsername('');
        } else {
            setSearchUsername(e.target.value);
        }
        setSearchUsername(e.target.value);
    };

    const handleSubmit = useCallback(async () => {
        setIsLoading(true);
        try {
            const searchResult = await getInfluencerByUsername({ username: searchUsername, platform: searchPlatform });
            if (!searchResult) {
                toast.error(
                    t('creators.show.noInfluencerSearchResults', {
                        username: searchUsername,
                        platform: searchPlatform,
                    }),
                );
                return;
            }
            setIsLoading(false);

            window.open(
                `/influencer/${encodeURIComponent(searchPlatform)}/${encodeURIComponent(
                    searchResult?.user_id as string,
                )}`,
                '_blank',
            );
        } catch (error) {
            clientLogger(error);
            return;
        }

        trackSearch('Search Options');
        track(SearchInfluencerByName, {
            search_query: searchUsername,
            platform: searchPlatform,
        });
    }, [trackSearch, track, searchUsername, searchPlatform, getInfluencerByUsername, t]);

    return (
        <div className="group relative flex w-full flex-col font-medium">
            <PlatformDropdown
                platform={searchPlatform}
                setSearchPlatform={setSearchPlatform}
                className="absolute left-0 top-0 h-full w-20"
            />
            <input
                className="block w-[450px] appearance-none rounded-md border border-gray-200 bg-white py-2 pl-24 pr-4 text-gray-600 placeholder-gray-400 ring-1 ring-gray-900 ring-opacity-5 placeholder:text-sm focus:outline-none"
                placeholder={t('creators.show.searchInfluencerPlaceholder') as string}
                data-testid="creator-search"
                id="creator-search"
                value={searchUsername}
                onChange={handleChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            {isLoading && <Spinner className="absolute right-2 top-2 h-6 w-6 fill-primary-600 text-white" />}
        </div>
    );
};

const PlatformDropdown = ({
    className,
    platform,
    setSearchPlatform,
}: {
    className: string;
    platform: CreatorPlatform;
    setSearchPlatform: (platform: CreatorPlatform) => void;
}) => {
    const [expanded, setExpanded] = useState(false);
    const handlePlatorm = (platform: CreatorPlatform) => {
        setSearchPlatform(platform);
        setExpanded(false);
    };
    const dropdownRef = useRef<HTMLDivElement>(null);
    useOnOutsideClick(dropdownRef, () => setExpanded(false));
    return (
        <div ref={dropdownRef} className={`h-full ${className} gap-2`}>
            <div
                onClick={() => setExpanded(!expanded)}
                data-testid="platform-dropdown"
                className={`flex h-full cursor-pointer flex-row items-center gap-3 border-r border-r-gray-200 pl-4`}
            >
                <img
                    data-testid={`${platform}-platform`}
                    height={28}
                    width={28}
                    src={platforms.filter((p) => p.id === platform)[0].icon}
                    alt={`selected platform ${platform}`}
                />
                <ChevronDown className="h-4 w-4 stroke-gray-300 stroke-2" />
            </div>
            {expanded && (
                <div className="absolute top-full z-50 flex h-fit w-full flex-col items-center rounded-lg border border-gray-300 bg-white px-1 py-2 shadow-lg">
                    {platforms.map(({ id, label, icon }) => (
                        <div
                            key={id}
                            className="flex w-full cursor-pointer justify-center rounded-md py-3 hover:bg-primary-100"
                            onClick={() => handlePlatorm(id)}
                        >
                            <img data-testid={`${id}-option`} src={icon} height={28} width={28} alt={label} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
