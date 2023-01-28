import { KolPostRequest, KolPostResponse } from 'pages/api/kol';
import { useCallback, useMemo, useRef, useState } from 'react';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger';
import {
    CreatorPlatform,
    LocationWeighted,
    CreatorSearchTag,
    CreatorSearchAccountObject,
} from 'types';
import { useUser } from './use-user';

export const useSearch = () => {
    const { profile } = useUser();
    const [loading, setLoading] = useState(false);

    const [tags, setTopicTags] = useState<CreatorSearchTag[]>([]);
    const [lookalike, setLookalike] = useState<any>();
    const [KOLLocation, setKOLLocation] = useState<LocationWeighted[]>([]);
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

    const platforms: {
        icon: string;
        label: string;
        id: CreatorPlatform;
    }[] = useMemo(
        () => [
            { icon: '/assets/imgs/icons/yt.svg', label: 'YouTube', id: 'youtube' },
            { icon: '/assets/imgs/icons/instagram.svg', label: 'Instagram', id: 'instagram' },
            { icon: '/assets/imgs/icons/tiktok.svg', label: 'TikTok', id: 'tiktok' },
        ],
        [],
    );
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
                const bodyData: KolPostRequest = {
                    platform,
                    lookalike,
                    KOLLocation,
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

                const res = await nextFetch<KolPostResponse>('kol', {
                    method: 'post',
                    signal,
                    body: JSON.stringify(bodyData),
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
            } catch (error) {
                clientLogger(error, 'error');
            } finally {
                setLoading(false);
            }
        },
        [
            KOLLocation,
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

    return {
        loading,

        resultPages,
        setResultPages,
        resultsTotal,
        setResultsTotal,
        platform,
        platforms,
        setPlatform,
        search,
        tags,
        setTopicTags,
        lookalike,
        setLookalike,
        KOLLocation,
        setKOLLocation,
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
    };
};
