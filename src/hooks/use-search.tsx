import type { InfluencerPostRequest, InfluencerPostResponse } from 'pages/api/influencer-search';
import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import { useCallback } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
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
} from 'types';
import { useUser } from './use-user';
import useSWR from 'swr';
import type { RecommendedInfluencersGetResponse } from 'pages/api/recommended-influencers';
import { featRecommended } from 'src/constants/feature-flags';
import { useCompany } from './use-company';

type NullStringTuple = [null | string, null | string];
import type { FetchCreatorsFilteredParams } from 'src/utils/api/iqdata/transforms';

export interface ISearchContext {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    tags: CreatorSearchTag[] | [];
    setTopicTags: (tags: CreatorSearchTag[]) => void;
    text: string;
    setText: (text: string) => void;
    setTextTags: (text: string) => void;
    keywords: string;
    setKeywords: (keywords: string) => void;
    hashtags: string[];
    setHashtags: (hashtags: string[]) => void;
    username: string;
    setUsername: (username: string) => void;
    influencerLocation: LocationWeighted[] | [];
    setInfluencerLocation: (location: LocationWeighted[]) => void;
    views: NullStringTuple;
    setViews: (param: NullStringTuple) => void;
    audience: NullStringTuple;
    setAudience: (param: NullStringTuple) => void;
    gender?: string;
    setGender: (gender?: string) => void;
    engagement?: number;
    setEngagement: (engagement?: number) => void;
    lastPost?: string;
    setLastPost: (lastPost?: string) => void;
    contactInfo?: string;
    setContactInfo: (contactInfo?: string) => void;
    audienceLocation: LocationWeighted[] | [];
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
    setSearchParams: Dispatch<SetStateAction<FetchCreatorsFilteredParams | undefined>>;
}

export const SearchContext = createContext<ISearchContext | undefined>(undefined);

export const useSearch = () => {
    const context = useContext(SearchContext);

    if (context === undefined) {
        throw new Error('useSearch must be within SearchProvider');
    }

    return context;
};

