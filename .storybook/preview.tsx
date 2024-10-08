import type { Preview } from '@storybook/react';
import React, { Suspense, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import 'styles/globals.css';

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
};

export const globalTypes = {
    locale: {
        name: 'Locale',
        description: 'Internationalization locale',
        toolbar: {
            icon: 'globe',
            items: [
                { value: 'en-US', title: 'English' },
                { value: 'zh-CN', title: 'Chinese' },
            ],
            showName: true,
        },
    },
};

// Wrap your stories in the I18nextProvider component
const WithI18next = (Story, context) => {
    const { locale } = context.globals;
    useEffect(() => {
        i18n.changeLanguage(locale);
    }, [locale]);

    return (
        // This catches the suspense from components not yet ready (still loading translations)
        // Alternative: set useSuspense to false on i18next.options.react when initializing i18next
        <Suspense fallback={<div>loading translations...</div>}>
            <I18nextProvider i18n={i18n}>
                <Story />
            </I18nextProvider>
        </Suspense>
    );
};

i18n.on('languageChanged', (locale) => {
    const direction = i18n.dir(locale);
    document.dir = direction;
});

// export decorators for storybook to wrap your stories in
export const decorators = [WithI18next];

export default preview;
