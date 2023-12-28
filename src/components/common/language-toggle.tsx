import { useEffect, useRef } from 'react';
import type { LegacyRef } from 'react';
import { useRudderstackTrack } from '../../hooks/use-rudderstack';
import { LanguageToggleIcon } from '../icons';
import { useTranslation } from 'react-i18next';
import { ChangeLanguage } from '../../utils/analytics/events/change-language';
import { languageCodeToHumanReadable } from '../../utils/utils';
import { setBirdEatsBugLanguage } from '../analytics/bird-eats-bugs';
import { mapLangCode } from '../chatwoot/chatwoot-provider';
import { enUS, zhCN, LOCAL_STORAGE_LANGUAGE_KEY } from '../../constants';
import i18n from 'i18n'; // importing this initializes i18n using i19n.init()

export const useLocalization = () => {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const setLang = urlParams.get('set_lang');
        // if language is specified in the URL, use that, otherwise use the localStorage stored language
        if (typeof setLang === 'string') {
            if (setLang.includes('en')) {
                i18n.changeLanguage(enUS);
            } else if (setLang.includes('zh')) {
                i18n.changeLanguage(zhCN);
            }
        } else {
            const storedLanguage = localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY);
            if (storedLanguage !== null) {
                i18n.changeLanguage(storedLanguage);
            } else {
                i18n.changeLanguage(); // triggers the language detector
            }
        }
    }, []);

    useEffect(() => {
        i18n.on('languageChanged', (l) => {
            localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, l);
            setBirdEatsBugLanguage(l);
            window.$chatwoot?.setLocale(mapLangCode(l));
        });

        return () => i18n.on('languageChanged', () => null);
    }, []);
};

export const LanguageToggle = () => {
    const { track } = useRudderstackTrack();
    const { i18n } = useTranslation();
    const toggleLanguage = (value: string) => {
        track(ChangeLanguage, {
            current_language: languageCodeToHumanReadable(i18n.language),
            selected_language: languageCodeToHumanReadable(value),
        });
        i18n.changeLanguage(value);
    };

    const languageButtonRef: LegacyRef<HTMLButtonElement> = useRef(null);

    return (
        <div>
            <div className="relative flex flex-col items-center">
                <button
                    ref={languageButtonRef}
                    onClick={() => {
                        if (i18n.language === zhCN) {
                            toggleLanguage(enUS);
                        } else {
                            toggleLanguage(zhCN);
                        }
                    }}
                    data-testid="language-toggle"
                >
                    <LanguageToggleIcon className="h-[20px] w-[22px] stroke-gray-500" />
                </button>
            </div>
        </div>
    );
};
