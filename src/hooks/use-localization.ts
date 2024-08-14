/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import i18n from 'i18n'; // importing this initializes i18n using i19n.init()
import { useCookies } from 'react-cookie';
import { enUS, LOCAL_STORAGE_LANGUAGE_KEY, zhCN } from 'src/constants';
import { setBirdEatsBugLanguage } from 'src/components/analytics/bird-eats-bugs';
import { mapLangCode } from 'src/components/chatwoot/chatwoot-provider';

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

export const useLocalization = () => {
    const [l, setCookie] = useCookies(['language']);

    useEffect(() => {
        i18n.on('languageChanged', (l) => {
            localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, l);
            setBirdEatsBugLanguage(l);
            window.$chatwoot?.setLocale(mapLangCode(l));
            setCookie('language', l);
        });
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
            i18n.changeLanguage(l.language || enUS);
        }
        return () => i18n.on('languageChanged', () => null);
    }, []);
};
