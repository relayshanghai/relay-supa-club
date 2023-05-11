import { useCallback, useState } from 'react';
import { useSearch } from 'src/hooks/use-search';
import { useTranslation } from 'react-i18next';
import type { CreatorPlatform } from 'types';
import type { ChangeEvent } from 'react';
import { debounce } from 'src/utils/debounce';
import { Spinner } from '../icons';

export const SearchCreators = ({ platform }: { platform: CreatorPlatform }) => {
    const [searchTerm, setSearchTerm] = useState<string | ''>();
    const [spinnerLoading, setSpinnerLoading] = useState(false);
    const { t } = useTranslation();

    const { setPlatform, setUsername } = useSearch();

    // Disabling the exhaustive-deps rule because we need to use the debounce function and we already know the required dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const searchInfluencer = useCallback(
        debounce((term: any) => {
            setPlatform(platform);
            setUsername(term);
            setSpinnerLoading(false);
        }),
        [platform],
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.trim());
        setSpinnerLoading(true);

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
            {spinnerLoading && <Spinner className="absolute right-2 top-3 h-5 w-5 fill-primary-600 text-white" />}
        </div>
    );
};
