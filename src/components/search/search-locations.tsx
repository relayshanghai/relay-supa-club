import { useCallback, useRef, useState } from 'react';
import InputWithAutocomplete from 'src/components/input-with-autocomplete';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';
import { debounce } from 'src/utils/debounce';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform, CreatorSearchTag, LocationWeighted } from 'types';

type SearchLocationsProps = {
    onSetLocations: (topics: LocationWeighted[]) => void;
    locations: LocationWeighted[];
    platform: CreatorPlatform;
    path: string;
    placeholder: string;
    filter?: (items: any[]) => any[];
    TagComponent?: React.FC<any>;
};

export const SearchLocations = ({
    onSetLocations,
    locations,
    platform,
    path,
    placeholder,
    filter,
    TagComponent,
}: SearchLocationsProps) => {
    const [suggestions, setSuggestions] = useState<CreatorSearchTag[] | LocationWeighted[]>([]);
    const ref = useRef<any>();
    const inputRef = useRef<any>();

    useOnOutsideClick(inputRef, () => {
        setSuggestions([]);
        setTopicSearch('');
    });

    // Disabling the exhaustive-deps rule because we need to use the debounce function and we already know the required dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setTopicSearch = useCallback(
        debounce(async (term: string) => {
            if (ref.current) ref.current.abort();

            const controller = new AbortController();
            const signal = controller.signal;
            ref.current = controller;

            try {
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
            onSetLocations([...locations, item]);
            setSuggestions([]);
        },
        [locations, onSetLocations],
    );

    const removeTag = useCallback(
        (item: any) => {
            const entry = locations.find((tag) => tag === item);

            if (entry) {
                const clone = locations.slice();
                clone.splice(clone.indexOf(entry), 1);
                onSetLocations(clone);
            }
        },
        [locations, onSetLocations],
    );

    return (
        <InputWithAutocomplete
            TagComponent={TagComponent}
            placeholder={placeholder}
            tags={locations}
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
        />
    );
};
