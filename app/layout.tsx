/* eslint-disable @next/next/no-sync-scripts */
import type { Metadata } from 'next';
import '../styles/globals.css';
import MainLayout from './layouts/main-layout';

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
                <MainLayout>{children}</MainLayout>
            </body>
        </html>
    );
}
