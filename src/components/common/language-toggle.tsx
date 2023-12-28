import { useRef } from 'react';
import type { LegacyRef } from 'react';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { LanguageToggleIcon } from '../icons';
import { useTranslation } from 'react-i18next';
import { ChangeLanguage } from 'src/utils/analytics/events/change-language';
import { languageCodeToHumanReadable } from 'src/utils/utils';
import { setBirdEatsBugLanguage } from '../analytics/bird-eats-bugs';

export const LanguageToggle = () => {
    const { track } = useRudderstackTrack();
    const { i18n } = useTranslation();
    const toggleLanguage = (value: string) => {
        track(ChangeLanguage, {
            current_language: languageCodeToHumanReadable(i18n.language),
            selected_language: languageCodeToHumanReadable(value),
        });
        i18n.changeLanguage(value, () => {
            localStorage.setItem('language', value);
        });
        setBirdEatsBugLanguage(value);
    };

    const languageButtonRef: LegacyRef<HTMLButtonElement> = useRef(null);

    return (
        <div>
            <div className="relative flex flex-col items-center">
                <button
                    ref={languageButtonRef}
                    onClick={() => {
                        if (i18n.language === 'zh-CN') {
                            toggleLanguage('en-US');
                        } else {
                            toggleLanguage('zh-CN');
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
