import { useTranslation } from 'react-i18next';
import { defaultAudienceGender, defaultAudienceLocations, useSearch } from 'src/hooks/use-search';
import { numberFormatter } from 'src/utils/formatter';
import { Modal } from '../modal';
import { SearchLocations } from './search-locations';
import LocationTag from './location-tag';
import { useEffect, useCallback, useMemo } from 'react';
import { Switch } from '../library';
import { Button } from '../button';
import { useSearchTrackers } from '../rudder/searchui-rudder-calls';
import { randomNumber } from 'src/utils/utils';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { OpenFiltersModal } from 'src/utils/analytics/events/discover/open-filters-modal';
import type { EnterFilterPayload } from 'src/utils/analytics/events/discover/enter-filter';
import { EnterFilter } from 'src/utils/analytics/events/discover/enter-filter';
import { ClearFilters } from 'src/utils/analytics/events/discover/clear-filters';
import { getJourney } from 'src/utils/analytics/journey';
import { clientLogger } from 'src/utils/logger-client';

/** Search Filter Modal, Subscribers and Avg view filter options: 1k, 5k, 10k, 15k, 25k, 50k, 100k, 250k, 500k, 1m */
const options = [1e3, 5e3, 1e4, 15e3, 25e3, 50e3, 1e5, 25e4, 50e4, 1e6];
const locationForInstagramAudience = ['macau', 'hongkong', 'hong kong'];

const filterLocation = (items: any[], platform: 'youtube' | 'instagram' | 'tiktok') => {
    return items
        .filter((item: any) => {
            return item.type?.[0] === 'country';
        })
        .filter((item: any) => {
            // filter only if the location is in the list of locations that are not allowed for instagram audience
            const regex = new RegExp(`\\b(?:${locationForInstagramAudience.join('|')})\\b`, 'i');
            if ((regex.test(item.title) || regex.test(item.name)) && platform !== 'instagram') {
                return false;
            }
            return true;
        });
};

export type UpperAgeOption = '17' | '24' | '34' | '44' | '64';

export type LowerAgeOption = '18' | '25' | '35' | '45' | '65';

const lowerAgeOptions: LowerAgeOption[] = ['18', '25', '35', '45', '65'];
const upperAgeOptions: UpperAgeOption[] = ['17', '24', '34', '44', '64'];

const getUpperAge = (targetValue: string, maxOption: string): UpperAgeOption | undefined => {
    if (targetValue === maxOption) {
        return undefined;
    } else {
        return targetValue as UpperAgeOption;
    }
};

const getLowerAge = (targetValue: string, minOption: string): LowerAgeOption | undefined => {
    if (targetValue === minOption) {
        return undefined;
    } else {
        return targetValue as LowerAgeOption;
    }
};

type SearchFiltersModalProps = {
    show: boolean;
    setShow: (open: boolean) => void;
    onSearch: (...args: any[]) => any;
    searchType: string | null;
};

