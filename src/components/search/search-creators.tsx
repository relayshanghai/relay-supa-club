import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ChangeEvent } from 'react';
import { ChevronDown, Instagram, Tiktok, YoutubeNoBg } from '../icons';
import { useSearchTrackers } from '../rudder/searchui-rudder-calls';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { SearchInfluencerByName } from 'src/utils/analytics/events/discover/search-influencer-by-name';
import useSearchInfluencersByUsername from 'src/hooks/use-search-influencers-by-username';
import type { CreatorPlatform } from 'types';
import { clientLogger } from 'src/utils/logger-client';
import toast from 'react-hot-toast';

const platformIcons = {
    youtube: <YoutubeNoBg data-testid="youtube-platform" className="h-6 w-6" />,
    tiktok: <Tiktok data-testid="tiktok-platform" className="h-6 w-6" />,
    instagram: <Instagram data-testid="instagram-platform" className="h-6 w-6" />,
};

export const SearchCreators = () => {
    const [searchUsername, setSearchUsername] = useState('');
    const [searchPlatform, setSearchPlatform] = useState<CreatorPlatform>('youtube');
    const { t } = useTranslation();
    const { trackSearch } = useSearchTrackers();

    const { track } = useRudderstackTrack();
    const { getInfluencerByUsername } = useSearchInfluencersByUsername();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.trim() === '') {
            setSearchUsername('');
        } else {
            setSearchUsername(e.target.value);
        }
        setSearchUsername(e.target.value);
    };

    const handleSubmit = useCallback(async () => {
        try {
            const searchResult = await getInfluencerByUsername(searchUsername, searchPlatform);
            if (searchResult.total === 0) {
                toast.error(
                    t('creators.show.noInfluencerSearchResults', {
                        username: searchUsername,
                        platform: searchPlatform,
                    }),
                );
                return;
            }

            window.open(
                `/influencer/${searchPlatform}/${searchResult.accounts[0].account.user_profile.user_id}`,
                '_blank',
            );
        } catch (error) {
            if (error instanceof Error) {
                clientLogger(error.message);
            }
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
                className="mr-24 block w-full appearance-none rounded-md border border-gray-200 bg-white py-2 pl-24 pr-4 text-gray-600 placeholder-gray-400 ring-1 ring-gray-900 ring-opacity-5 placeholder:text-sm focus:outline-none"
                placeholder={t('creators.show.searchInfluencerPlaceholder') as string}
                data-testid="creator-search"
                id="creator-search"
                value={searchUsername}
                onChange={handleChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
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
    return (
        <div className={`h-full ${className} gap-2`}>
            <div
                onClick={() => setExpanded(!expanded)}
                data-testid="platform-dropdown"
                className={`flex h-full cursor-pointer flex-row items-center gap-3 border-r border-r-gray-200 pl-4`}
            >
                {platformIcons[platform]}
                <ChevronDown className="h-4 w-4 stroke-gray-300 stroke-2" />
            </div>
            {expanded && (
                <div className="absolute top-full z-50 flex h-fit w-full flex-col items-center rounded-b-md border border-gray-300 bg-white shadow-md">
                    <div
                        className="flex w-full cursor-pointer justify-center py-3 hover:bg-primary-200"
                        onClick={() => handlePlatorm('tiktok')}
                    >
                        <Tiktok data-testid="tiktok-option" className="h-6 w-6" />
                    </div>
                    <div
                        className="flex w-full cursor-pointer justify-center py-3 hover:bg-primary-200"
                        onClick={() => handlePlatorm('instagram')}
                    >
                        <Instagram data-testid="instagram-option" className="h-6 w-6" />
                    </div>
                    <div
                        className="flex w-full cursor-pointer justify-center py-3 hover:bg-primary-200"
                        onClick={() => handlePlatorm('youtube')}
                    >
                        <YoutubeNoBg data-testid="youtube-option" className="h-6 w-6" />
                    </div>
                </div>
            )}
        </div>
    );
};
