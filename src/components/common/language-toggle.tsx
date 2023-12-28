import { useEffect, useRef } from 'react';
import type { LegacyRef } from 'react';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { LanguageToggleIcon } from '../icons';
import { useTranslation } from 'react-i18next';
import { ChangeLanguage } from 'src/utils/analytics/events/change-language';
import { languageCodeToHumanReadable } from 'src/utils/utils';
import i18n from 'i18n';
import { setBirdEatsBugLanguage } from '../analytics/bird-eats-bugs';
import { mapLangCode } from '../chatwoot/chatwoot-provider';
import { enUS, zhCN } from 'src/constants';

export const useLocalization = () => {
    const { i18n: _i18n } = useTranslation();

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const setLang = urlParams.get('set_lang');
        if (typeof setLang === 'string') {
            if (setLang.includes('en')) {
                i18n.changeLanguage(enUS);
                localStorage.setItem('language', enUS);
            } else if (setLang.includes('zh')) {
                i18n.changeLanguage(zhCN);
                localStorage.setItem('language', zhCN);
            }
        } else {
            const storedLanguage = localStorage.getItem('language');
            if (storedLanguage !== null) {
                i18n.changeLanguage(storedLanguage);
            } else {
                i18n.changeLanguage(); // triggers the language detector
            }
        }
    }, []);

    useEffect(() => {
        _i18n.on('languageChanged', (l) => {
            localStorage.setItem('language', l);
            setBirdEatsBugLanguage(l);
            window.$chatwoot?.setLocale(mapLangCode(l));
        });

        return () => _i18n.on('languageChanged', () => null);
    }, [_i18n]);
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
