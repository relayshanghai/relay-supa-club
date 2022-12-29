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
                        className="absolute top-6 z-50 flex-shrink-0 whitespace-nowrap space-y-1 w-20"
                    >
                        <button
                            onClick={() => setValue('zh')}
                            id="zh"
                            className="btn-with-icon-gray py-1 text-tertiary-500 border-primary-300/50 border opacity-90 text-xs w-full"
                        >
                            中文
                        </button>
                        <button
                            onClick={() => setValue('en-US')}
                            id="en-US"
                            className="btn-with-icon-gray py-1 text-tertiary-500 border-primary-300/50 border opacity-90 mb-0.5 text-xs w-full"
                        >
                            English
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
