import type { CreatorPlatform } from 'types';
import type { KeyboardEvent } from 'react';
import { useCallback, useState } from 'react';

type SearchTopicsProps = {
    path: string;
    placeholder: string;
    value: string;
    platform: CreatorPlatform;
    onBlur: (value: string | null) => void;
};

const TagInput = (props: { keywords: string[]; onClick?: (v: string) => void }) => {
    const { keywords, onClick } = props;

    const _keywords = useCallback(() => {
        return keywords.filter((v: string) => !!v);
    }, [keywords]);

    const handleClick = useCallback(
        (v: string) => {
            onClick && onClick(v);
        },
        [onClick],
    );

    if (_keywords().length <= 0) return null;

    const tags = _keywords().map((v: string) => {
        return (
            <div
                key={`keyword-${v}`}
                className="flex cursor-pointer justify-center self-center whitespace-nowrap rounded bg-gray-100 px-2 font-medium text-gray-900 hover:bg-gray-200"
                onClick={() => handleClick(v)}
            >
                <p>{v}</p>
                <span className="ml-2 cursor-pointer whitespace-nowrap text-gray-400" id={`remove-keyword-${v}`}>
                    x
                </span>
            </div>
        );
    });

    return <>{tags}</>;
};

export const SearchKeywords = ({ value, placeholder, onBlur }: SearchTopicsProps) => {
    const [keyword, setKeyword] = useState('');

    const handleBlur = useCallback(
        (v: string) => {
            if (v.trim() === '') return;
            setKeyword('');
            onBlur(v);
        },
        [onBlur, setKeyword],
    );

    const clearKeywords = useCallback(() => {
        onBlur(null);
    }, [onBlur]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleBlur(keyword);
                return;
            }

            if (value !== '') {
                e.preventDefault();
            }
        },
        [handleBlur, keyword, value],
    );

    return (
        <>
            <div
                className={`flex w-full flex-row items-center rounded-md border border-gray-200 bg-white ${
                    value && 'px-2'
                } text-gray-900 ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm`}
            >
                <TagInput keywords={[value]} onClick={clearKeywords} />
                <input
                    className="w-full appearance-none rounded border border-transparent bg-white px-3 py-2 font-medium text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                    disabled={value === '' ? false : true}
                    placeholder={value === '' ? placeholder : ''}
                    data-testid="input-keywords"
                    onChange={(e) => setKeyword(e.target.value)}
                    onBlur={(e) => handleBlur(e.target.value)}
                    onKeyDown={handleKeyDown}
                    value={keyword}
                />
            </div>
        </>
    );
};

export default SearchKeywords;
