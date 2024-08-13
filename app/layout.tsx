/* eslint-disable @next/next/no-sync-scripts */
import type { Metadata } from 'next';
import '../styles/globals.css';
import MainLayout from './layouts/main-layout';
import StoreProvider from 'src/store/Providers/StoreProvider';

export const metadata: Metadata = {
    title: 'Boostbot',
    description: 'Boostbot',
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <StoreProvider>
                    <MainLayout>{children}</MainLayout>
                </StoreProvider>
            </body>
        </html>
    );
}
