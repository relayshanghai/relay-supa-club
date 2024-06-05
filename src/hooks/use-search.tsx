import type { InfluencerPostRequest, InfluencerPostResponse } from 'pages/api/influencer-search';
import type { SearchTableInfluencer as ClassicSearchInfluencer } from 'types';
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
import { useLocalStorage } from './use-localstorage';

export const defaultAudienceLocations: LocationWeighted[] = [
    {
        id: 148838,
        type: ['country'],
        name: 'United States',
        title: 'United States',
        country: {
            id: 148838,
            code: 'US',
        },
        weight: 5, // 5 = 5%
    },
    {
        id: 1428125,
        type: ['country'],
        name: 'Canada',
        title: 'Canada',
        country: {
            id: 1428125,
            code: 'CA',
        },
        weight: 1, // 1 = 1%
    },
];

export const defaultAudienceGender = {
    code: 'FEMALE',
    weight: 0.01, // 0.01 = 0.1%
};

interface SearchContextGetter {
    tags: CreatorSearchTag[];
    text: string;
    keywords: string;
    hashtags: string[];
    username: string;
    influencerLocation: LocationWeighted[];
    views: NullStringTuple;
    audience: NullStringTuple;
    gender?: string;
    engagement?: number;
    lastPost?: string;
    contactInfo?: string;
    audienceLocation: LocationWeighted[];
    audienceAge: AudienceAgeRangeWeighted | undefined;
    audienceGender: AudienceGenderWeighted | undefined;
    platform: CreatorPlatform;
    onlyRecommended: boolean;
    activeSearch: boolean;
}

