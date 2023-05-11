import { useCallback, useRef, useState } from 'react';
import InputWithAutocomplete from 'src/components/input-with-autocomplete';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';
import { debounce } from 'src/utils/debounce';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform, CreatorSearchTag } from 'types';

type SearchTopicsProps = {
    path: string;
    placeholder: string;
    topics: CreatorSearchTag[];
    platform: CreatorPlatform;
    onSetTopics: (topics: CreatorSearchTag[]) => void;
};

export const SearchTopics = ({ onSetTopics, topics, platform, path, placeholder }: SearchTopicsProps) => {
    const [suggestions, setSuggestions] = useState<CreatorSearchTag[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<any>();

    useOnOutsideClick(inputRef, () => {
        setSuggestions([]);
        setTopicSearch('');
    });

    // Disabling the exhaustive-deps rule because we need to use the debounce function and we already know the required dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setTopicSearch = useCallback(
        debounce(async (term: string) => {
            const abortController = new AbortController();
            const signal = abortController.signal;

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
                    setSuggestions(data);
                }
            } catch (error: any) {
                if (typeof error?.message === 'string' && error.message.toLowerCase().includes('abort')) {
                    return;
                }
                clientLogger(error, 'error');
            }
            setLoading(false);

            // Abort fetch request after 5 seconds
            setTimeout(() => {
                abortController.abort();
            }, 5000);
        }),
        [platform, path],
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
            placeholder={placeholder}
            tags={topics}
            suggestions={suggestions}
            onChange={(item) => {
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
