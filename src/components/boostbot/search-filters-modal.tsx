import type { Dispatch, SetStateAction } from 'react';
import type { CreatorPlatform } from 'types';
import type { Filters } from 'src/components/boostbot/chat';
import { useTranslation } from 'react-i18next';
import { Modal } from 'src/components/modal';
import { Instagram, Tiktok, Youtube } from 'src/components/icons';

type SearchFiltersModalProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    filters: Filters;
    setFilters: Dispatch<SetStateAction<Filters>>;
};

export const SearchFiltersModal = ({ isOpen, setIsOpen, filters, setFilters }: SearchFiltersModalProps) => {
    const { t } = useTranslation();
    const platforms: CreatorPlatform[] = ['youtube', 'tiktok', 'instagram'];

    return (
        <Modal
            maxWidth="max-w-3xl"
            visible={isOpen}
            onClose={() => {
                setIsOpen(false);
            }}
            title={t('boostbot.filters.title') || 'Basic Filters'}
        >
            <div className="flex h-full flex-col items-center justify-center space-y-4 pt-2">
                <p>Show me influencers from</p>
                <div className="flex w-full flex-row justify-center gap-4">
                    {platforms.map((platform) => {
                        const isSelected = filters.platforms.includes(platform);
                        return (
                            <div
                                key={platform}
                                className={`bg-white-500 flex w-full max-w-[100px] flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 p-2 text-gray-500 shadow-md outline outline-1 transition-all hover:bg-violet-50 sm:p-6 ${
                                    isSelected ? 'bg-violet-100 outline-violet-500' : 'outline-transparent'
                                }`}
                                onClick={() => {
                                    if (isSelected) {
                                        setFilters({
                                            ...filters,
                                            platforms: filters.platforms.filter((p) => p !== platform),
                                        });
                                    } else {
                                        setFilters({
                                            ...filters,
                                            platforms: [...filters.platforms, platform],
                                        });
                                    }
                                }}
                            >
                                {platform === 'youtube' ? (
                                    <Youtube className="h-6 w-6 sm:h-10 sm:w-10" />
                                ) : platform === 'tiktok' ? (
                                    <Tiktok className="h-6 w-6 sm:h-10 sm:w-10" />
                                ) : (
                                    <Instagram className="h-6 w-6 sm:h-10 sm:w-10" />
                                )}
                                <div className="select-none text-center text-xs font-medium text-gray-700 sm:text-sm">
                                    {/* make first letter uppercase */}
                                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Modal>
    );
};
