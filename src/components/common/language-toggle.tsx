import { LegacyRef, MouseEventHandler, useEffect, useRef, useState } from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { Globe } from '../icons';
import useOnOutsideClick from 'src/hooks/useOnOutsideClick';

export const LanguageToggle = () => {
    const { i18n } = useTranslation();
    const [value, setValue] = useState(i18n.language);
    const [displayOptions, setDisplayOptions] = useState(false);

    const toggleLanguage = (value: string) => {
        i18next.changeLanguage(value).then((t) => {
            t('key'); // -> same as i18next.t
        });
        setDisplayOptions(false);
    };

    const toggleDisplay: MouseEventHandler<HTMLDivElement> = (e) => {
        if (e) e.stopPropagation();
        setDisplayOptions((cv) => !cv);
    };

    const optionsRef: LegacyRef<HTMLDivElement> = useRef(null);
    const languageButtonRef: LegacyRef<HTMLDivElement> = useRef(null);
    useOnOutsideClick(optionsRef, () => setDisplayOptions(false), languageButtonRef);

    useEffect(() => {
        if (value) toggleLanguage(value);
    }, [value]);

    return (
        <div>
            <div className="relative flex flex-col items-center">
                <div ref={languageButtonRef} onClick={toggleDisplay}>
                    <Globe className="w-5 h-5 text-gray-300 hover:text-primary-500 duration-300" />
                </div>
                {displayOptions && (
                    <div
                        ref={optionsRef}
                        className="flex flex-col overflow-hidden w-28 absolute mt-9 origin-top-right bg-white border border-gray border-opacity-40 rounded-md shadow-lg z-10"
                    >
                        <button
                            onClick={() => setValue('zh')}
                            id="zh"
                            className="px-4 py-2 text-sm hover:bg-gray-100 active:bg-gray-200 text-left"
                        >
                            中文
                        </button>
                        <button
                            onClick={() => setValue('en-US')}
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