export const SearchFiltersModal = ({ show, setShow, onSearch, searchType }: SearchFiltersModalProps) => {
    const {
        audience,
        setAudience,
        views,
        setViews,
        gender,
        setGender,
        audienceGender,
        setAudienceGender,
        audienceAge,
        setAudienceAge,
        engagement,
        setEngagement,
        lastPost,
        setLastPost,
        contactInfo,
        setContactInfo,
        influencerLocation,
        audienceLocation,
        platform,
        setAudienceLocation,
        setActiveSearch,
        setPage,
        setInfluencerLocation,
        getSearchParams,
    } = useSearch();

    // show is used to force a re-calc of the batchId when the modal is opened
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const batchId = useMemo(() => randomNumber(), [show]);
    const { track } = useRudderstackTrack();

    useEffect(() => {
        if (show) {
            track(OpenFiltersModal, { batch_id: batchId });
        }
    }, [batchId, show, track]);

    const trackFilter = useCallback(
        (payload: Omit<EnterFilterPayload, 'batch_id'>) => {
            track(EnterFilter, {
                ...payload,
                batch_id: batchId,
            });
        },
        [batchId, track],
    );

    const { t } = useTranslation();

    const { trackSearch, trackCloseFilterModal } = useSearchTrackers();

    const handleSearch = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setActiveSearch(true);
            setPage(0);

            try {
                const journey = getJourney();

                if (!journey) {
                    clientLogger('Journey is undefined', 'error', true);
                }

                if (searchType && journey) {
                    trackSearch('Search Options', {
                        search_type: searchType,
                        search_id: journey.id,
                    });
                }
            } catch (error) {
                clientLogger(error, 'error', true);
            }

            trackSearch('Search Filters Modal');
            setShow(false);
            onSearch({ searchParams: getSearchParams() });
        },
        [onSearch, setShow, trackSearch, setPage, setActiveSearch, getSearchParams, searchType],
    );

    useEffect(() => {
        if (!audienceAge) return;
        if (!audienceAge.left_number && !audienceAge.right_number) {
            setAudienceAge(undefined);
        }
    }, [audienceAge, setAudienceAge]);

    useEffect(() => {
        if (!audienceGender) {
            setAudienceGender(defaultAudienceGender);
        }
    }, [audienceGender, setAudienceGender]);

    useEffect(() => {
        if (!audienceLocation) {
            setAudienceLocation(defaultAudienceLocations());
        }
    }, [audienceLocation, setAudienceLocation]);

    const clearFilters = (e: any) => {
        e.preventDefault();
        setAudience([null, null]);
        setViews([null, null]);
        setGender(undefined);
        setEngagement(undefined);
        setLastPost(undefined);
        setContactInfo(undefined);
        setAudienceLocation(defaultAudienceLocations());
        setInfluencerLocation([]);
        setAudienceGender(defaultAudienceGender);
        setAudienceAge(undefined);
        track(ClearFilters, { batch_id: batchId });
    };
    const isContactInfoEmail = useCallback(() => (contactInfo == 'email' ? true : false), [contactInfo]);

    const getAudienceGenderCode = useCallback(() => {
        if (!audienceGender?.code) return 'ANY';
        if (audienceGender === defaultAudienceGender) return 'ANY';
        return audienceGender?.code;
    }, [audienceGender]);

    const getAudienceGenderWeight = useCallback(() => audienceGender?.weight || '>5%', [audienceGender]);

    const getAudience = useCallback((i: number) => audience[i] ?? 'any', [audience]);

    const getViews = useCallback((i: number) => views[i] ?? 'any', [views]);
    return (
        <Modal
            maxWidth="max-w-3xl"
            visible={show}
            onClose={() => {
                trackCloseFilterModal();
                setShow(false);
            }}
            title={t('filters.title') || ''}
        >
            <p
                className="absolute right-6 top-6 cursor-pointer border-red-500 bg-transparent font-medium text-red-500 hover:underline"
                onClick={clearFilters}
                data-testid="clear-filters"
            >
                {t('filters.clearButton')}
            </p>
            <div className="space-y-8 p-8">
                <p className="text-2xl font-semibold">{t('filters.audience.title')}</p>
                <div className="flex flex-row flex-wrap justify-between gap-4">
                    <div className="w-full">
                        <div className="mb-1 text-base font-medium">{t('filters.location.label')}</div>
                        <SearchLocations
                            path="influencer-search/locations"
                            placeholder={t('filters.location.placeholder')}
                            locations={audienceLocation}
                            platform={platform}
                            filter={(item) => filterLocation(item, platform)}
                            onSetLocations={(topics) => {
                                setAudienceLocation(topics.map((item) => ({ ...item, weight: 5 })));
                                trackFilter({
                                    filter_type: 'Audience',
                                    filter_name: 'Location',
                                    values: topics.map((country) => country.name).toString(),
                                });
                            }}
                            TagComponent={LocationTag}
                        />
                    </div>

                    <div>
                        <div className="mb-1 text-base font-medium">{t('filters.audience.ageLabel')}</div>
                        <div className="flex gap-4">
                            <select
                                data-testid="filter-lowerage"
                                className="rounded-md border-gray-200 bg-white text-sm font-medium text-gray-400 ring-1 ring-gray-200"
                                value={audienceAge?.left_number || (t('filters.minOption') as string)}
                                onChange={(e) => {
                                    const lowerAge = getLowerAge(e.target.value, t('filters.minOption') + ' (18)');
                                    setAudienceAge({
                                        ...audienceAge,
                                        left_number: lowerAge,
                                        weight: audienceAge?.weight || 0.05,
                                    });
                                    trackFilter({
                                        filter_type: 'Audience',
                                        filter_name: 'Age - Lower',
                                        values: lowerAge?.toString() || '',
                                    });
                                }}
                            >
                                {lowerAgeOptions.map((lowerAge, index) => {
                                    return (
                                        <option
                                            key={index}
                                            hidden={parseInt(audienceAge?.right_number || '100') < parseInt(lowerAge)}
                                            value={lowerAge}
                                        >
                                            {lowerAge}
                                        </option>
                                    );
                                })}
                            </select>
                            <select
                                data-testid="filter-upperage"
                                className="rounded-md border-gray-200 bg-white text-sm font-medium text-gray-400 ring-1 ring-gray-200"
                                value={audienceAge?.right_number || (t('filters.maxOption') as string)}
                                onChange={(e) => {
                                    const upperAge = getUpperAge(e.target.value, t('filters.maxOption'));

                                    setAudienceAge({
                                        ...audienceAge,
                                        right_number: upperAge,
                                        weight: audienceAge?.weight || 0.05,
                                    });
                                    trackFilter({
                                        filter_type: 'Audience',
                                        filter_name: 'Age - Upper',
                                        values: upperAge?.toString() || '',
                                    });
                                }}
                            >
                                {upperAgeOptions.map((upperAge, index) => {
                                    return (
                                        <option
                                            key={index}
                                            hidden={parseInt(audienceAge?.left_number || '0') > parseInt(upperAge)}
                                            value={upperAge}
                                        >
                                            {upperAge}
                                        </option>
                                    );
                                })}
                                <option value={undefined}>{t('filters.maxOption')}</option>
                            </select>
                            <select
                                data-testid="filter-age-percent"
                                className={`rounded-md transition-all ${
                                    audienceAge ? 'bg-white' : 'bg-slate-300'
                                } border-gray-200 text-sm font-medium text-gray-400 ring-1 ring-gray-200`}
                                disabled={audienceAge ? false : true}
                                value={audienceAge?.weight || '>5%'}
                                onChange={(e) => {
                                    if (!audienceAge) return;
                                    const weight = parseFloat(e.target.value);
                                    setAudienceAge({
                                        ...audienceAge,
                                        weight: weight,
                                    });
                                    trackFilter({
                                        filter_type: 'Audience',
                                        filter_name: 'Age - Weight',
                                        values: weight?.toString() || '',
                                    });
                                }}
                            >
                                {Array.from({ length: 10 }, (_, i) => (i + 1) * 5).map((value) => (
                                    <option key={value} value={value / 100}>{`>${value}%`}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="mb-1 text-base font-medium">{t('filters.gender.label')}</div>
                        <div className="flex gap-4">
                            <select
                                data-testid="filter-gender"
                                className={`rounded-md border-gray-200 bg-white text-sm font-medium text-gray-400 ring-1 ring-gray-200`}
                                style={{ width: getAudienceGenderCode() === 'ANY' ? 210 : undefined }}
                                value={getAudienceGenderCode()}
                                onChange={(e) => {
                                    const gender = e.target.value === 'ANY' ? null : e.target.value;
                                    setAudienceGender(
                                        gender
                                            ? {
                                                  code: gender,
                                                  weight: 0.05,
                                              }
                                            : undefined,
                                    );
                                    trackFilter({
                                        filter_type: 'Audience',
                                        filter_name: 'Gender',
                                        values: gender || '',
                                    });
                                }}
                            >
                                <option value="ANY">{t('filters.anyOption')}</option>
                                <option value="MALE">{t('filters.gender.maleOption')}</option>
                                <option value="FEMALE">{t('filters.gender.femaleOption')}</option>
                            </select>
                            {getAudienceGenderCode() !== 'ANY' && (
                                <select
                                    data-testid="filter-gender-percent"
                                    className={`rounded-md transition-all ${
                                        audienceGender ? 'bg-white' : 'bg-slate-300'
                                    } border-gray-200 text-sm font-medium text-gray-400 ring-1 ring-gray-200`}
                                    disabled={audienceGender ? false : true}
                                    value={getAudienceGenderWeight()}
                                    onChange={(e) => {
                                        if (!audienceGender) return;
                                        const weight = parseFloat(e.target.value);
                                        setAudienceGender({
                                            ...audienceGender,
                                            weight: weight,
                                        });
                                        trackFilter({
                                            filter_type: 'Audience',
                                            filter_name: 'Gender - Weight',
                                            values: weight.toString(),
                                        });
                                    }}
                                >
                                    {Array.from({ length: 10 }, (_, i) => (i + 1) * 5).map((value) => (
                                        <option key={value} value={value / 100}>{`>${value}%`}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                </div>
                {/* INFLUENCER SECTION */}
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-semibold">{t('filters.influencers.title')}</p>
                    <Switch
                        data-testid="has-email-toggle"
                        checked={isContactInfoEmail()}
                        onChange={(e) => {
                            setContactInfo(e.target.checked ? 'email' : undefined);

                            trackFilter({
                                filter_type: 'Influencer',
                                filter_name: 'Has Email',
                                values: e.target.checked ? 'true' : 'false',
                            });
                        }}
                        afterLabel={t('filters.influencers.hasEmail') || ''}
                    />
                </div>
                <div className="grid grid-cols-3 grid-rows-2 flex-wrap items-center justify-between gap-4">
                    <div className="w-auto">
                        <div className="mb-1 text-base font-medium">{t('filters.location.label')}</div>
                        <SearchLocations
                            path="influencer-search/locations"
                            placeholder={t('filters.location.placeholder')}
                            locations={influencerLocation}
                            platform={platform}
                            filter={(item) => filterLocation(item, platform)}
                            onSetLocations={(topics) => {
                                setInfluencerLocation(topics);
                                trackFilter({
                                    filter_type: 'Influencer',
                                    filter_name: 'Location',
                                    values: topics.map((country) => country.name).toString(),
                                });
                            }}
                        />
                    </div>
                    <div>
                        <label className="text-sm">
                            <div className="mb-1 text-base font-medium">{t('creators.filter.engagementRate')}</div>
                            <select
                                data-testid="filter-engagement"
                                className="rounded-md border-gray-200 bg-white text-sm font-medium text-gray-400 ring-1 ring-gray-200"
                                value={engagement}
                                onChange={(e) => {
                                    if (e.target.value === 'any' || Number(e.target.value) === 0) {
                                        setEngagement(undefined);
                                    } else {
                                        setEngagement(Number(e.target.value));
                                    }
                                    trackFilter({
                                        filter_type: 'Influencer',
                                        filter_name: 'Engagement Rate',
                                        values: e.target.value,
                                    });
                                }}
                            >
                                {Array.from(Array(10)).map((_, i) => {
                                    const option = i + 1; // >1-10%
                                    return (
                                        <option key={i} value={option}>
                                            {`>` + option + `%`}
                                        </option>
                                    );
                                })}
                            </select>
                        </label>
                    </div>
                    <div>
                        <label className="text-sm">
                            <h4 className="mb-1 text-base font-medium">{t('filters.influencers.subscribersLabel')}</h4>
                            <div className="flex flex-row space-x-4">
                                <div className="flex w-full items-center justify-between">
                                    <select
                                        data-testid="filter-subs-lower"
                                        className="rounded-md border-gray-200 bg-white text-sm font-medium text-gray-400 ring-1 ring-gray-200"
                                        value={getAudience(0)}
                                        onChange={(e) => {
                                            setAudience((audiencePrevious) => [
                                                e.target.value === 'any' ? null : e.target.value,
                                                audiencePrevious[1],
                                            ]);
                                            trackFilter({
                                                filter_type: 'Influencer',
                                                filter_name: 'Subscribers - Lower',
                                                values: e.target.value,
                                            });
                                        }}
                                    >
                                        <option value="any">{'0'}</option>
                                        {options.map((option) => (
                                            <option
                                                value={option}
                                                key={option}
                                                disabled={!!audience[1] && option >= Number(audience[1])}
                                            >
                                                {numberFormatter(option)}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        data-testid="filter-subs-upper"
                                        className="rounded-md border-gray-200 bg-white text-sm font-medium text-gray-400 ring-1 ring-gray-200"
                                        value={getAudience(1)}
                                        onChange={(e) => {
                                            setAudience((audiencePrevious) => [
                                                audiencePrevious[0],
                                                e.target.value === 'any' ? null : e.target.value,
                                            ]);
                                            trackFilter({
                                                filter_type: 'Influencer',
                                                filter_name: 'Subscribers - Upper',
                                                values: e.target.value,
                                            });
                                        }}
                                    >
                                        {options.map((option) => (
                                            <option
                                                value={option}
                                                key={option}
                                                disabled={!!audience[0] && option <= Number(audience[0])}
                                            >
                                                {numberFormatter(option)}
                                            </option>
                                        ))}
                                        <option value="any">{t('filters.maxOption')}</option>
                                    </select>
                                </div>
                            </div>
                        </label>
                    </div>
                    <div>
                        <label className="text-sm">
                            <div className="mb-1 text-base font-medium">{t('filters.gender.label')}</div>
                            <select
                                data-testid="filter-gender-influencer"
                                className="rounded-md border-gray-200 bg-white text-sm font-medium text-gray-400 ring-1 ring-gray-200"
                                value={gender}
                                onChange={(e) => {
                                    if (e.target.value === 'any') {
                                        setGender(undefined);
                                    } else {
                                        setGender(e.target.value);
                                    }
                                    trackFilter({
                                        filter_type: 'Influencer',
                                        filter_name: 'Gender',
                                        values: e.target.value,
                                    });
                                }}
                            >
                                <option value="ANY">{t('filters.anyOption')}</option>

                                <option value="male">{t('filters.gender.maleOption')}</option>
                                <option value="female">{t('filters.gender.femaleOption')}</option>
                            </select>
                        </label>
                    </div>

                    <div>
                        <label className="text-sm">
                            <div className="mb-1 text-base font-medium">{t('filters.influencers.lastPostLabel')}</div>
                            <select
                                data-testid="filter-last-post"
                                className="rounded-md border-gray-200 bg-white text-sm font-medium text-gray-400 ring-1 ring-gray-200"
                                value={lastPost}
                                onChange={(e) => {
                                    if (e.target.value === 'any') {
                                        setLastPost(undefined);
                                    } else {
                                        setLastPost(e.target.value);
                                    }
                                    trackFilter({
                                        filter_type: 'Influencer',
                                        filter_name: 'Last Post',
                                        values: e.target.value,
                                    });
                                }}
                            >
                                <option value={'any'}>{t('filters.anyOption')}</option>
                                <option value={30}>30 {t('filters.days')}</option>
                                <option value={90}>3 {t('filters.months')}</option>
                                <option value={120}>6 {t('filters.months')}</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label className="text-sm">
                            <div className="mb-1 text-base font-medium">{t('creators.filter.averageViews')}</div>
                            <div className="flex flex-row space-x-4">
                                <div className="flex w-full items-center justify-between">
                                    <select
                                        data-testid="filter-lower-views"
                                        className="rounded-md border-gray-200 bg-white text-sm font-medium text-gray-400 ring-1 ring-gray-200"
                                        value={getViews(0)}
                                        onChange={(e) => {
                                            setViews((viewsPrevious) => [
                                                e.target.value === 'any' ? null : e.target.value,
                                                viewsPrevious[1],
                                            ]);
                                            trackFilter({
                                                filter_type: 'Influencer',
                                                filter_name: 'Average Views - Lower',
                                                values: e.target.value,
                                            });
                                        }}
                                    >
                                        <option value="any">{'0'}</option>
                                        {options.map((option) => (
                                            <option
                                                value={option}
                                                key={option}
                                                disabled={!!views[1] && option >= Number(views[1])}
                                            >
                                                {numberFormatter(option)}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        data-testid="filter-upper-views"
                                        className="rounded-md border-gray-200 bg-white text-sm font-medium text-gray-400 ring-1 ring-gray-200"
                                        value={getViews(1)}
                                        onChange={(e) => {
                                            setViews((viewsPrevious) => [
                                                viewsPrevious[0],
                                                e.target.value === 'any' ? null : e.target.value,
                                            ]);
                                            trackFilter({
                                                filter_type: 'Influencer',
                                                filter_name: 'Average Views - Upper',
                                                values: e.target.value,
                                            });
                                        }}
                                    >
                                        {options.map((option) => (
                                            <option
                                                value={option}
                                                key={option}
                                                disabled={!!views[0] && option <= Number(views[0])}
                                            >
                                                {numberFormatter(option)}
                                            </option>
                                        ))}
                                        <option value="any">{t('creators.filter.max')}</option>
                                    </select>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>
                <div className="flex w-full justify-end">
                    <Button data-testid="search-with-filters" onClick={handleSearch}>
                        {t('filters.searchButton')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
