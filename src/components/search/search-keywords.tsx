import { useState } from 'react';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import type { CreatorPlatform } from 'types';

type SearchTopicsProps = {
    path: string;
    placeholder: string;
    keywords: string;
    platform: CreatorPlatform;
    setKeywords: (keywords: string) => void;
};

export const SearchKeywords = ({ setKeywords, keywords, placeholder }: SearchTopicsProps) => {
    const { trackEvent } = useRudderstack();
    const [value, setValue] = useState('');
    return (
        <>
            {keywords !== '' ? (
                <div
                    className="flex w-fit cursor-pointer flex-row items-center rounded-full border-2 border-black bg-white p-1 text-sm"
                    onClick={() => {
                        setKeywords('');
                    }}
                >
                    <p>{keywords}</p>
                </div>
            ) : (
                <div className="flex w-full flex-row items-center rounded-md border border-gray-200 bg-white px-2 text-gray-900 ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm">
                    <input
                        className="w-full appearance-none border border-transparent bg-white px-3 py-2 font-medium text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                        placeholder={placeholder}
                        onChange={(e) => {
                            setValue(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                setKeywords(value);
                                setValue('');
                                trackEvent('Search Filter Modal, change keywords', {
                                    keywords: value,
                                });
                            }
                        }}
                        value={value}
                    />
                </div>
            )}
        </>
    );
};

export default SearchKeywords;
