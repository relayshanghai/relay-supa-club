import type { ChangeEvent, KeyboardEvent} from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';
import { useTranslation } from 'react-i18next';
import { clientLogger } from 'src/utils/logger';
import type { AudienceLookalike, CreatorPlatform } from 'types';
import { Enter, Spinner } from '../icons';
import CreatorCard from './search-creator-card';
import { nextFetch } from 'src/utils/fetcher';

export const SearchCreators = ({ platform }: { platform: CreatorPlatform }) => {
    const searchRef = useRef<any>();
    const [creators, setCreators] = useState<AudienceLookalike[] | []>([]);
    const [searchTerm, setSearchTerm] = useState<string | ''>();
    const [loading, setLoading] = useState<boolean>(false);
    const [displaySearch, setDisplaySearch] = useState<boolean>(false);
    const { t } = useTranslation();

    useOnOutsideClick(searchRef, () => {
        setDisplaySearch(false);
        setSearchTerm('');
    });
    const searchLookAlike = useCallback(
        async (term: any) => {
            setLoading(true);
            try {
                const { data } = await nextFetch('influencer-search/lookalike', {
                    method: 'post',
                    body: JSON.stringify({
                        term,
                        platform,
                    }),
                });
                setCreators(data);
            } catch (error) {
                clientLogger(error);
            } finally {
                setDisplaySearch(true);
                setLoading(false);
            }
        },
        [platform],
    );

    const handleSearch = (e: KeyboardEvent<HTMLInputElement> & ChangeEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && e.target.value) {
            setSearchTerm(e.target.value.trim());
            searchLookAlike(searchTerm);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        if (searchTerm === '') setCreators([]);
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
                onChange={(e) => handleChange(e)}
                onKeyUp={(e: KeyboardEvent<HTMLInputElement> & ChangeEvent<HTMLInputElement>) =>
                    handleSearch(e)
                }
            />
            {loading ? (
                <Spinner className="absolute right-2 top-2.5 z-50 h-5 w-5 fill-primary-600 text-white" />
            ) : (
                <div className="absolute right-2 top-2.5 z-50 flex items-center">
                    <p className="mr-2 text-xs text-gray-400">
                        {t('creators.show.pressEnterToSearch')}
                    </p>
                    <Enter className="group-hover:fill-red h-6 w-6  fill-gray-500 " />
                </div>
            )}

            <div className="relative w-full ">
                {displaySearch && (
                    <div className="absolute top-1 left-0 z-10 w-full overflow-hidden rounded-md bg-white py-2 text-sm ring-1 ring-gray-200">
                        {creators?.length ? (
                            creators.map((creator, i) => (
                                <div key={i}>
                                    <CreatorCard creator={creator} platform={platform} />
                                </div>
                            ))
                        ) : (
                            <p className="p-3 text-xs text-gray-400">
                                {t('creators.show.noSearchResults')}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
