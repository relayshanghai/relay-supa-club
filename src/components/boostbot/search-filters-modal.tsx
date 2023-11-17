import { type Dispatch, type SetStateAction, useState, useMemo, useEffect } from 'react';
import { AdjustmentsVerticalIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import type { CreatorPlatform, InfluencerSize } from 'types';
import { influencerSizes } from 'types';
import type { Filters } from 'src/components/boostbot/chat';
import { Modal } from 'src/components/modal';
import { Button } from 'src/components/button';
import { Question, Sparkles } from 'src/components/icons';
import { countries, countriesByFlag } from 'src/utils/api/iqdata/dictionaries/geolocations';
import { InputWithSuggestions } from 'src/components/library/input-with-suggestions';
import { randomNumber } from 'src/utils/utils';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { OpenBoostbotFiltersModal } from 'src/utils/analytics/events/boostbot/open-filters-modal';
import { SetBoostbotFilter } from 'src/utils/analytics/events/boostbot/set-filter';
import { CurrentPageEvent } from 'src/utils/analytics/events/current-pages';
import MicroInfluencer from '../icons/MicroInfluencer';
import NicheInfluencer from '../icons/NicheInfluencer';
import { Tooltip } from '../library/tooltip';

type SearchFiltersModalProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    filters: Filters;
    setFilters: Dispatch<SetStateAction<Filters>>;
};

