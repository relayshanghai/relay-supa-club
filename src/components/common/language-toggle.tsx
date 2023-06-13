import { useRef, useState } from 'react';
import type { LegacyRef } from 'react';
import i18next from 'i18next';
import { Globe } from '../icons';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';
import { useRudderstack } from 'src/hooks/use-rudderstack';

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
    const { trackEvent } = useRudderstack();
    return (
        <div>
            <div className="relative flex flex-col items-center">
                <button
                    ref={languageButtonRef}
                    onClick={() => {
                        setDisplayOptions(!displayOptions);
                        trackEvent('LanguageToggle, Clicked');
                    }}
                    data-testid="language-toggle-button"
                >
                    <Globe className="h-5 w-5 text-gray-300 duration-300 hover:text-primary-500" />
                </button>
                {displayOptions && (
                    <div
                        ref={optionsRef}
                        className="border-gray absolute z-10 mr-20 mt-9 flex w-28 flex-col overflow-hidden rounded-md border border-opacity-40 bg-white shadow-lg"
                    >
                        <button
                            onClick={() => {
                                toggleLanguage('zh-CN');
                                trackEvent('LanguageToggle, switch to zh-CN');
                            }}
                            id="zh-CN"
                            className="px-4 py-2 text-left text-sm hover:bg-gray-100 active:bg-gray-200"
                        >
                            中文
                        </button>
                        <button
                            onClick={() => {
                                toggleLanguage('en-US');
                                trackEvent('LanguageToggle, switch to en-US');
                            }}
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
