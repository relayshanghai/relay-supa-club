import { forwardRef, useState } from 'react';
import { InputWithTags } from 'src/components/input-with-tags';
import type { CreatorSearchTag, LocationWeighted } from 'types';
import { isLocationWeighted } from './search/search-topics';
export interface Props {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemoveTag: (tag: any) => void;
    onAddTag: (tag: any) => void;
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
                // Set input value to last tag
                let lastTag = '';
                if (tags.length === 0) return;
                if (isLocationWeighted(tags)) {
                    lastTag = tags[tags.length - 1].title;
                } else {
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

                                if (isLocationWeighted(tags)) {
                                }

                                return (
                                    <div
                                        className="cursor-pointer p-2 hover:bg-gray-100"
                                        key={i}
                                        id={`tag-search-result-${
                                            isLocationWeighted(tags)
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
