/* eslint-disable @next/next/no-sync-scripts */
import type { Metadata } from 'next';
import 'driver.js/dist/driver.css';
import '../styles/globals.css';
import MainLayout from './layouts/main-layout';
import StoreProvider from 'src/store/Providers/StoreProvider';
import { languageCookie, setLanguageCookie } from 'app/components/language-toggle/language-cookie';

export const metadata: Metadata = {
    title: 'Boostbot',
    description: 'Boostbot',
};
export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const lang = await languageCookie();
    return (
        <html lang="en">
            <body>
                <StoreProvider>
                    <MainLayout language={lang} setLanguage={setLanguageCookie}>
                        {children}
                    </MainLayout>
                </StoreProvider>
            </body>
        </html>
    );
}
