import { useCallback, useRef, useState } from 'react';
import InputWithAutocomplete from 'src/components/input-with-autocomplete';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';

export const SearchTopics = ({
    onSetTopics,
    topics,
    platform,
    path,
    placeholder,
    filter,
    SuggestionComponent,
    TagComponent,
}: any) => {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const ref = useRef<any>();
    const inputRef = useRef<any>();
    useOnOutsideClick(inputRef, () => {
        setSuggestions([]);
        setTopicSearch('');
    });

    const setTopicSearch = useCallback(
        async (term: any) => {
            if (ref.current) ref.current.abort();

            const controller = new AbortController();
            const signal = controller.signal;
            ref.current = controller;

            const res = await (
                await fetch(path, {
                    method: 'post',
                    signal: signal,
                    body: JSON.stringify({
                        term,
                        platform,
                    }),
                })
            ).json();
            if (res && (res.success || Array.isArray(res))) {
                const data = res.data || res;
                setSuggestions(filter ? filter(data) : data);
            }
        },
        [platform, path, filter],
    );

    const addTag = useCallback(
        (item: any) => {
            onSetTopics([...topics, item]);
            setSuggestions([]);
        },
        [topics, onSetTopics],
    );

    const removeTag = useCallback(
        (item: any) => {
            const entry = topics.find((tag: any) => tag === item);

            if (entry) {
                const clone = topics.slice();
                clone.splice(clone.indexOf(entry), 1);
                onSetTopics(clone);
            }
        },
        [topics, onSetTopics],
    );

    return (
        <InputWithAutocomplete
            SuggestionComponent={SuggestionComponent}
            TagComponent={TagComponent}
            placeholder={placeholder}
            tags={topics}
            suggestions={suggestions}
            ref={inputRef}
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
