import { useTranslation } from 'react-i18next';
import { ChatQuestion } from '../icons';
import { LanguageToggleV2 } from '../language-toggle';
import { UserButton } from './user-button';
import type { FC } from 'react';

type NavbarType = {
    language?: string;
    setLanguage?: (language: string) => void;
};

export const Default: FC<NavbarType> = ({ language, setLanguage }) => {
    const { t } = useTranslation();
    return (
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
                <UserButton />
            </div>
        </nav>
    );
};
