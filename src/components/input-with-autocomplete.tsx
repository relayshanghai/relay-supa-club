import { forwardRef, useState } from 'react';
import { InputWithTags } from 'src/components/input-with-tags';
export interface Props {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemoveTag: (tag: any) => void;
    onAddTag: (tag: any) => void;
    tags: {
        value: string;
    }[];
    suggestions: string[];
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
            if (e.key === 'Enter') {
                if (value === '') return;
                // Add tag and clear input
                onAddTag({ tag: value, value: value });
                setValue('');
            } else if (e.key === 'Backspace' && !value) {
                e.preventDefault();
                // Set input value to last tag
                let lastTag = '';
                if (tags.length === 0) return;
                lastTag = tags[tags.length - 1].value;
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
                        <div className="absolute top-1 left-0 z-10 w-full overflow-hidden rounded-lg bg-white text-sm ring-1 ring-gray-200">
                            {suggestions.map((item: any, i: any) => {
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
                                        onClick={() => {
                                            onAddTag(item);
                                            setValue('');
                                        }}
                                    >
                                        {item.value || item.title}
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