export const useSearchResults = () => {
    const { profile } = useUser();
    const { company } = useCompany();
    const ref = useRef<any>();

    const { setUsageExceeded, setLoading, setActiveSearch, searchParams } = useSearch();

    const [state, setState] = useState<{
        id: number | null;
        response:
            | {
                  results: InfluencerPostResponse['accounts'];
                  resultsTotal: InfluencerPostResponse['total'];
              }
            | undefined;
        payload: typeof searchParams;
    }>({
        id: 1,
        response: undefined,
        payload: searchParams,
    });

    /**
     * Conditionally provide SWR key
     */
    const getSWRKey = useCallback(() => {
        if (!state.id || !state.payload || !profile) return null;

        return { url: 'influencer-search', payload: { body: state.payload } };
    }, [state.id, state.payload, profile]);

    /**
     * Function for sending search API call
     */
    const search = useCallback(
        (params: any) => {
            if (!profile || !company) return null;

            setState((state) => {
                return { ...state, payload: params, id: Math.random() };
            });
        },
        [setState, profile, company],
    );

    const handleError = (error: any) => {
        if (hasCustomError(error, usageErrors)) {
            setUsageExceeded(true);
        } else if (!error?.message?.includes('abort')) {
            clientLogger(error, 'error');
        }
    };

    const { data, isLoading, mutate, isValidating, error } = useSWR(
        getSWRKey(),
        async ({ url, payload }) => {
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

                const companyId = company?.id || profile.company_id;
                if (!companyId) {
                    throw new Error('No company');
                }

                const body: InfluencerPostRequest = {
                    ...payload.body,
                    company_id: companyId,
                    user_id: profile?.id,
                    // page,
                };

                const res = await nextFetch<InfluencerPostResponse>(url, {
                    method: 'post',
                    signal,
                    body,
                });

                if (!res?.accounts) {
                    throw new Error('no accounts in results');
                }

                const response = { results: res?.accounts, resultsTotal: res?.total };

                if (state.response && state.payload?.page && state.payload.page > 0) {
                    response.results = [...state.response.results, ...response.results];
                }

                return response;
            } catch (error: any) {
                handleError(error);
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

    // Monitor swr response data, only update state if data is not undefined
    useEffect(() => {
        if (data === undefined) return;
        setState((state) => {
            return { ...state, response: data };
        });
    }, [data]);

    useEffect(() => {
        if (error) {
            setLoading(false);
        } else {
            setLoading(isLoading);
        }
    }, [setLoading, isLoading, error]);

    const noResults = !state.response?.results || state.response?.results.length === 0;
    return {
        search,
        response: state.response,
        results: state.response?.results,
        resultsTotal: state.response?.resultsTotal || 0,
        /** this 'loading' only triggers when this page is loading */
        loading: isLoading,
        error: error?.message?.includes('abort') ? undefined : error,
        isValidating,
        noResults,
        mutate,
    };
};

// eslint-disable-next-line complexity
export const SearchProvider = ({ children }: PropsWithChildren) => {
    // this 'loading' triggers when any page is loading
    const [loading, setLoading] = useState(true);
    const [resultsPerPageLimit, setResultsPerPageLimit] = useState(10);
    const [usageExceeded, setUsageExceeded] = useState(false);
    const [searchParams, setSearchParams] = useState<FetchCreatorsFilteredParams | undefined>({
        page: 0,
        platform: 'youtube',
        username: '',
        text: '',
        views: [null, null],
        audience: [null, null],
        // recommendedInfluencers: featRecommended() ? recommendedInfluencers : [],
        // only_recommended: featRecommended() ? onlyRecommended : false,
    });

    const platform = searchParams?.platform ?? 'youtube';
    const setPlatform = useCallback(
        (platform?: CreatorPlatform) => {
            if (!platform) return;

            setSearchParams((state) => {
                return state ? { ...state, platform } : state;
            });
        },
        [setSearchParams],
    );

    const page = searchParams?.page ?? 0;
    const setPage = useCallback(
        (page?: number) => {
            if (page === undefined) return;

            setSearchParams((state) => {
                return state ? { ...state, page } : state;
            });
        },
        [setSearchParams],
    );

    const gender = searchParams?.gender;
    const setGender = useCallback(
        (gender?: string) => {
            if (!gender) return;

            setSearchParams((state) => {
                return state ? { ...state, gender } : state;
            });
        },
        [setSearchParams],
    );

    const influencerLocation = searchParams?.influencerLocation ?? [];
    const setInfluencerLocation = useCallback(
        (influencerLocation?: LocationWeighted[]) => {
            if (!influencerLocation || influencerLocation.length <= 0) return;

            setSearchParams((state) => {
                return state ? { ...state, influencerLocation } : state;
            });
        },
        [setSearchParams],
    );

    const audienceLocation = searchParams?.audienceLocation ?? [];
    const setAudienceLocation = useCallback(
        (audienceLocation?: LocationWeighted[]) => {
            if (!audienceLocation || audienceLocation.length <= 0) return;

            setSearchParams((state) => {
                return state ? { ...state, audienceLocation } : state;
            });
        },
        [setSearchParams],
    );

    const tags = searchParams?.tags ?? [];
    const setTopicTags = useCallback(
        (tags?: CreatorSearchTag[]) => {
            if (!tags || tags.length <= 0) return;

            setSearchParams((state) => {
                return state ? { ...state, tags } : state;
            });
        },
        [setSearchParams],
    );

    const keywords = searchParams?.keywords ?? '';
    const setKeywords = useCallback(
        (keywords?: string) => {
            if (keywords === undefined) return;

            setSearchParams((state) => {
                return state ? { ...state, keywords } : state;
            });
        },
        [setSearchParams],
    );

    const setTextTags = useCallback(
        (text_tags?: string) => {
            // if (!text_tags) return;

            setSearchParams((state) => {
                return state ? { ...state, text_tags } : state;
            });
        },
        [setSearchParams],
    );

    const audience = searchParams?.audience ?? [null, null];
    const setAudience = useCallback(
        (audience?: NullStringTuple) => {
            if (!audience || audience.length <= 0) return;

            setSearchParams((state) => {
                return state ? { ...state, audience } : state;
            });
        },
        [setSearchParams],
    );

    const views = searchParams?.views ?? [null, null];
    const setViews = useCallback(
        (views?: NullStringTuple) => {
            if (!views || views.length <= 0) return;

            setSearchParams((state) => {
                return state ? { ...state, views } : state;
            });
        },
        [setSearchParams],
    );

    const audienceGender = searchParams?.audienceGender;
    const setAudienceGender = useCallback(
        (audienceGender?: AudienceGenderWeighted) => {
            if (!audienceGender) return;

            setSearchParams((state) => {
                return state ? { ...state, audienceGender } : state;
            });
        },
        [setSearchParams],
    );

    const audienceAge = searchParams?.audienceAge;
    const setAudienceAge = useCallback(
        (audienceAge?: AudienceAgeRangeWeighted) => {
            if (!audienceAge) return;

            setSearchParams((state) => {
                return state ? { ...state, audienceAge } : state;
            });
        },
        [setSearchParams],
    );

    const engagement = searchParams?.engagement;
    const setEngagement = useCallback(
        (engagement?: number) => {
            if (!engagement) return;

            setSearchParams((state) => {
                return state ? { ...state, engagement } : state;
            });
        },
        [setSearchParams],
    );

    const lastPost = String(searchParams?.lastPost);
    const setLastPost = useCallback(
        (lastPost?: string) => {
            if (!lastPost || lastPost.length <= 0) return;

            setSearchParams((state) => {
                return state ? { ...state, lastPost } : state;
            });
        },
        [setSearchParams],
    );

    const contactInfo = searchParams?.contactInfo;
    const setContactInfo = useCallback(
        (contactInfo?: string) => {
            if (!contactInfo) return;

            setSearchParams((state) => {
                return state ? { ...state, contactInfo } : state;
            });
        },
        [setSearchParams],
    );

    const hashtags = searchParams?.text_tags ? searchParams.text_tags.split(' ') : [];
    const setHashtags = useCallback(
        (hashtags?: string[]) => {
            // if (!hashtags) return;

            setTextTags(hashtags ? hashtags.join(' ') : '');
        },
        [setTextTags],
    );

    // search options
    const [text, setText] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [onlyRecommended, setOnlyRecommended] = useState(true);
    const [activeSearch, setActiveSearch] = useState(false);

    const { data: recommendedInfluencers } = useSWR(featRecommended() ? 'recommended-influencers' : null, (path) =>
        nextFetch<RecommendedInfluencersGetResponse>(path),
    );

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
                setTextTags,
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
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};
