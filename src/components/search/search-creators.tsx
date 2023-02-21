import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';
import { useTranslation } from 'react-i18next';
import { serverLogger } from 'src/utils/logger';
import { AudienceLookalike, CreatorPlatform } from 'types';
import { Spinner } from '../icons';
import CreatorCard from './search-creator-card';

export const SearchCreators = ({ platform }: { platform: CreatorPlatform }) => {
    const searchRef = useRef<any>();
    const [creators, setCreators] = useState<AudienceLookalike[] | []>([]);
    const [searchTerm, setSearchTerm] = useState<string | ''>();
    const [loading, setLoading] = useState<boolean>(false);
    const [displaySearch, setDisplaySearch] = useState<boolean>(false);
    const { t } = useTranslation();

    useOnOutsideClick(searchRef, () => {
        setDisplaySearch(false);
    });

    const searchLookAlike = useCallback(
        async (term: any) => {
            setLoading(true);
            try {
                const res = await (
                    await fetch('/api/influencer-search/lookalike', {
                        method: 'post',
                        body: JSON.stringify({
                            term,
                            platform,
                        }),
                    })
                ).json();
                setCreators(res.data);
            } catch (error) {
                serverLogger(error);
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
        <div className="w-full font-medium relative flex flex-col">
            <input
                className=" placeholder-gray-400 appearance-none bg-white rounded-md block w-full px-3 py-2 border border-gray-200 ring-1 ring-gray-900 ring-opacity-5 placeholder:text-sm focus:outline-none text-gray-600"
                placeholder={t('creators.show.searchInfluencerPlaceholder') as string}
                ref={searchRef}
                id="creator-search"
                autoFocus
                value={searchTerm}
                onChange={(e) => handleChange(e)}
                onKeyUp={(e: KeyboardEvent<HTMLInputElement> & ChangeEvent<HTMLInputElement>) =>
                    handleSearch(e)
                }
            />
            {loading && (
                <Spinner className="w-5 h-5 absolute right-2 top-2.5 z-50 fill-primary-600 text-white" />
            )}

            <div ref={searchRef} className="relative w-full ">
                {displaySearch && (
                    <div className="absolute text-sm z-10 top-1 ring-1 ring-gray-200 left-0 w-full bg-white rounded-md overflow-hidden py-2">
                        {creators?.length ? (
                            creators.map((creator, i) => (
                                <div key={i}>
                                    <CreatorCard creator={creator} platform={platform} />
                                </div>
                            ))
                        ) : (
                            <div className="text-xs text-gray-400 p-3">
                                {t('creators.show.noSearchResults')}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
