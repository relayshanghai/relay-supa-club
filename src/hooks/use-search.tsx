import { useCallback, useMemo, useRef, useState } from 'react';
import { useSubscription } from 'src/hooks/use-subscription';

export const useSearch = () => {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<any>(0);
    const [results, setResults] = useState<any>();
    const [tags, setTopicTags] = useState<any[]>([]);
    const [lookalike, setLookalike] = useState<any[]>([]);
    const [KOLLocation, setKOLLocation] = useState<any[]>([]);
    const [audienceLocation, setAudienceLocation] = useState<any[]>([]);
    const [channel, setChannel] = useState<any>('youtube');
    const channels = useMemo(
        () => [
            { icon: '/assets/svg/yt.svg', label: 'YouTube', id: 'youtube' },
            { icon: '/assets/svg/instagram.svg', label: 'Instagram', id: 'instagram' },
            { icon: '/assets/svg/tiktok.svg', label: 'TikTok', id: 'tiktok' }
        ],
        []
    );
    const ref = useRef<any>();
    const { subscription } = useSubscription();

    const search = useCallback(async () => {
        if (subscription) {
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
                        platform: channel,
                        term: search,
                        page: page,
                        tags,
                        subscription,
                        lookalike,
                        KOLLocation,
                        audienceLocation
                    })
                })
            ).json();

            setResults(res);
            setLoading(false);
        }
    }, [tags, channel, page, subscription, lookalike, KOLLocation, audienceLocation]);

    return {
        loading,
        page,
        setPage,
        results,
        channel,
        channels,
        setChannel,
        search,
        tags,
        setTopicTags,
        lookalike,
        setLookalike,
        KOLLocation,
        setKOLLocation,
        audienceLocation,
        setAudienceLocation
    };
};
