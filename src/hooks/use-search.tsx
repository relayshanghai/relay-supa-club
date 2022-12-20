import { useCallback, useMemo, useRef, useState } from 'react';
import { useSubscription } from 'src/hooks/use-subscription';
import { CreatorPlatform, SearchResultItem } from 'types';
import { useUser } from './use-user';

export const useSearch = () => {
    const { profile } = useUser();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<any>(0);
    const [results, setResults] = useState<any>();
    const [tags, setTopicTags] = useState<any[]>([]);
    const [lookalike, setLookalike] = useState<SearchResultItem>();
    const [KOLLocation, setKOLLocation] = useState<any[]>([]);
    const [views, setViews] = useState<any[]>([]);
    const [audience, setAudience] = useState<any[]>([]);
    const [gender, setGender] = useState<any>();
    const [engagement, setEngagement] = useState<any>();
    const [lastPost, setLastPost] = useState<any>();
    const [contactInfo, setContactInfo] = useState<any>();
    const [audienceLocation, setAudienceLocation] = useState<any[]>([]);
    const [platform, setPlatform] = useState<CreatorPlatform>('youtube');
    const platforms: {
        icon: string;
        label: string;
        id: CreatorPlatform;
    }[] = useMemo(
        () => [
            { icon: '/assets/svg/yt.svg', label: 'YouTube', id: 'youtube' },
            { icon: '/assets/svg/instagram.svg', label: 'Instagram', id: 'instagram' },
            { icon: '/assets/svg/tiktok.svg', label: 'TikTok', id: 'tiktok' }
        ],
        []
    );
    const ref = useRef<any>();

    const search = useCallback(async () => {
        if (profile?.company_id) {
            setLoading(true);

            if (ref.current) {
                ref.current.abort();
            }

            const controller = new AbortController();
            const signal = controller.signal;
            ref.current = controller;

            const res = await (
                await fetch('/api/kol', {
                    method: 'post',
                    signal,
                    body: JSON.stringify({
                        platform: platform,
                        term: search,
                        page: page,
                        tags,
                        company_id: profile?.company_id,
                        lookalike,
                        KOLLocation,
                        audienceLocation,
                        audience,
                        views,
                        gender,
                        engagement,
                        lastPost,
                        contactInfo
                    })
                })
            ).json();

            setResults(res);
            setLoading(false);
        }
    }, [
        tags,
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
