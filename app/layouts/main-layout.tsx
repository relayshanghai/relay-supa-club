'use client';

import Link from 'next/link';
import { useRef, useState, type FC, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { ChatQuestion } from 'src/components/icons';
import { LanguageToggleV2 } from 'src/components/v2/language-toggle';
import { SidebarV2 } from 'src/components/v2/sidebar';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';

type MainLayoutProps = PropsWithChildren & {
    language?: string;
    setLanguage?: (language: string) => void;
};

const MainLayout: FC<MainLayoutProps> = ({ children, language, setLanguage }) => {
    const { t } = useTranslation();
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const [loggedIn] = useState(true);
    const [profileFirstName] = useState('John');
    const accountMenuRef = useRef(null);
    const accountMenuButtonRef = useRef(null);
    useOnOutsideClick(accountMenuRef, () => setAccountMenuOpen(false), accountMenuButtonRef);
    return (
        <div className="fixed flex h-screen w-screen">
            <SidebarV2 />
            <div className="flex w-full max-w-full flex-col overflow-hidden">
                <nav className="z-30 flex items-center justify-between bg-white shadow-gray-200">
                    <div className="flex items-center">
                        <p className="flex flex-row items-center gap-2 pl-4">Boostbot</p>
                    </div>
                    <div className="flex flex-row items-center space-x-4 px-8 py-4">
                        <button
                            className="mr-6 mt-auto flex items-center gap-1 overflow-visible stroke-gray-400 py-2 font-poppins text-sm text-gray-400 transition hover:stroke-primary-600 hover:text-primary-600"
                            onClick={() => window.$chatwoot?.toggle()}
                        >
                            {t('navbar.support')}
                            <ChatQuestion height={20} width={20} className="my-0.5 ml-1 stroke-inherit" />
                        </button>
                        <LanguageToggleV2 language={language ?? 'en-US'} setLanguage={setLanguage} />

                        {loggedIn && profileFirstName && (
                            <div className="flex flex-row items-center justify-center">
                                <div
                                    data-testid="layout-account-menu"
                                    onClick={() => {
                                        setAccountMenuOpen(!accountMenuOpen);
                                    }}
                                    ref={accountMenuButtonRef}
                                    className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 p-2 text-base text-gray-800 shadow-sm"
                                >
                                    {profileFirstName[0]}
                                    {accountMenuOpen && (
                                        <div
                                            className="border-gray absolute right-[30%] top-[30px] z-[100] flex w-fit origin-top-right flex-col overflow-hidden rounded-md border border-opacity-40 bg-white shadow-lg"
                                            ref={accountMenuRef}
                                        >
                                            <Link
                                                href="/account"
                                                passHref
                                                className="whitespace-nowrap px-4 py-2 text-sm hover:bg-gray-100 active:bg-gray-200"
                                            >
                                                {t('navbar.account')}
                                            </Link>
                                            <Button
                                                className="px-4 py-2 text-sm hover:bg-gray-100 active:bg-gray-200"
                                                variant="neutral"
                                                onClick={() => {
                                                    window.stop(); // cancel any inflight requests
                                                    window.location.href = '/logout';
                                                }}
                                            >
                                                {t('navbar.logout')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
                <div id="layout-wrapper" className="h-full w-full overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
