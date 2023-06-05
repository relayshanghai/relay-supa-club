import type { PropsWithChildren } from 'react';
import { useEffect, useState, useContext } from 'react';
import React, { createContext } from 'react';

export type ChatwootSDKParams = { websiteToken: string; baseUrl?: string };

export type ChatwootSettings = {
    hideMessageBubble?: boolean;
    position?: 'left' | 'right';
    locale?: string;
    useBrowserLanguage?: boolean;
    type?: 'standard' | 'expanded_bubble';
    darkMode?: 'light' | 'auto';
    launcherTitle?: string;
    showPopoutButton?: boolean;
};

export type ChatwootConfig = ChatwootSettings & ChatwootSDKParams;

export type Chatwoot = {
    baseUrl: string;
    hasLoaded: boolean;
    hideMessageBubble: boolean;
    isOpen: boolean;
    position: string;
    websiteToken: string;
    locale: string;
    useBrowserLanguage: boolean;
    type: string;
    launcherTitle: string;
    showPopoutButton: boolean;
    widgetStyle: string;
    resetTriggered: boolean;
    darkMode: string;
    toggle: (state?: 'open' | 'close') => void;
    toggleBubbleVisibility: (state?: 'show' | 'hide') => void;
    popoutChatWindow: () => void;
    setUser: (
        id: string,
        additional_params: {
            identifier_hash?: string;
            [key: string]: any;
        },
    ) => void;
    setCustomAttributes: (attributes: { [key: string]: any }) => void;
    deleteCustomAttribute: (attributeKey: string) => void;
    setConversationCustomAttributes: (attributes: { [key: string]: any }) => void;
    deleteConversationCustomAttribute: (attributeKey: string) => void;
    setLabel: (label: string) => void;
    removeLabel: (label: string) => void;
    setLocale: (locale: string) => void;
    setColorScheme: (scheme: string) => void;
    reset: () => void;
};

export type WindowChatwoot = {
    chatwootSettings: ChatwootSettings;
    chatwootSDK: {
        run: (params: ChatwootSDKParams) => void;
    };
    $chatwoot: Chatwoot;
} & typeof window;

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
