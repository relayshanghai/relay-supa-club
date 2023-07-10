import { useTranslation } from 'react-i18next';
import { useSearch } from 'src/hooks/use-search';
import { numberFormatter } from 'src/utils/formatter';
import { Modal } from '../modal';
import { SearchLocations } from './search-locations';
import LocationTag from './location-tag';
import { useEffect } from 'react';
import { Switch } from '../library';
import { Button } from '../button';
import { useSearchTrackers } from '../rudder/searchui-rudder-calls';

/** Search Filter Modal, Subscribers and Avg view filter options: 1k, 5k, 10k, 15k, 25k, 50k, 100k, 250k, 500k, 1m */
const options = [1e3, 5e3, 1e4, 15e3, 25e3, 50e3, 1e5, 25e4, 50e4, 1e6];

const filterCountry = (items: any[]) => {
    return items.filter((item: any) => {
        return item.type?.[0] === 'country';
    });
};

export type UpperAgeOption = '17' | '24' | '34' | '44' | '64';

export type LowerAgeOption = '13' | '18' | '25' | '35' | '45' | '65';

const lowerAgeOptions: LowerAgeOption[] = ['18', '25', '35', '45', '65'];
const upperAgeOptions: UpperAgeOption[] = ['17', '24', '34', '44', '64'];

