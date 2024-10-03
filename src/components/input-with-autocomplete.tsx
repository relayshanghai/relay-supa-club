import { useState } from 'react';
import { InputWithTags } from 'src/components/input-with-tags';
import type { CreatorSearchTag, LocationWeighted } from 'types';
import { Spinner } from './icons';
import { useTranslation } from 'react-i18next';

const isCreatorSearchTagArray = (tags: any[]): tags is CreatorSearchTag[] => {
    return tags.length > 0 && typeof (tags[0] as CreatorSearchTag).tag !== 'undefined';
};

const isLocationWeightedArray = (tags: any[]): tags is LocationWeighted[] => {
    return tags.length > 0 && typeof (tags[0] as LocationWeighted).title !== 'undefined';
};

export interface InputWithAutocompleteProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemoveTag: (tag: CreatorSearchTag | LocationWeighted) => void;
    onAddTag: (tag: CreatorSearchTag | LocationWeighted) => void;
    tags: CreatorSearchTag[] | LocationWeighted[];
    suggestions: CreatorSearchTag[] | LocationWeighted[];
    placeholder: string;
    SuggestionComponent?: React.FC<any>;
    TagComponent?: React.FC<any>;
    spinnerLoading: boolean;
    topicSearch: boolean;
}

const InputWithAutocomplete = ({
    disabled,
    onChange,
    onRemoveTag,
    onAddTag,
    tags,
    suggestions,
    placeholder,
    SuggestionComponent,
    TagComponent,
    spinnerLoading,
    topicSearch,
}: InputWithAutocompleteProps) => {
    const [value, setValue] = useState('');
    const { t } = useTranslation();

    const tagKeyboardInputHandler = (e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !value) {
            e.preventDefault();
            let lastTag = '';

            if (isLocationWeightedArray(tags)) {
                // Set input value to last tag
                if (tags.length === 0) return;
                lastTag = tags[tags.length - 1].title;
            } else if (isCreatorSearchTagArray(tags)) {
                // Set input value to last tag
                if (tags.length === 0) return;
                lastTag = tags[tags.length - 1].value;
            }

            setValue(lastTag);
            // Remove last tag
            onRemoveTag(tags[tags.length - 1]);
        }
    };

    return (
        <div className="flex w-full flex-col">
            <InputWithTags
                disabled={disabled}
                tags={tags}
                onTagRemove={onRemoveTag}
                value={value}
                type="text"
                placeholder={placeholder}
                onChange={(e: any) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                onKeyDown={tagKeyboardInputHandler}
                TagComponent={TagComponent}
                spinnerLoading={spinnerLoading}
                topicSearch={topicSearch}
            />
            <div className="relative">
                {!!value.length && (
                    <div className="absolute left-0 top-1 z-[100] w-full overflow-hidden rounded-lg bg-white text-sm ring-1 ring-gray-200">
                        {!suggestions.length && topicSearch ? (
                            <div className="p-4">
                                {spinnerLoading ? (
                                    <Spinner
                                        data-testid="search-spinner"
                                        className="h-5 w-5 fill-primary-600 text-white"
                                    />
                                ) : (
                                    <>
                                        <p className="font-semibold">{t('creators.show.noTopicResults.title')}</p>
                                        <p className="mt-2">{t('creators.show.noTopicResults.description')}</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            suggestions.map((suggestion: LocationWeighted | CreatorSearchTag, i) => {
                                if (SuggestionComponent) {
                                    return (
                                        <SuggestionComponent
                                            key={
                                                (suggestion as LocationWeighted).id ||
                                                (suggestion as CreatorSearchTag).tag
                                            }
                                            onClick={(data: any) => {
                                                onAddTag({ ...suggestion, ...data });
                                                setValue('');
                                            }}
                                            {...suggestion}
                                        />
                                    );
                                }

                                return (
                                    <div
                                        className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                                        key={i}
                                        id={`tag-search-result-${
                                            (suggestion as LocationWeighted).title ||
                                            (suggestion as CreatorSearchTag).value
                                        }`}
                                        onClick={() => {
                                            onAddTag(suggestion);
                                            setValue('');
                                        }}
                                    >
                                        {(suggestion as LocationWeighted).title ||
                                            (suggestion as CreatorSearchTag).value}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InputWithAutocomplete;
