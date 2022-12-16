import { useState } from 'react';
import { InputWithTags } from 'src/components/input-with-tags';
export interface Props {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemoveTag: (tag: any) => void;
    onAddTag: (tag: any) => void;
    tags: string[];
    suggestions: string[];
    placeholder: string;
    SuggestionComponent?: React.FC<any>;
    TagComponent?: React.FC<any>;
}
export const InputWithAutocomplete = ({
    disabled,
    onChange,
    onRemoveTag,
    onAddTag,
    tags,
    suggestions,
    placeholder,
    SuggestionComponent,
    TagComponent
}: Props) => {
    const [value, setValue] = useState('');
    return (
        <div className="flex flex-col w-full">
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
                TagComponent={TagComponent}
            />
            <div className="relative">
                {suggestions.length ? (
                    <div className="absolute z-10 top-1 ring-1 ring-gray-200 left-0 w-full shadow-lg bg-white rounded-lg overflow-hidden">
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
                                    className="p-2 hover:bg-gray-100"
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
                ) : null}
                {tags.length ? (
                    <div className="text-xs text-gray-500 my-2">
                        Tip: To remove a tag click on it
                    </div>
                ) : null}
            </div>
        </div>
    );
};