export const SearchFiltersModal = ({ show, setShow }: { show: boolean; setShow: (open: boolean) => void }) => {
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
    } = useSearch();

    const { t } = useTranslation();

    const {
        trackSearch,
        trackCloseFilterModal,
        trackClearFilters,
        trackAudienceLocation,
        trackAudienceAgeFrom,
        trackAudienceAgeTo,
        trackAudienceAgeWeight,
        trackAudienceGender,
        trackAudienceGenderWeight,
        trackInfluencerEngagement,
        trackInfluencerGender,
        trackInfluencerHasEmail,
        trackInfluencerLastPost,
        trackInfluencerLocation,
        trackInfluencerSubscribersFrom,
        trackInfluencerSubscribersTo,
        trackInfluencerViewsFrom,
        trackInfluencerViewsTo,
    } = useSearchTrackers();

    const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setActiveSearch(true);
        setPage(0);
        trackSearch('Search Filters Modal');
        setShow(false);
    };

    useEffect(() => {
        if (!audienceAge) return;
        if (!audienceAge.left_number && !audienceAge.right_number) {
            setAudienceAge(undefined);
        }
    }, [audienceAge, setAudienceAge]);

    const getUpperAge = (targetValue: string, maxOption: string): UpperAgeOption | undefined => {
        if (targetValue === maxOption) {
            return undefined;
        } else {
            return targetValue as UpperAgeOption;
        }
    };

    const getLowerAge = (targetValue: string, maxOption: string): LowerAgeOption | undefined => {
        if (targetValue === maxOption) {
            return undefined;
        } else {
            return targetValue as LowerAgeOption;
        }
    };

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
                onClick={(e: any) => {
                    e.preventDefault();
                    setAudience([null, null]);
                    setViews([null, null]);
                    setGender(undefined);
                    setEngagement(undefined);
                    setLastPost(undefined);
                    setContactInfo(undefined);
                    setAudienceLocation([]);
                    setInfluencerLocation([]);
                    setAudienceGender(undefined);
                    setAudienceAge(undefined);
                    trackClearFilters();
                }}
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
                            filter={filterCountry}
                            onSetLocations={(topics) => {
                                setAudienceLocation(topics.map((item) => ({ ...item, weight: 5 })));
                                trackAudienceLocation({ location: topics });
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
                                    const lowerAge = getLowerAge(e.target.value, t('filters.maxOption'));
                                    setAudienceAge({
                                        ...audienceAge,
                                        left_number: lowerAge,
                                        weight: audienceAge?.weight || 0.05,
                                    });
                                    trackAudienceAgeFrom({ lower: lowerAge, weight: audienceAge?.weight || 0.05 });
                                }}
                            >
                                <option value={undefined}>{t('filters.minOption')} (13)</option>
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
                                    trackAudienceAgeTo({ upper: upperAge, weight: audienceAge?.weight || 0.05 });
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
                                    trackAudienceAgeWeight({ weight: weight });
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
                                className="rounded-md border-gray-200 bg-white text-sm font-medium text-gray-400 ring-1 ring-gray-200"
                                value={audienceGender?.code || 'ANY'}
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
                                    trackAudienceGender(gender ? { code: gender, weight: 0.05 } : undefined);
                                }}
                            >
                                <option value="ANY">{t('filters.anyOption')}</option>
                                <option value="MALE">{t('filters.gender.maleOption')}</option>
                                <option value="FEMALE">{t('filters.gender.femaleOption')}</option>
                            </select>
                            <select
                                data-testid="filter-gender-percent"
                                className={`rounded-md transition-all ${
                                    audienceGender ? 'bg-white' : 'bg-slate-300'
                                } border-gray-200 text-sm font-medium text-gray-400 ring-1 ring-gray-200`}
                                disabled={audienceGender ? false : true}
                                value={audienceGender?.weight || '>5%'}
                                onChange={(e) => {
                                    if (!audienceGender) return;
                                    const weight = parseFloat(e.target.value);
                                    setAudienceGender({
                                        ...audienceGender,
                                        weight: weight,
                                    });
                                    trackAudienceGenderWeight({ weight: weight });
                                }}
                            >
                                {Array.from({ length: 10 }, (_, i) => (i + 1) * 5).map((value) => (
                                    <option key={value} value={value / 100}>{`>${value}%`}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                {/* INFLUENCER SECTION */}
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-semibold">{t('filters.influencers.title')}</p>
                    <Switch
                        data-testid="has-email-toggle"
                        checked={contactInfo == 'email' ? true : false}
                        onChange={(e) => {
                            setContactInfo(e.target.checked ? 'email' : undefined);
                            trackInfluencerHasEmail({ mode: e.target.checked ? 'email' : 'any' });
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
                            filter={filterCountry}
                            onSetLocations={(topics) => {
                                setInfluencerLocation(topics);
                                trackInfluencerLocation({ location: topics });
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
                                    trackInfluencerEngagement({
                                        engagement_rate: `>` + Number(e.target.value) + `%`,
                                    });
                                }}
                            >
                                <option value="any">{t('creators.filter.any')}</option>
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
                                <div className="flex items-center gap-4">
                                    <select
                                        data-testid="filter-subs-lower"
                                        className="rounded-md border-gray-200 bg-white text-sm font-medium text-gray-400 ring-1 ring-gray-200"
                                        value={audience[0] ?? 'any'}
                                        onChange={(e) => {
                                            setAudience((audiencePrevious) => [
                                                e.target.value === 'any' ? null : e.target.value,
                                                audiencePrevious[1],
                                            ]);
                                            trackInfluencerSubscribersFrom({
                                                subscribers: e.target.value,
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
                                        value={audience[1] ?? 'any'}
                                        onChange={(e) => {
                                            setAudience((audiencePrevious) => [
                                                audiencePrevious[0],
                                                e.target.value === 'any' ? null : e.target.value,
                                            ]);
                                            trackInfluencerSubscribersTo({
                                                subscribers: e.target.value,
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
                                    trackInfluencerGender({
                                        code: e.target.value,
                                    });
                                }}
                            >
                                <option value="any">{t('filters.anyOption')}</option>
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
                                    trackInfluencerLastPost({
                                        last_post: e.target.value + ` days`,
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
                                <div className="flex items-center gap-4">
                                    <select
                                        data-testid="filter-lower-views"
                                        className="rounded-md border-gray-200 bg-white text-sm font-medium text-gray-400 ring-1 ring-gray-200"
                                        value={views[0] ?? 'any'}
                                        onChange={(e) => {
                                            setViews((viewsPrevious) => [
                                                e.target.value === 'any' ? null : e.target.value,
                                                viewsPrevious[1],
                                            ]);
                                            trackInfluencerViewsFrom({
                                                views: e.target.value,
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
                                        value={views[1] ?? 'any'}
                                        onChange={(e) => {
                                            setViews((viewsPrevious) => [
                                                viewsPrevious[0],
                                                e.target.value === 'any' ? null : e.target.value,
                                            ]);
                                            trackInfluencerViewsTo({
                                                views: e.target.value,
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
