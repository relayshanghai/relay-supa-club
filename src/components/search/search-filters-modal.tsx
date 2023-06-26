import { useTranslation } from 'react-i18next';
import { useSearch } from 'src/hooks/use-search';
import { numberFormatter } from 'src/utils/formatter';
import { Modal } from '../modal';
import { useRudderstack } from 'src/hooks/use-rudderstack';
import { SearchLocations } from './search-locations';
import LocationTag from './location-tag';
import { useEffect } from 'react';
import { Switch } from '../library';
import { Button } from '../button';

/** Search Filter Modal, Subscribers and Avg view filter options: 1k, 5k, 10k, 15k, 25k, 50k, 100k, 250k, 500k, 1m */
const options = [1e3, 5e3, 1e4, 15e3, 25e3, 50e3, 1e5, 25e4, 50e4, 1e6];

const filterCountry = (items: any[]) => {
    return items.filter((item: any) => {
        return item.type?.[0] === 'country';
    });
};

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
        setInfluencerLocation,
    } = useSearch();

    const { t } = useTranslation();
    const { trackEvent } = useRudderstack();

    useEffect(() => {
        if (!audienceAge) return;
        if (!audienceAge.left_number && !audienceAge.right_number) {
            setAudienceAge(undefined);
        }
    }, [audienceAge, setAudienceAge]);

    return (
        <Modal
            maxWidth="max-w-3xl"
            visible={show}
            onClose={() => setShow(false)}
            title={t('creators.filter.title') || ''}
        >
            <div className="space-y-8 p-8">
                <p className="text-2xl font-semibold">Audience Filters</p>
                <div className="flex flex-row flex-wrap justify-between gap-4">
                    <div className="w-full">
                        <div className="mb-1 text-base font-medium">Location</div>
                        <SearchLocations
                            path="influencer-search/locations"
                            placeholder={t('creators.filter.audienceLocation')}
                            locations={audienceLocation}
                            platform={platform}
                            filter={filterCountry}
                            onSetLocations={(topics) => {
                                setAudienceLocation(topics.map((item) => ({ ...item, weight: 5 })));
                                trackEvent('Search Options, search audience location', { location: topics });
                            }}
                            TagComponent={LocationTag}
                        />
                    </div>

                    <div>
                        <div className="mb-1 text-base font-medium">Age</div>
                        <div className="flex gap-2">
                            <select
                                className="rounded-md bg-white px-4 py-2 text-base text-gray-500 ring-1 ring-gray-300"
                                value={audienceAge?.left_number || 'Min'}
                                onChange={(e) => {
                                    // if (!audienceAge) return;
                                    const lowerAge =
                                        e.target.value === 'Min (13)'
                                            ? undefined
                                            : (e.target.value as '18' | '25' | '35' | '45' | '65' | undefined);
                                    setAudienceAge({
                                        ...audienceAge,
                                        left_number: lowerAge,
                                        weight: audienceAge?.weight || 0.05,
                                    });
                                }}
                            >
                                <option value={undefined}>Min (13)</option>
                                <option value={18}>18</option>
                                <option value={25}>25</option>
                                <option value={35}>35</option>
                                <option value={45}>45</option>
                                <option value={65}>65</option>
                            </select>
                            <select
                                className="rounded-md bg-white px-4 py-2 text-base text-gray-500 ring-1 ring-gray-300"
                                value={audienceAge?.right_number || 'Max'}
                                onChange={(e) => {
                                    // if (!audienceAge) return;
                                    const upperAge =
                                        e.target.value === 'Max'
                                            ? undefined
                                            : (e.target.value as '17' | '24' | '34' | '44' | '64' | undefined);
                                    setAudienceAge({
                                        ...audienceAge,
                                        right_number: upperAge,
                                        weight: audienceAge?.weight || 0.05,
                                    });
                                }}
                            >
                                <option value={17}>17</option>
                                <option value={24}>24</option>
                                <option value={34}>34</option>
                                <option value={44}>44</option>
                                <option value={64}>64</option>
                                <option value={undefined}>Max</option>
                            </select>
                            <select
                                className={`rounded-md transition-all ${
                                    audienceAge ? 'bg-white' : 'bg-slate-300'
                                } px-4 py-2 text-gray-500 ring-1 ring-gray-300`}
                                disabled={audienceAge ? false : true}
                                value={audienceAge?.weight || '>5%'}
                                onChange={(e) => {
                                    if (!audienceAge) return;
                                    const weight = parseFloat(e.target.value);
                                    setAudienceAge({
                                        ...audienceAge,
                                        weight: weight,
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
                        <div className="mb-1 text-base font-medium">Gender</div>
                        <div className="flex gap-2">
                            <select
                                className="rounded-md bg-white px-4 py-2 text-base text-gray-500 ring-1 ring-gray-300"
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
                                }}
                            >
                                <option value="ANY">Any</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </select>
                            <select
                                className={`rounded-md transition-all ${
                                    audienceGender ? 'bg-white' : 'bg-slate-300'
                                } px-4 py-2 text-base text-gray-500 ring-1 ring-gray-300`}
                                disabled={audienceGender ? false : true}
                                value={audienceGender?.weight || '>5%'}
                                onChange={(e) => {
                                    if (!audienceGender) return;
                                    const weight = parseFloat(e.target.value);
                                    setAudienceGender({
                                        ...audienceGender,
                                        weight: weight,
                                    });
                                }}
                            >
                                {Array.from({ length: 10 }, (_, i) => (i + 1) * 5).map((value) => (
                                    <option key={value} value={value / 100}>{`>${value}%`}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-2xl font-semibold">Influencer Filters</p>
                    <label className="flex flex-row gap-2 text-sm">
                        <Switch
                            data-testid="has-email-toggle"
                            checked={contactInfo ? true : false}
                            onChange={(e) => {
                                setContactInfo(e.target.checked ? 'email' : undefined);
                            }}
                        />
                        <div className="mb-1 text-base font-medium">Has Email</div>
                    </label>
                </div>
                <div className="flex flex-row flex-wrap items-center justify-between gap-4">
                    <div className="w-auto">
                        <div className="mb-1 text-base font-medium">Location</div>
                        <SearchLocations
                            path="influencer-search/locations"
                            placeholder={t('creators.filter.locationPlaceholder')}
                            locations={influencerLocation}
                            platform={platform}
                            filter={filterCountry}
                            onSetLocations={(topics) => {
                                setInfluencerLocation(topics);
                                trackEvent('Search Options, search influencer location', { location: topics });
                            }}
                        />
                    </div>
                    <div>
                        <label className="text-sm">
                            <div className="mb-1 text-base font-medium">{t('creators.filter.engagementRate')}</div>
                            <select
                                className="rounded-md bg-white px-4 py-2 text-base text-gray-500 ring-1 ring-gray-300"
                                value={engagement}
                                onChange={(e) => {
                                    if (e.target.value === 'any' || Number(e.target.value) === 0) {
                                        setEngagement(undefined);
                                    } else {
                                        setEngagement(Number(e.target.value));
                                    }
                                    trackEvent('Search Filter Modal, change engagement rate', {
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
                            <h4 className="mb-1 text-base font-medium">{t('creators.filter.subscribers')}</h4>
                            <div className="flex flex-row space-x-4">
                                <div className="flex items-center gap-2">
                                    <select
                                        className="rounded-md bg-white px-4 py-2 text-base text-gray-500 ring-1 ring-gray-300"
                                        value={audience[0] ?? 'any'}
                                        onChange={(e) => {
                                            setAudience((audiencePrevious) => [
                                                e.target.value === 'any' ? null : e.target.value,
                                                audiencePrevious[1],
                                            ]);
                                            trackEvent('Search Filter Modal, change subscribers from', {
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
                                        className="rounded-md bg-white px-4 py-2 text-base text-gray-500 ring-1 ring-gray-300"
                                        value={audience[1] ?? 'any'}
                                        onChange={(e) => {
                                            setAudience((audiencePrevious) => [
                                                audiencePrevious[0],
                                                e.target.value === 'any' ? null : e.target.value,
                                            ]);
                                            trackEvent('Search Filter Modal, change subscribers to', {
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
                                        <option value="any">{t('creators.filter.max')}</option>
                                    </select>
                                </div>
                            </div>
                        </label>
                    </div>
                    <div>
                        <label className="text-sm">
                            <div className="mb-1 text-base font-medium">{t('creators.filter.gender')}</div>
                            <select
                                className="rounded-md bg-white px-4 py-2 text-base text-gray-500 ring-1 ring-gray-300"
                                value={gender}
                                onChange={(e) => {
                                    if (e.target.value === 'any') {
                                        setGender(undefined);
                                    } else {
                                        setGender(e.target.value);
                                    }
                                    trackEvent('Search Filter Modal, change gender', {
                                        gender: e.target.value,
                                    });
                                }}
                            >
                                <option value="any">{t('creators.filter.any')}</option>
                                <option value="male">{t('creators.filter.male')}</option>
                                <option value="female">{t('creators.filter.female')}</option>
                            </select>
                        </label>
                    </div>

                    <div>
                        <label className="text-sm">
                            <div className="mb-1 text-base font-medium">{t('creators.filter.lastPost')}</div>
                            <select
                                className="rounded-md bg-white px-4 py-2 text-base text-gray-500 ring-1 ring-gray-300"
                                value={lastPost}
                                onChange={(e) => {
                                    if (e.target.value === 'any') {
                                        setLastPost(undefined);
                                    } else {
                                        setLastPost(e.target.value);
                                    }
                                    trackEvent('Search Filter Modal, change last post', {
                                        last_post: e.target.value + ` days`,
                                    });
                                }}
                            >
                                <option value={'any'}>{t('creators.filter.any')}</option>
                                <option value={30}>30 {t('creators.filter.days')}</option>
                                <option value={90}>3 {t('creators.filter.months')}</option>
                                <option value={120}>6 {t('creators.filter.months')}</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label className="text-sm">
                            <div className="mb-1 text-base font-medium">{t('creators.filter.averageViews')}</div>
                            <div className="flex flex-row space-x-4">
                                <div className="flex items-center gap-2">
                                    <select
                                        className="rounded-md bg-white px-4 py-2 text-base text-gray-500 ring-1 ring-gray-300"
                                        value={views[0] ?? 'any'}
                                        onChange={(e) => {
                                            setViews((viewsPrevious) => [
                                                e.target.value === 'any' ? null : e.target.value,
                                                viewsPrevious[1],
                                            ]);
                                            trackEvent('Search Filter Modal, change average views from', {
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
                                        className="rounded-md bg-white px-4 py-2 text-base text-gray-500 ring-1 ring-gray-300"
                                        value={views[1] ?? 'any'}
                                        onChange={(e) => {
                                            setViews((viewsPrevious) => [
                                                viewsPrevious[0],
                                                e.target.value === 'any' ? null : e.target.value,
                                            ]);
                                            trackEvent('Search Filter Modal, change average views to', {
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
                <Button
                    className="border-red-500 bg-transparent text-red-500 transition-all hover:bg-red-400 hover:text-white"
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
                        trackEvent('Search Filters Modal, clear search filters');
                    }}
                    variant="secondary"
                >
                    Clear Filters
                </Button>
            </div>
        </Modal>
    );
};
