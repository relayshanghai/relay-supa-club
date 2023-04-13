import type { InfluencerPostRequest, InfluencerPostResponse } from 'pages/api/influencer-search';
import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usageErrors } from 'src/errors/usages';
import { hasCustomError } from 'src/utils/errors';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform, LocationWeighted, CreatorSearchTag } from 'types';
import { useUser } from './use-user';
import useSWR from 'swr';
type NullStringTuple = [null | string, null | string];

export interface ISearchContext {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    tags: CreatorSearchTag[];
    setTopicTags: (tags: CreatorSearchTag[]) => void;
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
}

export const SearchContext = createContext<ISearchContext>({
    /** this 'loading' triggers when any page is loading */
    loading: true,
    setLoading: () => null,
    tags: [],
    setTopicTags: () => null,
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
});

export const useSearch = () => useContext(SearchContext);

export const useSearchResults = (page: number) => {
    const { profile } = useUser();
    const ref = useRef<any>();

    const {
        tags,
        username,
        influencerLocation,
        views,
        audience,
        gender,
        engagement,
        lastPost,
        contactInfo,
        audienceLocation,
        onlyRecommended,
        platform,
        resultsPerPageLimit,
        setUsageExceeded,
        setLoading,
    } = useSearch();

    const { data, isLoading, mutate, isValidating, error } = useSWR(
        profile?.id
            ? [
                  'influencer-search',
                  page,
                  tags,
                  username,
                  influencerLocation,
                  views,
                  audience,
                  gender,
                  engagement,
                  lastPost,
                  contactInfo,
                  audienceLocation,
                  onlyRecommended,
                  platform,
                  resultsPerPageLimit,
              ]
            : null,
        async ([
            path,
            page,
            tags,
            username,
            influencerLocation,
            views,
            audience,
            gender,
            engagement,
            lastPost,
            contactInfo,
            audienceLocation,
            onlyRecommended,
            platform,
            resultsPerPageLimit,
        ]) => {
            try {
                if (!profile?.company_id || !profile?.id) {
                    throw new Error('No profile');
                }
                if (ref.current) {
                    ref.current.abort();
                }

                const controller = new AbortController();
                const signal = controller.signal;
                ref.current = controller;

                const body: InfluencerPostRequest = {
                    tags,
                    platform,
                    username,
                    influencerLocation,
                    audienceLocation,
                    resultsPerPageLimit,
                    page,
                    audience,
                    views,
                    gender,
                    engagement,
                    lastPost,
                    contactInfo,
                    only_recommended: onlyRecommended,
                    company_id: profile?.company_id,
                    user_id: profile?.id,
                };

                const res = await nextFetch<InfluencerPostResponse>(path, {
                    method: 'post',
                    signal,
                    body,
                });
                if (!res?.accounts) {
                    throw new Error('no accounts in results');
                }
                return { results: res?.accounts, resultsTotal: res?.total };
            } catch (error: any) {
                if (hasCustomError(error, usageErrors)) {
                    setUsageExceeded(true);
                } else if (!error?.message?.includes('abort')) {
                    clientLogger(error, 'error');
                }
                throw error;
            } finally {
                setLoading(false);
            }
        },
    );

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
    };
};

export const SearchProvider = ({ children }: PropsWithChildren) => {
    // this 'loading' triggers when any page is loading
    const [loading, setLoading] = useState(true);
    const [resultsPerPageLimit, setResultsPerPageLimit] = useState(10);
    const [usageExceeded, setUsageExceeded] = useState(false);
    const [page, setPage] = useState(0);

    // search options
    const [tags, setTopicTags] = useState<CreatorSearchTag[]>([]);
    const [username, setUsername] = useState<string>('');
    const [influencerLocation, setInfluencerLocation] = useState<LocationWeighted[]>([]);
    const [views, setViews] = useState<NullStringTuple>([null, null]);
    const [audience, setAudience] = useState<NullStringTuple>([null, null]);
    const [gender, setGender] = useState<string>();
    const [engagement, setEngagement] = useState<number>();
    const [lastPost, setLastPost] = useState<string>();
    const [contactInfo, setContactInfo] = useState<string>();
    const [audienceLocation, setAudienceLocation] = useState<LocationWeighted[]>([]);
    const [platform, setPlatform] = useState<CreatorPlatform>('youtube');
    const [onlyRecommended, setOnlyRecommended] = useState(false);

    // reset page to 0 when any other search params are changed
    useEffect(() => {
        setPage(0);
    }, [
        tags,
        username,
        influencerLocation,
        views,
        audience,
        gender,
        engagement,
        lastPost,
        contactInfo,
        audienceLocation,
        platform,
        resultsPerPageLimit,
        onlyRecommended,
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
                username,
                setUsername,
                influencerLocation,
                setInfluencerLocation,
                audienceLocation,
                setAudienceLocation,
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
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};
