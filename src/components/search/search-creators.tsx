import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearch } from 'src/hooks/use-search';
import { useTranslation } from 'react-i18next';
import type { CreatorPlatform } from 'types';
import type { ChangeEvent } from 'react';

export const SearchCreators = ({ platform }: { platform: CreatorPlatform }) => {
    const searchRef = useRef<any>();
    const [searchTerm, setSearchTerm] = useState<string | ''>();
    const { t } = useTranslation();

    const { setPlatform, setUsername } = useSearch();

    const debounce = (fn: any) => {
        let timeout: any = null;
        return (...args: any) => {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                fn(...args);
            }, 500);
        };
    };

    // Disabling the exhaustive-deps rule because we need to use the debounce function and we already know the required dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const searchInfluencer = useCallback(
        debounce((term: any) => {
            setPlatform(platform);
            setUsername(term);
        }),
        [platform],
    );

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.trim());
        searchInfluencer(e.target.value.trim());
    };

    useEffect(() => {
        setSearchTerm('');
    }, [platform]);

    return (
        <div className="group relative flex w-full flex-col font-medium" ref={searchRef}>
            <input
                className="block w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-600 placeholder-gray-400 ring-1 ring-gray-900 ring-opacity-5 placeholder:text-sm focus:outline-none"
                placeholder={t('creators.show.searchInfluencerPlaceholder') as string}
                data-testid="creator-search"
                id="creator-search"
                value={searchTerm}
                onChange={handleChange}
            />
        </div>
    );
};
