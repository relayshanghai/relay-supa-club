import { useCallback, useEffect, useRef, useState } from 'react';
import InputWithAutocomplete from 'src/components/input-with-autocomplete';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';
import { debounce } from 'src/utils/debounce';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform, CreatorSearchTag } from 'types';

type SearchTopicsProps = {
    onSetTopics: (topics: CreatorSearchTag[]) => void;
    topics: CreatorSearchTag[];
    platform: CreatorPlatform;
    path: string;
    placeholder: string;
    filter?: (items: any[]) => any[];
    SuggestionComponent?: React.FC<any>;
    TagComponent?: React.FC<any>;
};

const SearchTopics = ({
    onSetTopics,
    topics,
    platform,
    path,
    placeholder,
    filter,
    SuggestionComponent,
    TagComponent,
}: SearchTopicsProps) => {
    const [suggestions, setSuggestions] = useState<CreatorSearchTag[]>([]);
    const [loading, setLoading] = useState(false);
    const ref = useRef<any>();
    const inputRef = useRef<any>();

    useOnOutsideClick(inputRef, () => {
        setSuggestions([]);
        setTopicSearch('');
    });

    useEffect(() => {
        if (!topics && !suggestions) {
            return;
        }

        if (topics.length > 0 && suggestions.length > 0) {
            setLoading(true);
        } else if (topics.length === 0 && suggestions.length > 0) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [suggestions, topics]);

    // Disabling the exhaustive-deps rule because we need to use the debounce function and we already know the required dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setTopicSearch = useCallback(
        debounce(async (term: string) => {
            if (ref.current) ref.current.abort();

            const controller = new AbortController();
            const signal = controller.signal;
            ref.current = controller;

            try {
                setLoading(true);
                const res = await nextFetch(path, {
                    method: 'post',
                    signal,
                    body: {
                        term,
                        platform,
                    },
                });

                if (res && (res.success || Array.isArray(res))) {
                    const data = res.data || res;
                    setSuggestions(filter ? filter(data) : data);
                }
            } catch (error: any) {
                if (typeof error?.message === 'string' && error.message.toLowerCase().includes('abort')) {
                    return;
                }
                clientLogger(error, 'error');
            }
        }),
        [platform, path, filter],
    );

    const addTag = useCallback(
        (item: any) => {
            onSetTopics([...topics, item]);
            setSuggestions([]);
            setLoading(false);
        },
        [topics, onSetTopics],
    );

    const removeTag = useCallback(
        (item: any) => {
            const entry = topics.find((tag) => tag === item);

            if (entry) {
                const clone = topics.slice();
                clone.splice(clone.indexOf(entry), 1);
                onSetTopics(clone);
            }

            setLoading(false);
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
            onRemoveTag={(item) => {
                removeTag(item);
            }}
            onAddTag={(item) => {
                addTag(item);
            }}
            spinnerLoading={loading}
        />
    );
};

export default SearchTopics;
