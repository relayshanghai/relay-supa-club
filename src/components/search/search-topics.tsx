import { useCallback, useRef, useState } from 'react';
import InputWithAutocomplete from 'src/components/input-with-autocomplete';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';
import { debounce } from 'src/utils/debounce';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import type { CreatorPlatform, CreatorSearchTag } from 'types';
import { Locked } from '../icons';
import { Tooltip } from '../library';
import { useTranslation } from 'react-i18next';

type SearchTopicsProps = {
    path: string;
    placeholder: string;
    topics: CreatorSearchTag[];
    platform: CreatorPlatform;
    onSetTopics: (topics: CreatorSearchTag[]) => void;
    onChangeTopics: () => void;
    disabled: boolean;
    setActiveInput: (activeInput: string) => void;
};

export const SearchTopics = ({
    onSetTopics,
    topics,
    platform,
    path,
    placeholder,
    onChangeTopics,
    disabled,
    setActiveInput,
}: SearchTopicsProps) => {
    const [suggestions, setSuggestions] = useState<CreatorSearchTag[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<any>();
    const { trackEvent } = useRudderstack();
    const { t } = useTranslation();
    const ref = useRef<any>();

    useOnOutsideClick(inputRef, () => {
        setSuggestions([]);
        setTopicSearch('');
    });

    // Disabling the exhaustive-deps rule because we need to use the debounce function and we already know the required dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setTopicSearch = useCallback(
        debounce(async (term: string) => {
            if (ref.current) {
                ref.current.abort();
            }
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
                    setSuggestions(data);
                }
            } catch (error: any) {
                if (typeof error?.message === 'string' && error.message.toLowerCase().includes('abort')) {
                    return;
                }
                clientLogger(error, 'error');
            }
            setLoading(false);
        }, 100),
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

    const handleEnable = () => {
        setActiveInput('topic');
        onChangeTopics();
    };

    return (
        <>
            {disabled ? (
                <Tooltip
                    content={t('tooltips.searchTopics.title')}
                    detail={t('tooltips.searchTopics.description')}
                    highlight={
                        platform === 'youtube'
                            ? t('tooltips.searchTopics.highlight')
                            : t('tooltips.searchHashTags.highlight')
                    }
                    position="bottom-right"
                    className="relative"
                >
                    <div className="group/disabled cursor-pointer p-0.5" onClick={handleEnable}>
                        <div className="rounded-md bg-primary-300 py-5 blur" />
                        <p className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center text-2xl">
                            <Locked className="stroke-slate-100 group-hover/disabled:animate-pulse" />
                        </p>
                    </div>
                </Tooltip>
            ) : (
                <InputWithAutocomplete
                    placeholder={placeholder}
                    tags={topics}
                    suggestions={suggestions}
                    onChange={(item) => {
                        setTopicSearch(item);
                        onChangeTopics();
                    }}
                    onRemoveTag={(item) => {
                        removeTag(item);
                        trackEvent('Search Topics Input, remove a tag', { tag: item });
                    }}
                    onAddTag={(item) => {
                        addTag(item);
                        trackEvent('Search Topics Input, add a tag', { tag: item });
                        trackEvent('Search Options, search topics', { topic: item });
                    }}
                    spinnerLoading={loading}
                />
            )}
        </>
    );
};

export default SearchTopics;
