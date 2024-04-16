import { useEffect, useState } from 'react';
import { useRudderstackTrack } from '../../hooks/use-rudderstack';
import { ChevronDown, LanguageToggleIcon } from '../icons';
import { useTranslation } from 'react-i18next';
import { ChangeLanguage } from '../../utils/analytics/events/change-language';
import { languageCodeToHumanReadable } from '../../utils/utils';
import { setBirdEatsBugLanguage } from '../analytics/bird-eats-bugs';
import { mapLangCode } from '../chatwoot/chatwoot-provider';
import { enUS, zhCN, LOCAL_STORAGE_LANGUAGE_KEY, I18N_LANGUAGE_DETECTOR_KEY } from '../../constants';
import i18n from 'i18n'; // importing this initializes i18n using i19n.init()
import { useCookies } from 'react-cookie';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from 'shadcn/components/ui/dropdown-menu';
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
            const i18nLanguageDetector = localStorage.getItem(I18N_LANGUAGE_DETECTOR_KEY);
            if (storedLanguage !== null) {
                i18n.changeLanguage(storedLanguage);
            } else if (i18nLanguageDetector !== null) {
                i18n.changeLanguage(i18nLanguageDetector);
            } else {
                i18n.changeLanguage(); // triggers the language detector
            }
        }
    }, []);
    const [, setCookie] = useCookies(['language']);

    useEffect(() => {
        i18n.on('languageChanged', (l) => {
            localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, l);
            setBirdEatsBugLanguage(l);
            window.$chatwoot?.setLocale(mapLangCode(l));
            setCookie('language', l);
        });
        return () => i18n.on('languageChanged', () => null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};

export interface Language {
    lang: string;
    label: string;
}

export const Languages = [
    {
        lang: enUS,
        label: 'English',
    },
    {
        lang: zhCN,
        label: '中文',
    },
];

export const LanguageToggle = () => {
    const { track } = useRudderstackTrack();
    const { i18n } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(
        i18n.language === enUS ? Languages[0] : Languages[1],
    );
    const toggleLanguage = (value: Language) => {
        track(ChangeLanguage, {
            current_language: languageCodeToHumanReadable(i18n.language),
            selected_language: languageCodeToHumanReadable(value.lang),
        });
        setSelectedLanguage(value);
        i18n.changeLanguage(value.lang);
    };
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <section className="flex w-32 flex-shrink-0 flex-grow-0 basis-1/5 items-center justify-between gap-3 rounded-lg border px-2 py-1 font-semibold shadow">
                        <LanguageToggleIcon className="h-4 w-4 text-black" />
                        {selectedLanguage.label}
                        <ChevronDown className="h-4 w-4 text-black" />
                    </section>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-sm">
                    {Languages.map((l) => (
                        <DropdownMenuItem
                            key={l.lang}
                            onSelect={() => toggleLanguage(l)}
                            className="focus:text-accent-black cursor-pointer text-sm focus:bg-white"
                        >
                            {l.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
