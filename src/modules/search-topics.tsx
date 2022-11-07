import { useCallback, useEffect, useRef, useState } from 'react';
import { InputWithAutocomplete } from 'src/components/input-with-autocomplete';
import { useSearch } from 'src/hooks/use-search';

export const SearchTopics = ({ onSetTopics, topics, channel, path, placeholder, filter }: any) => {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const ref = useRef<any>();

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
                await fetch(path, {
                    method: 'post',
                    signal: signal,
                    body: JSON.stringify({
                        term,
                        platform: channel
                    })
                })
            ).json();

            if (res && (res.success || Array.isArray(res))) {
                const data = res.data || res;
                setSuggestions(filter ? filter(data) : data);
            }

            setLoading(false);
        },
        [channel, path, filter]
    );

    const addTag = useCallback(
        (item: any) => {
            onSetTopics([...topics, item]);
            setSuggestions([]);
        },
        [topics, onSetTopics]
    );

    const removeTag = useCallback(
        (item: any) => {
            const entry = topics.find((tag: any) => tag.value === item.value);

            if (entry) {
                const clone = topics.slice();
                clone.splice(clone.indexOf(entry), 1);
                onSetTopics(clone);
            }
        },
        [topics, onSetTopics]
    );

    return (
        <InputWithAutocomplete
            placeholder={placeholder}
            tags={topics}
            suggestions={suggestions}
            onChange={(item: any) => {
                setTopicSearch(item);
            }}
            onRemoveTag={(item: any) => {
                removeTag(item);
            }}
            onAddTag={(item: any) => {
                addTag(item);
            }}
        />
    );
};
