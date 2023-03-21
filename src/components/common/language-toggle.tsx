import { useRef, useState } from 'react';
import type { LegacyRef } from 'react';
import i18next from 'i18next';
import { Globe } from '../icons';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';

export const LanguageToggle = () => {
    const [displayOptions, setDisplayOptions] = useState(false);

    const toggleLanguage = (value: string) => {
        i18next.changeLanguage(value, () => {
            setDisplayOptions(false);
            localStorage.setItem('language', value);
        });
    };

    const optionsRef: LegacyRef<HTMLDivElement> = useRef(null);
    const languageButtonRef: LegacyRef<HTMLButtonElement> = useRef(null);
    useOnOutsideClick(optionsRef, () => setDisplayOptions(false), languageButtonRef);

    return (
        <div>
            <div className="relative flex flex-col items-center">
                <button
                    id="language-toggle-button"
                    ref={languageButtonRef}
                    data-testid="language-toggle-button"
                    onClick={() => setDisplayOptions(!displayOptions)}
                >
                    <Globe className="h-5 w-5 text-gray-300 duration-300 hover:text-primary-500" />
                </button>
                {displayOptions && (
                    <div
                        ref={optionsRef}
                        className="border-gray absolute z-10 mt-9 mr-20 flex w-28 flex-col overflow-hidden rounded-md border border-opacity-40 bg-white shadow-lg"
                    >
                        <button
                            onClick={() => toggleLanguage('zh')}
                            id="zh"
                            className="px-4 py-2 text-left text-sm hover:bg-gray-100 active:bg-gray-200"
                        >
                            中文
                        </button>
                        <button
                            onClick={() => toggleLanguage('en-US')}
                            id="en-US"
                            className="px-4 py-2 text-left text-sm hover:bg-gray-100 active:bg-gray-200"
                        >
                            English
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
