/* eslint-disable react-hooks/exhaustive-deps */
import { type FC, useEffect, useState } from 'react';
import { ChevronDown, LanguageToggleIcon } from '../icons';
import { useTranslation } from 'react-i18next';
import { enUS } from '../../constants';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from 'shadcn/components/ui/dropdown-menu';
import { Languages } from 'src/hooks/use-localization';

export interface Language {
    lang: string;
    label: string;
}

type LanguageToggleV2Props = {
    language: string;
    setLanguage?: (language: string) => void;
};

export const LanguageToggleV2: FC<LanguageToggleV2Props> = ({ language, setLanguage }) => {
    const { i18n } = useTranslation();

    const [selectedLanguage, setSelectedLanguage] = useState<Language>(
        i18n.language === enUS ? Languages[0] : Languages[1],
    );
    useEffect(() => {
        setSelectedLanguage(language === enUS ? Languages[0] : Languages[1]);
        i18n.changeLanguage(language);
    }, [language]);
    const toggleLanguage = (value: Language) => {
        setSelectedLanguage(value);
        setLanguage?.(value.lang);
        i18n.changeLanguage(value.lang);
    };
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <section className="flex w-32 flex-shrink-0 flex-grow-0 basis-1/5 items-center justify-between gap-3 rounded-lg border px-2 py-1 font-semibold shadow">
                        <LanguageToggleIcon className="h-4 w-4 text-black" />
                        {selectedLanguage.label}
                        <ChevronDown className="h-4 w-4 text-black" />
                    </section>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-sm">
                    {Languages.map((l) => (
                        <DropdownMenuItem
                            key={l.lang}
                            onSelect={() => toggleLanguage(l)}
                            className="focus:text-accent-black cursor-pointer text-sm focus:bg-white"
                        >
                            {l.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
