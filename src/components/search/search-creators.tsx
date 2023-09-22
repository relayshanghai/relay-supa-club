import { useCallback, useState } from 'react';
import { useSearch } from 'src/hooks/use-search';
import { useTranslation } from 'react-i18next';
import type { ChangeEvent } from 'react';
import { Search } from '../icons';
import { useSearchTrackers } from '../rudder/searchui-rudder-calls';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { SearchInfluencerByName } from 'src/utils/analytics/events/discover/search-influencer-by-name';

export const SearchCreators = ({ onSearch }: { onSearch: (params: any) => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { t } = useTranslation();
    const { trackSearch } = useSearchTrackers();

    const { setPlatform, setUsername, setText, setActiveSearch, setPage, getSearchParams, username, platform } =
        useSearch();
    const { track } = useRudderstackTrack();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.trim() === '') {
            setText('');
            setUsername('');
        } else {
            setUsername(e.target.value);
            setText(e.target.value);
        }
        setPlatform(platform);
        setSearchTerm(e.target.value);
    };

    const handleSubmit = useCallback(() => {
        setActiveSearch(true);
        setPage(0);
        trackSearch('Search Options');
        track(SearchInfluencerByName, {
            search_query: username,
            platform,
        });
        onSearch({ searchParams: getSearchParams() });
    }, [setActiveSearch, setPage, trackSearch, track, username, platform, onSearch, getSearchParams]);

    return (
        <div className="group relative flex w-full flex-col font-medium">
            <Search onClick={handleSubmit} className="absolute left-2 top-2 h-6 w-6 cursor-pointer fill-gray-400" />
            <input
                className="block w-full appearance-none rounded-full border border-gray-200 bg-white py-2 pl-10 pr-6 text-gray-600 placeholder-gray-400 ring-1 ring-gray-900 ring-opacity-5 placeholder:text-sm focus:outline-none"
                placeholder={t('creators.show.searchInfluencerPlaceholder') as string}
                data-testid="creator-search"
                id="creator-search"
                value={searchTerm}
                onChange={handleChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
        </div>
    );
};
