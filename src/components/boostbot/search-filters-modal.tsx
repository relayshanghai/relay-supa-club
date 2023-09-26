import { type Dispatch, type SetStateAction, useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import type { CreatorPlatform } from 'types';
import type { Filters } from 'src/components/boostbot/chat';
import { Modal } from 'src/components/modal';
import { Button } from 'src/components/button';
import { Instagram, Tiktok, Youtube } from 'src/components/icons';
import { countries } from 'src/utils/api/iqdata/dictionaries/geolocations';
import { InputWithSuggestions } from 'src/components/library/input-with-suggestions';
import { Tooltip } from 'src/components/library';

type SearchFiltersModalProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    filters: Filters;
    setFilters: Dispatch<SetStateAction<Filters>>;
};

export const SearchFiltersModal = ({ isOpen, setIsOpen, filters, setFilters }: SearchFiltersModalProps) => {
    const { t } = useTranslation();
    const platforms: CreatorPlatform[] = ['youtube', 'tiktok', 'instagram'];
    const [shouldShowGeoInput, setShouldShowGeoInput] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);

    const countryName = (id: number) => {
        const countryCode = countries.find((country) => country.id === id)?.country.code;
        return t(`geolocations.countries.${countryCode}`);
    };

    const removeGeo = (id: number) => {
        setLocalFilters((prevFilters) => ({
            ...prevFilters,
            audience_geo: prevFilters.audience_geo.filter((geo) => geo.id !== id),
        }));
    };

    const togglePlatform = (platform: CreatorPlatform) => {
        if (localFilters.platforms.includes(platform) && localFilters.platforms.length > 1) {
            setLocalFilters((prevFilters) => ({
                ...prevFilters,
                platforms: prevFilters.platforms.filter((p) => p !== platform),
            }));
        } else if (!localFilters.platforms.includes(platform)) {
            setLocalFilters((prevFilters) => ({
                ...prevFilters,
                platforms: [...prevFilters.platforms, platform],
            }));
        }
    };

    const geoSuggestions = countries
        .map(({ country, id }) => ({
            value: id.toString(),
            label: t(`geolocations.countries.${country.code}`),
        }))
        .filter((country) => !localFilters.audience_geo.find((geo) => geo.id === Number(country.value)));

    const addNewGeo = (geoId: string) =>
        setLocalFilters((prevFilters) => ({
            ...prevFilters,
            audience_geo: [...prevFilters.audience_geo, { id: Number(geoId), weight: 0.15 }],
        }));

    const setGeoWeight = ({ id, weight }: { id: number; weight: number }) =>
        setLocalFilters((prevFilters) => ({
            ...prevFilters,
            audience_geo: prevFilters.audience_geo.map((g) => (g.id === id ? { ...g, weight } : g)),
        }));

    const geoPercentageOptions = Array.from(Array(20).keys()).map((i) => ((i + 1) * 5) / 100); // [0.05, 0.1, ..., 0.95, 1]

    const confirmModal = () => {
        setIsOpen(false);
        setShouldShowGeoInput(false);
        setFilters(localFilters);
    };

    const cancelModal = () => {
        setIsOpen(false);
        setShouldShowGeoInput(false);
        setLocalFilters(filters);
    };

    return (
        <Modal
            maxWidth="max-w-3xl"
            visible={isOpen}
            onClose={cancelModal}
            title={t('boostbot.filters.modalTitle') || 'Basic Filters'}
        >
            <div className="mx-auto flex h-full select-none flex-col items-center justify-center space-y-4 pt-2 text-gray-500">
                <p>{t('boostbot.filters.fromPlatform')}</p>

                <div className="flex w-full flex-row justify-center gap-4 md:max-w-[320px]">
                    {platforms.map((platform) => {
                        const isSelected = localFilters.platforms.includes(platform);
                        return (
                            <div
                                key={platform}
                                className={`bg-white-500 flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-opacity-70 p-2 text-gray-500 shadow-md outline outline-1 transition-all hover:bg-primary-100 sm:px-2 sm:py-6 ${
                                    isSelected ? 'bg-primary-200 outline-primary-500' : 'outline-transparent'
                                }`}
                                onClick={() => togglePlatform(platform)}
                            >
                                {platform === 'youtube' ? (
                                    <Youtube className="h-6 w-6 sm:h-10 sm:w-10" />
                                ) : platform === 'tiktok' ? (
                                    <Tiktok className="h-6 w-6 sm:h-10 sm:w-10" />
                                ) : (
                                    <Instagram className="h-6 w-6 sm:h-10 sm:w-10" />
                                )}
                                <div className="text-center text-xs font-medium text-gray-700 sm:text-sm">
                                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <p>{t('boostbot.filters.fromGeos')}*</p>

                <div className="mb-2 flex flex-col items-center justify-center gap-2 md:flex-row">
                    <div className="flex max-w-[450px] flex-wrap justify-center gap-1 ">
                        {localFilters['audience_geo'].map((geo) => (
                            <button
                                key={geo.id}
                                className="flex items-center gap-1 rounded-xl border border-primary-500 bg-primary-50 px-3 text-primary-500 shadow-md transition-all hover:border-primary-300 hover:text-primary-300"
                                onClick={() => removeGeo(geo.id)}
                            >
                                {countryName(geo.id)} <XMarkIcon className="w-3" />
                            </button>
                        ))}
                    </div>

                    <button
                        className="flex items-center gap-1 rounded-xl bg-gray-100 px-3 text-gray-500 transition-all hover:bg-gray-200"
                        onClick={() => setShouldShowGeoInput(true)}
                    >
                        {t('boostbot.filters.addMoreGeos')}
                        <PlusIcon className="w-3" />
                    </button>
                </div>

                {shouldShowGeoInput && (
                    <div className="w-full md:max-w-[320px]">
                        <InputWithSuggestions suggestions={geoSuggestions} onSelect={addNewGeo} />
                    </div>
                )}

                <div className="h-[2px] w-full bg-gray-200 md:max-w-[360px]" />

                <div className="flex flex-col items-center justify-center gap-2">
                    {localFilters.audience_geo.map((geo) => (
                        <div key={geo.id} className="flex w-full flex-row flex-wrap items-center">
                            <p className="mr-2 text-sm text-gray-500">*{t('boostbot.filters.atLeast')}</p>

                            <div className="flex flex-row items-center justify-center gap-2">
                                <select
                                    className="rounded-md border-gray-200 bg-white text-sm font-medium text-gray-400 ring-1 ring-gray-200 hover:ring-gray-300"
                                    value={geo.weight}
                                    onChange={(e) => {
                                        setGeoWeight({ id: geo.id, weight: Number(e.target.value) });
                                    }}
                                >
                                    {geoPercentageOptions.map((percentageOption, index) => (
                                        <option key={index} value={percentageOption}>
                                            {Math.round(percentageOption * 100)}%
                                        </option>
                                    ))}
                                </select>

                                <p className="text-sm text-gray-500">
                                    {t('boostbot.filters.inLocation', { location: countryName(geo.id) })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="h-[2px] w-full bg-gray-200" />

                <div className="flex w-full justify-end gap-4">
                    <Tooltip
                        content="You must select at least one platform to search for influencers."
                        className="w-fit"
                        position="top-left"
                    >
                        <Button disabled variant="secondary">
                            {t('boostbot.filters.advancedFilters')}
                        </Button>
                    </Tooltip>

                    <Button data-testid="boostbot-confirm-filters" onClick={confirmModal}>
                        {t('boostbot.filters.updateFilters')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
