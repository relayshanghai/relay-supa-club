import { forwardRef, useState } from 'react';
import { InputWithTags } from 'src/components/input-with-tags';
import type { CreatorSearchTag, LocationWeighted } from 'types';

function isCreatorSearchTagArray(tags: any[]): tags is CreatorSearchTag[] {
    return tags.length > 0 && typeof tags[0].creatorId !== 'undefined';
}

function isLocationWeightedArray(tags: any[]): tags is LocationWeighted[] {
    return tags.length > 0 && typeof tags[0].locationId !== 'undefined';
}

export interface Props {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemoveTag: (tag: CreatorSearchTag | LocationWeighted) => void;
    onAddTag: (tag: CreatorSearchTag | LocationWeighted) => void;
    tags: CreatorSearchTag[] | LocationWeighted[];
    suggestions: CreatorSearchTag[] | LocationWeighted[];
    placeholder: string;
    SuggestionComponent?: React.FC<any>;
    TagComponent?: React.FC<any>;
    ref: any;
}

const InputWithAutocomplete = forwardRef<HTMLDivElement, Props>(
    (
        {
            disabled,
            onChange,
            onRemoveTag,
            onAddTag,
            tags,
            suggestions,
            placeholder,
            SuggestionComponent,
            TagComponent,
        },
        ref,
    ) => {
        const [value, setValue] = useState('');

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
            <div className="flex w-full flex-col " ref={ref}>
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
                />
                <div className="relative">
                    {!!suggestions.length && (
                        <div className="absolute left-0 top-1 z-10 w-full overflow-hidden rounded-lg bg-white text-sm ring-1 ring-gray-200">
                            {suggestions.map((item, i) => {
                                if (SuggestionComponent) {
                                    return (
                                        <SuggestionComponent
                                            key={i}
                                            onClick={(data: any) => {
                                                onAddTag({ ...item, ...data });
                                                setValue('');
                                            }}
                                            {...item}
                                        />
                                    );
                                }

                                return (
                                    <div
                                        className="cursor-pointer p-2 hover:bg-gray-100"
                                        key={i}
                                        id={`tag-search-result-${
                                            isLocationWeightedArray(tags)
                                                ? (item as LocationWeighted).title
                                                : (item as LocationWeighted).title
                                        }`}
                                        onClick={() => {
                                            onAddTag(item);
                                            setValue('');
                                        }}
                                    >
                                        {(item as LocationWeighted).title || (item as LocationWeighted).title}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    },
);
InputWithAutocomplete.displayName = 'InputWithAutocomplete';
export default InputWithAutocomplete;
