import type { InfluencerPostRequest, InfluencerPostResponse } from 'pages/api/influencer-search';
import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { usageErrors } from 'src/errors/usages';
import { hasCustomError } from 'src/utils/errors';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import type {
    CreatorPlatform,
    LocationWeighted,
    CreatorSearchTag,
    AudienceAgeRangeWeighted,
    AudienceGenderWeighted,
    SearchResultMetadata,
} from 'types';
import { useUser } from './use-user';
import useSWR from 'swr';
import type { RecommendedInfluencersGetResponse } from 'pages/api/recommended-influencers';
import { featRecommended } from 'src/constants/feature-flags';

type NullStringTuple = [null | string, null | string];
import type { FetchCreatorsFilteredParams } from 'src/utils/api/iqdata/transforms';

export interface ISearchContext {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    tags: CreatorSearchTag[];
    setTopicTags: (tags: CreatorSearchTag[]) => void;
    text: string;
    setText: (text: string) => void;
    keywords: string;
    setKeywords: (keywords: string) => void;
    hashtags: string[];
    setHashtags: (hashtags: string[]) => void;
    username: string;
    setUsername: (username: string) => void;
    influencerLocation: LocationWeighted[];
    setInfluencerLocation: (location: LocationWeighted[]) => void;
    views: NullStringTuple;
    setViews: Dispatch<SetStateAction<NullStringTuple>>;
    audience: NullStringTuple;
    setAudience: Dispatch<SetStateAction<NullStringTuple>>;
    gender?: string;
    setGender: (gender?: string) => void;
    engagement?: number;
    setEngagement: (engagement?: number) => void;
    lastPost?: string;
    setLastPost: (lastPost?: string) => void;
    contactInfo?: string;
    setContactInfo: (contactInfo?: string) => void;
    audienceLocation: LocationWeighted[];
    setAudienceLocation: (location: LocationWeighted[]) => void;
    audienceAge: AudienceAgeRangeWeighted | undefined;
    setAudienceAge: (location: AudienceAgeRangeWeighted) => void;
    audienceGender: AudienceGenderWeighted | undefined;
    setAudienceGender: (location: AudienceGenderWeighted) => void;
    platform: CreatorPlatform;
    setPlatform: (platform: CreatorPlatform) => void;
    resultsPerPageLimit: number;
    setResultsPerPageLimit: (limit: number) => void;
    usageExceeded: boolean;
    setUsageExceeded: (exceeded: boolean) => void;
    page: number;
    setPage: (page: number) => void;
    onlyRecommended: boolean;
    setOnlyRecommended: (onlyRecommended: boolean) => void;
    recommendedInfluencers: string[];
    activeSearch: boolean;
    setActiveSearch: (activeSearch: boolean) => void;
    searchParams: FetchCreatorsFilteredParams | undefined;
    setSearchParams: (searchParams: FetchCreatorsFilteredParams | undefined) => void;
    getSearchParams: () => FetchCreatorsFilteredParams | undefined;
}

export const SearchContext = createContext<ISearchContext>({
    /** this 'loading' triggers when any page is loading */
    loading: true,
    setLoading: () => null,
    tags: [],
    setTopicTags: () => null,
    text: '',
    setText: () => null,
    keywords: '',
    setKeywords: () => null,
    hashtags: [],
    setHashtags: () => null,
    username: '',
    setUsername: () => null,
    influencerLocation: [],
    setInfluencerLocation: () => null,
    views: [null, null],
    setViews: () => null,
    audience: [null, null],
    setAudience: () => null,
    gender: undefined,
    setGender: () => null,
    engagement: undefined,
    setEngagement: () => null,
    lastPost: undefined,
    setLastPost: () => null,
    contactInfo: undefined,
    setContactInfo: () => null,
    audienceLocation: [],
    setAudienceLocation: () => null,
    audienceAge: undefined,
    setAudienceAge: () => null,
    audienceGender: undefined,
    setAudienceGender: () => null,
    platform: 'youtube',
    setPlatform: () => null,
    resultsPerPageLimit: 10,
    setResultsPerPageLimit: () => null,
    usageExceeded: false,
    setUsageExceeded: () => null,
    page: 0,
    setPage: () => null,
    onlyRecommended: false,
    setOnlyRecommended: () => null,
    recommendedInfluencers: [],
    activeSearch: false,
    setActiveSearch: () => null,
    searchParams: undefined,
    setSearchParams: () => null,
    getSearchParams: () => undefined,
});

export const useSearch = () => useContext(SearchContext);

