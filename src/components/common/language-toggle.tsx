import { LegacyRef, useRef, useState } from 'react';
import i18next from 'i18next';
import { Globe } from '../icons';
import useOnOutsideClick from 'src/hooks/useOnOutsideClick';

export const LanguageToggle = () => {
    const [displayOptions, setDisplayOptions] = useState(false);

    const toggleLanguage = (value: string) => {
        i18next.changeLanguage(value);
        setDisplayOptions(false);
    };

    const optionsRef: LegacyRef<HTMLDivElement> = useRef(null);
    const languageButtonRef: LegacyRef<HTMLDivElement> = useRef(null);
    useOnOutsideClick(optionsRef, () => setDisplayOptions(false), languageButtonRef);

    return (
        <div>
            <div className="relative flex flex-col items-center">
                <div ref={languageButtonRef} onClick={() => setDisplayOptions(!displayOptions)}>
                    <Globe className="w-5 h-5 text-gray-300 hover:text-primary-500 duration-300" />
                </div>
                {displayOptions && (
                    <div
                        ref={optionsRef}
                        className="flex flex-col overflow-hidden w-28 absolute mt-9 origin-top-right bg-white border border-gray border-opacity-40 rounded-md shadow-lg z-10"
                    >
                        <button
                            onClick={() => toggleLanguage('zh')}
                            id="zh"
                            className="px-4 py-2 text-sm hover:bg-gray-100 active:bg-gray-200 text-left"
                        >
                            中文
                        </button>
                        <button
                            onClick={() => toggleLanguage('en-US')}
                            id="en-US"
                            className="px-4 py-2 text-sm hover:bg-gray-100 active:bg-gray-200 text-left"
                        >
                            English
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
