'use client';

import { useRef, useState, type FC, type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatQuestion } from 'src/components/icons';
import { LanguageToggleV2 } from 'src/components/v2/language-toggle';
import { SidebarV2 } from 'src/components/v2/sidebar';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
    const { t } = useTranslation();
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const accountMenuRef = useRef(null);
    const accountMenuButtonRef = useRef(null);
    useOnOutsideClick(accountMenuRef, () => setAccountMenuOpen(false), accountMenuButtonRef);
    return (
        <div className="fixed flex h-screen w-screen">
            <SidebarV2
                accountMenuOpen={accountMenuOpen}
                accountMenuButtonRef={accountMenuButtonRef}
                accountMenuRef={accountMenuRef}
                setAccountMenuOpen={setAccountMenuOpen}
                loggedIn={true}
                profileFirstName={'John'}
            />
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
                        <LanguageToggleV2 />
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