export const useSearchResults = (page: number) => {
    const { profile } = useUser();
    const ref = useRef<any>();

    type SearchResults = {
        results: InfluencerPostResponse['accounts'];
        resultsTotal: InfluencerPostResponse['total'];
        __metadata: SearchResultMetadata['__metadata'];
    };

    /**
     * Function to run after SWR request finished "loading"
     */
    const [onLoad, setOnLoad] = useState<(_data: SearchResults | undefined) => void>(
        () => (_data: SearchResults | undefined) => null,
    );

    const { setUsageExceeded, setLoading, setActiveSearch, searchParams } = useSearch();

    const { data, isLoading, mutate, isValidating, error } = useSWR(
        profile?.id && searchParams ? ['influencer-search', searchParams, page] : null,
        async ([path, searchParams, page]) => {
            try {
                if (!profile?.id) {
                    throw new Error('No profile');
                }

                if (ref.current) {
                    ref.current.abort();
                }

                const controller = new AbortController();
                const signal = controller.signal;
                ref.current = controller;

                const companyId = profile.company?.id;
                if (!companyId) {
                    throw new Error('No company');
                }

                const body: InfluencerPostRequest = {
                    ...searchParams,
                    company_id: companyId,
                    user_id: profile?.id,
                    page,
                };

                const res = await nextFetch<InfluencerPostResponse & SearchResultMetadata>(path, {
                    method: 'post',
                    signal,
                    body,
                });

                if (!res?.accounts) {
                    throw new Error('no accounts in results');
                }

                return { results: res?.accounts, resultsTotal: res?.total, __metadata: res.__metadata };
            } catch (error: any) {
                if (hasCustomError(error, usageErrors)) {
                    setUsageExceeded(true);
                } else if (!error?.message?.includes('abort')) {
                    clientLogger(error, 'error');
                }
                throw error;
            } finally {
                setLoading(false);
                setActiveSearch(false);
            }
        },
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    );

    // wait for swr to finish loading
    useEffect(() => {
        if (!data || isLoading === true) return;
        onLoad(data);
    }, [onLoad, isLoading, data]);

    useEffect(() => {
        if (error) {
            setLoading(false);
        } else {
            setLoading(isLoading);
        }
    }, [setLoading, isLoading, error]);

    const noResults = !data?.results || data?.results.length === 0;
    return {
        results: data?.results,
        resultsTotal: data?.resultsTotal || 0,
        /** this 'loading' only triggers when this page is loading */
        loading: isLoading,
        error: error?.message?.includes('abort') ? undefined : error,
        isValidating,
        noResults,
        mutate,
        metadata: data?.__metadata,
        onLoad,
        setOnLoad,
    };
};

export const SearchProvider = ({ children }: PropsWithChildren) => {
    // this 'loading' triggers when any page is loading
    const [loading, setLoading] = useState(true);
    const [resultsPerPageLimit, setResultsPerPageLimit] = useState(10);
    const [usageExceeded, setUsageExceeded] = useState(false);
    const [page, setPage] = useState(0);
    const [searchParams, setSearchParams] = useState<FetchCreatorsFilteredParams>();

    // search options
    const [tags, setTopicTags] = useState<CreatorSearchTag[]>([]);
    const [text, setText] = useState<string>('');
    const [keywords, setKeywords] = useState<string>('');
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [username, setUsername] = useState<string>('');
    const [influencerLocation, setInfluencerLocation] = useState<LocationWeighted[]>([]);
    const [views, setViews] = useState<NullStringTuple>([null, null]);
    const [audience, setAudience] = useState<NullStringTuple>([null, null]);
    const [gender, setGender] = useState<string>();
    const [engagement, setEngagement] = useState<number>();
    const [lastPost, setLastPost] = useState<string>();
    const [contactInfo, setContactInfo] = useState<string>();
    const [audienceLocation, setAudienceLocation] = useState<LocationWeighted[]>([]);
    const [audienceAge, setAudienceAge] = useState<AudienceAgeRangeWeighted | undefined>();
    const [audienceGender, setAudienceGender] = useState<AudienceGenderWeighted | undefined>();
    const [platform, setPlatform] = useState<CreatorPlatform>('youtube');
    const [onlyRecommended, setOnlyRecommended] = useState(true);
    const [activeSearch, setActiveSearch] = useState(false);

    const { data: recommendedInfluencers } = useSWR(featRecommended() ? 'recommended-influencers' : null, (path) =>
        nextFetch<RecommendedInfluencersGetResponse>(path),
    );

    const getSearchParams = useCallback((): typeof searchParams & {
        hashtags: string[];
        onlyRecommended: boolean;
        activeSearch: boolean;
    } => {
        return {
            page,
            tags,
            text,
            keywords,
            hashtags,
            username,
            influencerLocation,
            views,
            audience,
            gender,
            engagement,
            lastPost,
            contactInfo,
            audienceLocation,
            audienceAge,
            audienceGender,
            platform,
            onlyRecommended,
            activeSearch,
        };
    }, [
        page,
        tags,
        text,
        keywords,
        hashtags,
        username,
        influencerLocation,
        views,
        audience,
        gender,
        engagement,
        lastPost,
        contactInfo,
        audienceLocation,
        audienceAge,
        audienceGender,
        platform,
        onlyRecommended,
        activeSearch,
    ]);

    return (
        <SearchContext.Provider
            value={{
                loading,
                setLoading,
                platform,
                setPlatform,
                tags,
                setTopicTags,
                text,
                setText,
                keywords,
                setKeywords,
                hashtags,
                setHashtags,
                username,
                setUsername,
                influencerLocation,
                setInfluencerLocation,
                audienceLocation,
                setAudienceLocation,
                audienceAge,
                setAudienceAge,
                audienceGender,
                setAudienceGender,
                audience,
                setAudience,
                views,
                setViews,
                gender,
                setGender,
                engagement,
                setEngagement,
                lastPost,
                setLastPost,
                contactInfo,
                setContactInfo,
                resultsPerPageLimit,
                setResultsPerPageLimit,
                usageExceeded,
                setUsageExceeded,
                page,
                setPage,
                onlyRecommended,
                setOnlyRecommended,
                recommendedInfluencers: recommendedInfluencers ?? [],
                activeSearch,
                setActiveSearch,
                searchParams,
                setSearchParams,
                getSearchParams,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};
