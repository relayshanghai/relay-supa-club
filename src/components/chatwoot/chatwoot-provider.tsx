import type { PropsWithChildren } from 'react';
import { useEffect, useState, useContext } from 'react';
import React, { createContext } from 'react';
import type { Chatwoot, ChatwootSettings, ChatwootSDKParams } from 'src/utils/chatwoot/types';
import { clientLogger } from 'src/utils/logger-client';

const ChatWootContext = createContext<Chatwoot | null>(null);

export const useChatwoot = () => useContext(ChatWootContext);

type ChatwootProviderProps = PropsWithChildren<ChatwootSettings & ChatwootSDKParams>;

const mapLangCode = (lang: string) => {
    const codes: { [k: string]: string } = {
        'zh-CN': 'zh_CN',
        'en-US': 'en',
    };

    if (lang in codes) {
        return codes[lang];
    }

    return lang;
};

export default function ChatwootProvider({ children, ...chatwootOptions }: ChatwootProviderProps) {
    const { baseUrl, websiteToken, ...settings } = chatwootOptions;

    const [chatwoot, setChatwoot] = useState<Chatwoot | null>(null);

    useEffect(() => {
        if (!chatwoot) return;

        if (settings.locale) {
            chatwoot.setLocale(mapLangCode(settings.locale));
        }
    }, [chatwoot, settings.locale]);

    useEffect(() => {
        if (chatwoot !== null) return;

        (window as WindowChatwoot).chatwootSettings = settings || {};

        const _baseUrl = baseUrl || 'https://app.chatwoot.com';
        const element = document.createElement('script');
        element.src = _baseUrl + '/packs/js/sdk.js';
        element.async = true;
        element.onload = () => {
            if ((window as WindowChatwoot).$chatwoot) return;

            window.addEventListener('chatwoot:ready', function () {
                setChatwoot((window as WindowChatwoot).$chatwoot);
            });

            window.addEventListener('chatwoot:error', function (error) {
                clientLogger(error, 'error', true);
            });

            (window as WindowChatwoot).chatwootSDK.run({
                websiteToken: websiteToken,
                baseUrl: _baseUrl,
            });
        };

        document.body.appendChild(element);

        return () => {
            document.body.removeChild(element);
        };
    }, [chatwoot, baseUrl, websiteToken, settings]);

    return <ChatWootContext.Provider value={chatwoot}>{children}</ChatWootContext.Provider>;
}
