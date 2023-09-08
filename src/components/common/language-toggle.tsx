import { useRef } from 'react';
import type { LegacyRef } from 'react';
import i18next from 'i18next';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { LANGUAGE_TOGGLE } from 'src/utils/rudderstack/event-names';
import { LanguageToggleIcon } from '../icons';

export const LanguageToggle = () => {
    const toggleLanguage = (value: string) => {
        i18next.changeLanguage(value, () => {
            localStorage.setItem('language', value);
        });
    };

    const languageButtonRef: LegacyRef<HTMLButtonElement> = useRef(null);
    const { trackEvent } = useRudderstack();
    return (
        <div>
            <div className="relative flex flex-col items-center">
                <button
                    ref={languageButtonRef}
                    onClick={() => {
                        if (i18next.language === 'zh-CN') {
                            toggleLanguage('en-US');
                            trackEvent(LANGUAGE_TOGGLE('switch to en-US'));
                        } else {
                            toggleLanguage('zh-CN');
                            trackEvent(LANGUAGE_TOGGLE('switch to zh-CN'));
                        }
                        trackEvent(LANGUAGE_TOGGLE('Clicked'));
                    }}
                    data-testid="language-toggle"
                >
                    <LanguageToggleIcon className="h-[20px] w-[22px] stroke-gray-500" />
                </button>
            </div>
        </div>
    );
};
