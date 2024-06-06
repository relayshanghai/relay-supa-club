import type { KeyboardEvent } from 'react';
import type { CreatorPlatform } from 'types';

type SearchTopicsProps = {
    path: string;
    placeholder: string;
    hashtags: string[];
    hashTagInput: string;
    setHashTagInput: (keywords: string) => void;
    platform: CreatorPlatform;
    onSetHashtags: (keywords: string[]) => void;
    onChangeTopics: () => void;
};

export const SearchHashtags = ({
    hashtags,
    placeholder,
    onSetHashtags,
    onChangeTopics,
    hashTagInput,
    setHashTagInput,
}: SearchTopicsProps) => {
    const tagKeyboardInputHandler = (e: KeyboardEvent) => {
        if (e.key === 'Backspace' && !hashTagInput && hashtags?.length > 0) {
            e.preventDefault();
            let lastTag = '';

            if (hashtags?.length === 0) return;
            lastTag = hashtags[hashtags?.length - 1];

            setHashTagInput(lastTag);
            // Remove last tag
            onSetHashtags(hashtags?.filter((_, i) => i !== hashtags?.length - 1));
        } else if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onSetHashtags([...hashtags, hashTagInput]);
            setHashTagInput('');
        }
    };

    return (
        <div
            className={`flex w-full flex-row items-center rounded-md border border-gray-200 bg-white ${
                hashtags?.length > 0 && 'px-2'
            } text-gray-900 ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm`}
        >
            {hashtags?.map((hashtag, index) => {
                return (
                    <div
                        key={index}
                        className="mx-1 flex cursor-pointer justify-center self-center whitespace-nowrap rounded bg-gray-100 px-2 font-medium text-gray-900 hover:bg-gray-200"
                        onClick={() => {
                            onSetHashtags(hashtags?.filter((_, i) => i !== index));
                        }}
                    >
                        <p>#{hashtag}</p>
                        <span
                            className="ml-2 cursor-pointer whitespace-nowrap text-gray-400"
                            id={`remove-hashtag-${hashtag}`}
                        >
                            x
                        </span>
                    </div>
                );
            })}
            <input
                className="w-full appearance-none rounded border border-transparent bg-white px-3 py-2 font-medium text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                placeholder={hashtags?.length < 10 ? placeholder : ''}
                disabled={hashtags?.length < 10 ? false : true}
                onChange={(e) => {
                    setHashTagInput(e.target.value);
                    onChangeTopics();
                }}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    tagKeyboardInputHandler(e);
                }}
                value={hashTagInput}
            />
        </div>
    );
};

export default SearchHashtags;
