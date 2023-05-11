import { useCallback, useState } from 'react';
import { useSearch } from 'src/hooks/use-search';
import { useTranslation } from 'react-i18next';
import type { CreatorPlatform } from 'types';
import type { ChangeEvent } from 'react';
import { debounce } from 'src/utils/debounce';
import { useRudderstack } from 'src/hooks/use-rudderstack';

export const SearchCreators = ({ platform }: { platform: CreatorPlatform }) => {
    const [searchTerm, setSearchTerm] = useState<string | ''>();
    const { t } = useTranslation();

    const { setPlatform, setUsername } = useSearch();
    const { trackEvent } = useRudderstack();

    // Disabling the exhaustive-deps rule because we need to use the debounce function and we already know the required dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const searchInfluencer = useCallback(
        debounce((term: any) => {
            setPlatform(platform);
            setUsername(term);
            trackEvent('Search Options, search for an influencer', { influencer: term, platform });
        }),
        [platform],
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.trim());

        if (e.target.value.trim() === '') {
            setUsername('');
        }

        searchInfluencer(e.target.value.trim());
    };

    return (
        <div className="group relative flex w-full flex-col font-medium">
            <input
                className="block w-full appearance-none rounded-md border border-gray-200 bg-white px-5 py-2 text-gray-600 placeholder-gray-400 ring-1 ring-gray-900 ring-opacity-5 placeholder:text-sm focus:outline-none"
                placeholder={t('creators.show.searchInfluencerPlaceholder') as string}
                data-testid="creator-search"
                id="creator-search"
                value={searchTerm}
                onChange={handleChange}
            />
        </div>
    );
};