export interface ISearchContext extends SearchContextGetter {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setTopicTags: (tags: CreatorSearchTag[]) => void;
    setText: (text: string) => void;
    setKeywords: (keywords: string) => void;
    setHashtags: (hashtags: string[]) => void;
    setUsername: (username: string) => void;
    setInfluencerLocation: (location: LocationWeighted[]) => void;
    setViews: Dispatch<SetStateAction<NullStringTuple>>;
    setAudience: Dispatch<SetStateAction<NullStringTuple>>;
    setGender: (gender?: string) => void;
    setEngagement: (engagement?: number) => void;
    setLastPost: (lastPost?: string) => void;
    setContactInfo: (contactInfo?: string) => void;
    setAudienceLocation: (location: LocationWeighted[]) => void;
    setAudienceAge: (location: AudienceAgeRangeWeighted) => void;
    setAudienceGender: (location: AudienceGenderWeighted) => void;
    setPlatform: (platform: CreatorPlatform) => void;
    resultsPerPageLimit: number;
    setResultsPerPageLimit: (limit: number) => void;
    usageExceeded: boolean;
    setUsageExceeded: (exceeded: boolean) => void;
    page: number;
    setPage: (page: number) => void;
    setOnlyRecommended: (onlyRecommended: boolean) => void;
    recommendedInfluencers: string[];
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

export const SEARCH_RESULT_FILTER = 'boostbot_search_result_filter';
const searchResultFilterInitial = {
    tags: [],
    text: '',
    keywords: '',
    hashtags: [],
    username: '',
    influencerLocation: [],
    views: [null, null],
    audience: [null, null],
    gender: undefined,
    engagement: undefined,
    lastPost: undefined,
    contactInfo: undefined,
    audienceLocation: defaultAudienceLocations,
    audienceAge: undefined,
    audienceGender: defaultAudienceGender,
    platform: 'youtube',
    onlyRecommended: true,
    activeSearch: false,
} as SearchContextGetter;
export const useLocalStorageSearchResult = () =>
    useLocalStorage<SearchContextGetter>(SEARCH_RESULT_FILTER, searchResultFilterInitial);

export type SearchInfluencerResult = {
    total: number;
    influencers: ClassicSearchInfluencer[];
};

export const useSearchResults = (page: number) => {
    const { profile } = useUser();
    const ref = useRef<any>();

    type SearchResults = {
        results: ClassicSearchInfluencer[];
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
    const [, setSearchResult] = useLocalStorageSearchResult();

    const { data, isLoading, mutate, isValidating, error } = useSWR(
        profile?.id && searchParams ? ['influencer-search', searchParams, page] : null,
        async ([path, searchParams, page]) => {
            try {
                setSearchResult(searchParams as SearchContextGetter);
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

                const res = await nextFetch<SearchInfluencerResult & SearchResultMetadata>(path, {
                    method: 'post',
                    signal,
                    body,
                });

                return { results: res.influencers, resultsTotal: res.total, __metadata: res.__metadata };
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
    const [searchResult] = useLocalStorageSearchResult();

    // search options
    const [tags, setTopicTags] = useState<CreatorSearchTag[]>(searchResult.tags);
    const [text, setText] = useState<string>(searchResult.text);
    const [keywords, setKeywords] = useState<string>(searchResult.keywords);
    const [hashtags, setHashtags] = useState<string[]>(searchResult.hashtags);
    const [username, setUsername] = useState<string>(searchResult.username);
    const [influencerLocation, setInfluencerLocation] = useState<LocationWeighted[]>(searchResult.influencerLocation);
    const [views, setViews] = useState<NullStringTuple>(searchResult.views);
    const [audience, setAudience] = useState<NullStringTuple>(searchResult.audience);
    const [gender, setGender] = useState<string | undefined>(searchResult.gender);
    const [engagement, setEngagement] = useState<number | undefined>(searchResult.engagement);
    const [lastPost, setLastPost] = useState<string | undefined>(searchResult.lastPost);
    const [contactInfo, setContactInfo] = useState<string | undefined>(searchResult.contactInfo);
    const [audienceLocation, setAudienceLocation] = useState<LocationWeighted[]>(searchResult.audienceLocation);
    const [audienceAge, setAudienceAge] = useState<AudienceAgeRangeWeighted | undefined>(searchResult.audienceAge);
    const [audienceGender, setAudienceGender] = useState<AudienceGenderWeighted>(searchResult.audienceGender);
    const [platform, setPlatform] = useState<CreatorPlatform>(searchResult.platform);
    const [onlyRecommended, setOnlyRecommended] = useState(searchResult.onlyRecommended);
    const [activeSearch, setActiveSearch] = useState(searchResult.activeSearch);

    useEffect(() => {
        if (searchResult.tags?.length) setTopicTags(searchResult.tags);
        if (searchResult.text) setText(searchResult.text);
        if (searchResult.keywords) setKeywords(searchResult.keywords);
        if (searchResult.hashtags?.length) setHashtags(searchResult.hashtags);
        if (searchResult.username) setUsername(searchResult.username);
        if (searchResult.influencerLocation?.length) setInfluencerLocation(searchResult.influencerLocation);
        if (searchResult.views) setViews(searchResult.views);
        if (searchResult.audience) setAudience(searchResult.audience);
        if (searchResult.gender) setGender(searchResult.gender);
        if (searchResult.engagement) setEngagement(searchResult.engagement);
        if (searchResult.lastPost) setLastPost(searchResult.lastPost);
        if (searchResult.contactInfo) setContactInfo(searchResult.contactInfo);
        if (searchResult.audienceLocation?.length) setAudienceLocation(searchResult.audienceLocation);
        if (searchResult.audienceAge) setAudienceAge(searchResult.audienceAge);
        if (searchResult.audienceGender) setAudienceGender(searchResult.audienceGender);
        if (searchResult.platform) setPlatform(searchResult.platform);
        if (searchResult.onlyRecommended) setOnlyRecommended(searchResult.onlyRecommended);
        if (searchResult.activeSearch) setActiveSearch(searchResult.activeSearch);
    }, [searchResult]);

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
