import { useRef } from 'react';
import type { LegacyRef } from 'react';
import i18next from 'i18next';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { LANGUAGE_TOGGLE } from 'src/utils/rudderstack/event-names';

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
                >
                    {i18next.language === 'zh-CN' ? 'EN' : '中文'}
                </button>
            </div>
        </div>
    );
};
