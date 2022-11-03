import { useCallback, useMemo, useRef, useState } from 'react';
import { useSubscription } from 'src/hooks/use-subscription';

export const useSearch = () => {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState<any>(0);
    const [results, setResults] = useState<any>();
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);
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
                        subscription
                    })
                })
            ).json();

            setResults(res);
            setLoading(false);
        }
    }, [tags, channel, page, subscription]);

    const setTopicSearch = useCallback(
        async (term: any) => {
            setLoading(true);

            if (ref.current) {
                ref.current.abort();
            }

            const controller = new AbortController();
            const signal = controller.signal;
            ref.current = controller;

            const res = await (
                await fetch('/api/kol/topics', {
                    method: 'post',
                    signal: signal,
                    body: JSON.stringify({
                        term,
                        platform: channel
                    })
                })
            ).json();

            if (res && res.success) {
                setSuggestions(res.data);
            }

            setLoading(false);
        },
        [channel]
    );

    const addTag = useCallback((item: any) => {
        setTags((val) => [...val, item]);
        setSuggestions([]);
    }, []);

    const removeTag = useCallback((item: any) => {
        setTags((val) => {
            const entry = val.find((tag: any) => tag.value === item.value);

            if (entry) {
                const clone = val.slice();
                clone.splice(clone.indexOf(entry), 1);
                return clone;
            }

            return val;
        });
    }, []);

    return {
        loading,
        page,
        setPage,
        results,
        channel,
        setChannel,
        setTopicSearch,
        channels,
        suggestions,
        tags,
        addTag,
        removeTag,
        search
    };
};
