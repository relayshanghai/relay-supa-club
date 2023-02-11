import { InfluencerPostRequest, InfluencerPostResponse } from 'pages/api/influencer-search';
import {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { usageErrors } from 'src/errors/usages';
import { hasCustomError } from 'src/utils/errors';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger';
import {
    CreatorPlatform,
    LocationWeighted,
    CreatorSearchTag,
    CreatorSearchAccountObject,
} from 'types';
import { useUser } from './use-user';

export interface SearchContext {
    loading: boolean;
    tags: CreatorSearchTag[];
    setTopicTags: (tags: CreatorSearchTag[]) => void;
    lookalike: any;
    setLookalike: (lookalike: any) => void;
    influencerLocation: LocationWeighted[];
    setInfluencerLocation: (location: LocationWeighted[]) => void;
    views: string[];
    setViews: Dispatch<SetStateAction<string[]>>;
    audience: string[];
    setAudience: Dispatch<SetStateAction<string[]>>;
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
    resultPages: CreatorSearchAccountObject[][];
    setResultPages: (pages: CreatorSearchAccountObject[][]) => void;
    resultsTotal: number;
    setResultsTotal: (total: number) => void;
    usageExceeded: boolean;
    search: ({ page }: { page?: number | undefined }) => Promise<void>;
    noResults: boolean;
}

const ctx = createContext<SearchContext>({
    loading: false,
    tags: [],
    setTopicTags: () => null,
    lookalike: null,
    setLookalike: () => null,
    influencerLocation: [],
    setInfluencerLocation: () => null,
    views: [],
    setViews: () => null,
    audience: [],
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
    resultPages: [],
    setResultPages: () => null,
    resultsTotal: 0,
    setResultsTotal: () => null,
    usageExceeded: false,
    search: async () => undefined,
    noResults: true,
});

export const useSearch = () => useContext(ctx);

export const SearchProvider = ({ children }: PropsWithChildren) => {
    const { profile } = useUser();
    const [loading, setLoading] = useState(false);

    const [tags, setTopicTags] = useState<CreatorSearchTag[]>([]);
    const [lookalike, setLookalike] = useState<any>();
    const [influencerLocation, setInfluencerLocation] = useState<LocationWeighted[]>([]);
    const [views, setViews] = useState<string[]>([]);
    const [audience, setAudience] = useState<string[]>([]);
    const [gender, setGender] = useState<string>();
    const [engagement, setEngagement] = useState<number>();
    const [lastPost, setLastPost] = useState<string>();
    const [contactInfo, setContactInfo] = useState<string>();
    const [audienceLocation, setAudienceLocation] = useState<LocationWeighted[]>([]);
    const [platform, setPlatform] = useState<CreatorPlatform>('youtube');
    const [resultsPerPageLimit, setResultsPerPageLimit] = useState(10);

    const [resultPages, setResultPages] = useState<CreatorSearchAccountObject[][]>([]);
    const [resultsTotal, setResultsTotal] = useState(0);
    const [usageExceeded, setUsageExceeded] = useState(false);

    const ref = useRef<any>();

    const search = useCallback(
        async ({ page = 0 }: { page?: number }) => {
            setLoading(true);
            if (!profile?.company_id || !profile?.id) return;
            if (ref.current) {
                ref.current.abort();
            }
            const loadMore = page > 0;

            const controller = new AbortController();
            const signal = controller.signal;
            ref.current = controller;

            try {
                const body: InfluencerPostRequest = {
                    tags,
                    platform,
                    lookalike,
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

                    company_id: profile?.company_id,
                    user_id: profile?.id,
                };

                const res = await nextFetch<InfluencerPostResponse>('influencer-search', {
                    method: 'post',
                    signal,
                    body,
                });
                if (loadMore) {
                    setResultPages((prev) => {
                        const newPages = [...prev];
                        newPages[page] = res.accounts;
                        return newPages;
                    });
                } else {
                    setResultsTotal(res.total);
                    setResultPages([res.accounts]);
                }
                setLoading(false);
            } catch (error: any) {
                if (error?.message && error.message.includes('abort')) return;
                clientLogger(error, 'error');
                if (hasCustomError(error, usageErrors)) {
                    setUsageExceeded(true);
                }
            }
        },
        [
            tags,
            influencerLocation,
            audience,
            audienceLocation,
            contactInfo,
            engagement,
            gender,
            lastPost,
            lookalike,
            platform,
            profile?.company_id,
            profile?.id,
            resultsPerPageLimit,
            views,
        ],
    );
    useEffect(() => {
        // because search is a useCallback that depends on all the state variables, this will trigger a re-search when any of the state variables change.
        // when the search filters change, we always want to start fresh from page 0
        search({});
    }, [search]);

    const noResults = resultPages.length === 0 || resultPages[0]?.length === 0;

    return (
        <ctx.Provider
            value={{
                loading,

                resultPages,
                setResultPages,
                resultsTotal,
                setResultsTotal,
                platform,
                setPlatform,
                search,
                tags,
                setTopicTags,
                lookalike,
                setLookalike,
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
                noResults,
            }}
        >
            {children}
        </ctx.Provider>
    );
};
