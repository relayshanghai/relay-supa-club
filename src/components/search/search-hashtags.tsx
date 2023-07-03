import { useState } from 'react';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import type { CreatorPlatform } from 'types';

type SearchTopicsProps = {
    path: string;
    placeholder: string;
    hashtags: string[];
    platform: CreatorPlatform;
    onSetHashtags: (keywords: string[]) => void;
    onChangeTopics: () => void;
};

export const SearchHashtags = ({ hashtags, placeholder, onSetHashtags, onChangeTopics }: SearchTopicsProps) => {
    const { trackEvent } = useRudderstack();

    const [value, setValue] = useState('');

    const tagKeyboardInputHandler = (e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !value) {
            e.preventDefault();
            let lastTag = '';

            if (hashtags.length === 0) return;
            lastTag = hashtags[hashtags.length - 1];

            setValue(lastTag);
            // Remove last tag
            onSetHashtags(hashtags.filter((_, i) => i !== hashtags.length - 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            onSetHashtags([...hashtags, value]);
            setValue('');
        }
    };

    return (
        <div className="flex w-full flex-row items-center rounded-md border border-gray-200 bg-white px-2 text-gray-900 ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm">
            {hashtags.map((hashtag, index) => {
                return (
                    <div
                        key={index}
                        className="flex cursor-pointer justify-center self-center whitespace-nowrap rounded bg-gray-100 px-2 font-medium text-gray-900 hover:bg-gray-200"
                        onClick={() => {
                            onSetHashtags(hashtags.filter((_, i) => i !== index));
                        }}
                    >
                        <p>#{hashtag}</p>
                    </div>
                );
            })}
            <input
                className="w-full appearance-none border border-transparent bg-white px-3 py-2 font-medium text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                placeholder={hashtags.length < 10 ? placeholder : ''}
                disabled={hashtags.length < 10 ? false : true}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChangeTopics();
                }}
                onKeyDown={(e) => {
                    // setHashtags([...hashtags, e.target.value]);
                    tagKeyboardInputHandler(e);
                    trackEvent('Search Filter Modal, change hashtags', {
                        hashtags: hashtags,
                    });
                }}
                value={value}
            />
        </div>
    );
};

export default SearchHashtags;
