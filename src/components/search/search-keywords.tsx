import { useRudderstack } from 'src/hooks/use-rudderstack';
import type { CreatorPlatform } from 'types';

type SearchTopicsProps = {
    path: string;
    placeholder: string;
    keywords: string;
    keywordInput: string;
    setKeywordInput: (keywords: string) => void;
    platform: CreatorPlatform;
    onSetKeywords: (keywords: string) => void;
    onChangeTopics: () => void;
};

export const SearchKeywords = ({
    keywords,
    keywordInput,
    setKeywordInput,
    placeholder,
    onSetKeywords,
    onChangeTopics,
}: SearchTopicsProps) => {
    const { trackEvent } = useRudderstack();
    return (
        <>
            <div
                className={`flex w-full flex-row items-center rounded-md border border-gray-200 bg-white ${
                    keywords && 'px-2'
                } text-gray-900 ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm`}
            >
                {keywords !== '' && (
                    <div
                        className="flex cursor-pointer justify-center self-center whitespace-nowrap rounded bg-gray-100 px-2 font-medium text-gray-900 hover:bg-gray-200"
                        onClick={() => {
                            onSetKeywords('');
                        }}
                    >
                        <p>{keywords}</p>
                        <span
                            className="ml-2 cursor-pointer whitespace-nowrap text-gray-400"
                            id={`remove-keyword-${keywords}`}
                        >
                            x
                        </span>
                    </div>
                )}
                <input
                    className="w-full appearance-none rounded border border-transparent bg-white px-3 py-2 font-medium text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                    disabled={keywords === '' ? false : true}
                    placeholder={keywords === '' ? placeholder : ''}
                    data-testid="input-keywords"
                    onChange={(e) => {
                        setKeywordInput(e.target.value);
                        onChangeTopics();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            onSetKeywords(keywordInput);
                            trackEvent('Search Filter Modal, change keywords', {
                                keywords: keywordInput,
                            });
                            setKeywordInput('');
                        }
                    }}
                    value={keywordInput}
                />
            </div>
        </>
    );
};

export default SearchKeywords;