export const SearchFiltersModal = ({ isOpen, setIsOpen, filters, setFilters }: SearchFiltersModalProps) => {
    const { t } = useTranslation();
    const platforms: CreatorPlatform[] = ['youtube', 'tiktok', 'instagram'];
    const platformIcons: any = {
        youtube: { icon: '/assets/imgs/icons/yt.svg', id: 'youtube' },
        instagram: { icon: '/assets/imgs/icons/instagram.svg', id: 'instagram' },
        tiktok: { icon: '/assets/imgs/icons/tiktok.svg', id: 'tiktok' },
    };
    const [localFilters, setLocalFilters] = useState(filters);
    const [shouldShowGeoInput, setShouldShowGeoInput] = useState(false);

    // isOpen is used to force a re-calc of the batchId when the modal is opened
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const batchId = useMemo(() => randomNumber(), [isOpen]);
    const { track } = useRudderstackTrack();

    useEffect(() => {
        if (isOpen) {
            track(OpenBoostbotFiltersModal, { batch_id: batchId, currentPage: CurrentPageEvent.boostbot });
        }
    }, [batchId, isOpen, track]);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const getCountryName = (id: number) => countries.find((country) => country.id === id)?.name ?? 'Invalid country id';

    const getTranslatedCountryName = (id: number) => {
        const countryCode = countries.find((country) => country.id === id)?.country.code;
        return t(`geolocations.countries.${countryCode}`);
    };

    const getFlagCountry = (id: number) => {
        const countryCode = countries.find((country) => country.id === id)?.country.code;
        const flag = countriesByFlag.filter(function (country) {
            return country.code === countryCode;
        });
        return flag;
    };

    const togglePlatform = (platform: CreatorPlatform) => {
        const isRemove = localFilters.platforms.includes(platform) && localFilters.platforms.length > 1;
        if (isRemove) {
            setLocalFilters((prevFilters) => ({
                ...prevFilters,
                platforms: prevFilters.platforms.filter((p) => p !== platform),
            }));
        } else if (!localFilters.platforms.includes(platform)) {
            setLocalFilters((prevFilters) => ({
                ...prevFilters,
                platforms: [...prevFilters.platforms, platform],
            }));
        } else {
            // This is the case where the user is trying to deselect the last platform left, but we don't allow that as there always has to be at least one platform selected -> skip tracking.
            return;
        }

        track(SetBoostbotFilter, {
            batch_id: batchId,
            currentPage: CurrentPageEvent.boostbot,
            name: 'Platform',
            key: platform,
            value: isRemove ? 'remove' : 'add',
        });
    };

    const toggleInfluencerSize = (influencerSize: InfluencerSize) => {
        const { influencerSizes } = localFilters;
        const isRemove = influencerSizes.includes(influencerSize) && influencerSizes.length > 1;
        const isAdd = !isRemove;

        const addInfluencerSize = (influencerSize: InfluencerSize) => {
            setLocalFilters((prevFilters) => ({
                ...prevFilters,
                influencerSizes: [...prevFilters.influencerSizes, influencerSize],
            }));
        };

        const removeInfluencerSize = (influencerSize: InfluencerSize) => {
            setLocalFilters((prevFilters) => ({
                ...prevFilters,
                influencerSizes: prevFilters.influencerSizes.filter((p) => p !== influencerSize),
            }));
        };

        // These special cases are here to ensure that the user can't select both microinfluencer and megainfluencer at the same time, while leaving out the nicheinfluencer.
        if (isAdd && influencerSize === 'microinfluencer' && influencerSizes.includes('megainfluencer')) {
            addInfluencerSize('microinfluencer');
            addInfluencerSize('nicheinfluencer');
        } else if (isAdd && influencerSize === 'megainfluencer' && influencerSizes.includes('microinfluencer')) {
            addInfluencerSize('megainfluencer');
            addInfluencerSize('nicheinfluencer');
        } else if (
            isRemove &&
            influencerSize === 'nicheinfluencer' &&
            influencerSizes.includes('microinfluencer') &&
            influencerSizes.includes('megainfluencer')
        ) {
            return;
        } else if (isRemove) {
            removeInfluencerSize(influencerSize);
        } else if (!influencerSizes.includes(influencerSize)) {
            addInfluencerSize(influencerSize);
        } else {
            // This is the case where the user is trying to deselect the last influencer size left, but we don't allow that as there always has to be at least one size selected -> skip tracking.
            return;
        }

        track(SetBoostbotFilter, {
            batch_id: batchId,
            currentPage: CurrentPageEvent.boostbot,
            name: 'Influencer size',
            key: influencerSize,
            value: isRemove ? 'remove' : 'add',
        });
    };

    const geoSuggestions = countries
        .map(({ country, id }) => ({
            value: id.toString(),
            label: t(`geolocations.countries.${country.code}`),
        }))
        .filter((country) => !localFilters.audience_geo.find((geo) => geo.id === Number(country.value)));

    const addNewGeo = (geoId: string) => {
        setLocalFilters((prevFilters) => ({
            ...prevFilters,
            audience_geo: [...prevFilters.audience_geo, { id: Number(geoId) }],
        }));
        track(SetBoostbotFilter, {
            batch_id: batchId,
            currentPage: CurrentPageEvent.boostbot,
            name: 'Location',
            key: getCountryName(Number(geoId)),
            value: 'add',
        });
        if (localFilters['audience_geo'].length >= 1) {
            setShouldShowGeoInput(false);
        } else if (localFilters['audience_geo'].length < 1) {
            setShouldShowGeoInput(true);
        }
    };

    const removeGeo = (id: number) => {
        setLocalFilters((prevFilters) => ({
            ...prevFilters,
            audience_geo: prevFilters.audience_geo.filter((geo) => geo.id !== id),
        }));
        track(SetBoostbotFilter, {
            batch_id: batchId,
            currentPage: CurrentPageEvent.boostbot,
            name: 'Location',
            key: getCountryName(id),
            value: 'remove',
        });
        setShouldShowGeoInput(true);
    };

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
        <Modal maxWidth="max-w-3xl" visible={isOpen} onClose={cancelModal} title="">
            <div className="mb-6 flex flex-1 space-x-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100">
                        <AdjustmentsVerticalIcon className="h-6 w-6 fill-none stroke-primary-600 group-disabled:stroke-primary-200" />
                    </div>
                </div>
                {/* TO DO CLose button */}
                <div>
                    <div className="text-lg font-semibold text-tertiary-800"> {t(`boostbot.filters.modalTitle`)}</div>
                    <div className="font-regular text-sm text-tertiary-500">
                        {t(`boostbot.filters.modalTitleSubtitle`)}
                    </div>
                </div>
            </div>

            <div className="flex h-full select-none flex-col items-center justify-center space-y-10 pt-2 text-gray-500">
                <div className="flex w-full space-x-12 ">
                    <div className="flex w-full flex-col justify-center gap-2 space-y-1 md:max-w-[400px]">
                        <div className="text-md mb-3 border-b border-tertiary-200 pb-1 font-medium text-tertiary-600 ">
                            {t(`boostbot.filters.fromPlatform`)}
                        </div>
                        {platforms.map((platform) => {
                            const isSelected = localFilters.platforms.includes(platform);
                            return (
                                <div
                                    key={platform}
                                    className={`bg-white-500 flex flex-1 cursor-pointer flex-row justify-between rounded-xl border border-gray-200 bg-opacity-70 p-4 text-gray-500 shadow-md outline outline-2 transition-all hover:bg-primary-100 ${
                                        isSelected ? 'bg-white outline-primary-600' : 'outline-transparent'
                                    }`}
                                    onClick={() => togglePlatform(platform)}
                                    data-testid={`boostbot-filter-${platform}`}
                                >
                                    <div className="flex h-fit items-start space-x-4 ">
                                        <div className=" flex h-10 w-10 items-center justify-center rounded-lg border border-tertiary-200 bg-white p-2.5">
                                            <img
                                                src={platformIcons[platform].icon}
                                                height={20}
                                                width={20}
                                                alt={platformIcons[platform].label}
                                            />
                                        </div>
                                        <div className="flex flex-col ">
                                            <div className="mb-0.5 pl-2 text-left text-sm font-semibold text-gray-600 sm:text-sm">
                                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                            </div>
                                            <div className="pl-2 text-xs font-normal text-tertiary-400">
                                                {t(`boostbot.filters.platformSub.${platform}`)}
                                            </div>
                                        </div>
                                    </div>
                                    <input type="checkbox" className="checkbox mr-0" checked={isSelected} />
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex w-full flex-col justify-center gap-2 space-y-1 md:max-w-[400px]">
                        <div className="text-md mb-3 border-b border-tertiary-200 pb-1 font-medium text-tertiary-600">
                            {t(`boostbot.filters.influencerSize`)}
                        </div>
                        {influencerSizes.map((influencerSize) => {
                            const isSelected = localFilters.influencerSizes?.includes(influencerSize);
                            return (
                                <div
                                    key={influencerSize}
                                    className={`bg-white-500 flex cursor-pointer flex-row justify-between rounded-xl border border-gray-200 bg-opacity-70 p-4 text-gray-500 shadow-md outline outline-2 transition-all hover:bg-primary-100  ${
                                        isSelected ? 'bg-white outline-primary-600' : 'outline-transparent'
                                    }`}
                                    onClick={() => toggleInfluencerSize(influencerSize)}
                                    data-testid={`boostbot-filter-${influencerSize}`}
                                >
                                    <div className="flex space-x-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100">
                                                {influencerSize === 'microinfluencer' ? (
                                                    <MicroInfluencer className="stroke-2" />
                                                ) : influencerSize === 'nicheinfluencer' ? (
                                                    <NicheInfluencer className="stroke-2" />
                                                ) : (
                                                    <Sparkles className="h-4 w-4 stroke-primary-600 stroke-2" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="mb-0.5 flex gap-x-1 pl-2 text-left text-sm font-semibold text-gray-600 sm:text-sm">
                                                {t(`boostbot.filters.influencerSub.${influencerSize}.title`)}

                                                <Tooltip
                                                    content={t(`tooltips.boostBotFilter${influencerSize}.title`)}
                                                    detail={t(`tooltips.boostBotFilter${influencerSize}.description`)}
                                                    position="bottom-right"
                                                    className="w-fit"
                                                >
                                                    <Question className="h-1/2 w-1/2 stroke-gray-400" />
                                                </Tooltip>
                                            </div>
                                            <div className="pl-2 text-xs font-normal text-tertiary-400">
                                                {t(`boostbot.filters.influencerSub.${influencerSize}.subtitle`)}
                                            </div>
                                        </div>
                                    </div>
                                    <input type="checkbox" className="checkbox mr-0" checked={isSelected} />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex h-full w-full flex-row">
                    <div className="w-auto">
                        <div className="text-md mb-3 flex w-full gap-x-2 border-b border-tertiary-200 pb-1 font-medium text-tertiary-600">
                            {t(`boostbot.filters.audienceLocation`)}
                            <Tooltip
                                content={t('tooltips.boostBotAudienceLocation.title')}
                                detail={t('tooltips.boostBotAudienceLocation.description')}
                                position="bottom-right"
                                className="w-fit"
                            >
                                <Question className="h-1/2 w-1/2 stroke-gray-400" />
                            </Tooltip>
                        </div>

                        <div className="flex w-auto w-full flex-row rounded-md border bg-white px-3.5 py-2.5 text-xs ring-2 ring-gray-200 hover:ring-primary-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
                            <div className="flex flex-row justify-center gap-1">
                                {localFilters['audience_geo'].map((geo) => (
                                    <button
                                        key={geo.id}
                                        data-testid={`boostbot-filter-geo-${geo.id}`}
                                        className="bg-white-50 flex items-center gap-1 rounded-md border border-tertiary-300 px-2 text-tertiary-500 shadow-md transition-all hover:border-primary-300 hover:text-primary-300"
                                        onClick={() => removeGeo(geo.id)}
                                    >
                                        <p>{getFlagCountry(geo.id)[0].emoji}</p>
                                        {getTranslatedCountryName(geo.id)}
                                        <XMarkIcon className="h-3 w-3" />
                                    </button>
                                ))}
                            </div>
                            {shouldShowGeoInput && (
                                <div className="w-full" data-testid="boostbot-geo-container">
                                    <InputWithSuggestions suggestions={geoSuggestions} onSelect={addNewGeo} />
                                </div>
                            )}
                        </div>
                        <p className="font-regular mt-1 text-xs text-tertiary-400">
                            {' '}
                            {t(`boostbot.filters.addUpLocation`)}
                        </p>
                    </div>
                </div>

                <div className="flex w-full flex-row-reverse">
                    <Button
                        data-testid="boostbot-confirm-filters"
                        onClick={confirmModal}
                        className="boostbot-gradient w-2/5 border-0"
                    >
                        {t('boostbot.filters.updateFilters')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
