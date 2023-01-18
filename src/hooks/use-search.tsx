import { KolPostRequest, KolPostResponse } from 'pages/api/kol';
import { useCallback, useMemo, useRef, useState } from 'react';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger';
import { CreatorSearchResult, CreatorPlatform, LocationWeighted, CreatorSearchTag } from 'types';
import { useUser } from './use-user';

export const useSearch = () => {
    const { profile } = useUser();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [results, setResults] = useState<CreatorSearchResult>();
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

    const platforms: {
        icon: string;
        label: string;
        id: CreatorPlatform;
    }[] = useMemo(
        () => [
            { icon: '/assets/imgs/icons/yt.svg', label: 'YouTube', id: 'youtube' },
            { icon: '/assets/imgs/icons/instagram.svg', label: 'Instagram', id: 'instagram' },
            { icon: '/assets/imgs/icons/tiktok.svg', label: 'TikTok', id: 'tiktok' }
        ],
        []
    );
    const ref = useRef<any>();

    const search = useCallback(async () => {
        setLoading(true);
        if (!profile?.company_id || !profile?.id) {
            throw new Error('No company id or user id found');
        }
        if (ref.current) {
            ref.current.abort();
        }

        const controller = new AbortController();
        const signal = controller.signal;
        ref.current = controller;

        try {
            const bodyData: KolPostRequest = {
                platform,
                lookalike,
                KOLLocation,
                audienceLocation,
                // TODO: add UI option for user to select how many results per page
                // resultsPerPageLimit = 10
                page,
                audience,
                views,
                gender,
                engagement,
                lastPost,
                contactInfo,

                company_id: profile?.company_id,
                user_id: profile?.id
            };

            const res = await nextFetch<KolPostResponse>('kol', {
                method: 'post',
                signal,
                body: JSON.stringify(bodyData)
            });

            setResults(res);
        } catch (error) {
            clientLogger(error, 'error');
        } finally {
            setLoading(false);
        }
    }, [
        platform,
        page,
        profile,
        lookalike,
        KOLLocation,
        audienceLocation,
        audience,
        views,
        gender,
        engagement,
        lastPost,
        contactInfo
    ]);

    return {
        loading,
        page,
        setPage,
        results,
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
        setContactInfo
    };
};
