import { TFunction } from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CreatorPlatform, CreatorReport, SimilarUser } from 'types';
import ToggleTabs from '../common/toggle-tabs';
import { CreatorBlock } from './creator-block';
import { ProgressBlock } from './creator-progress-block';

type AudienceStats =
    | CreatorReport['audience_likers']['data']
    | CreatorReport['audience_followers']['data']
    | CreatorReport['audience_commenters']['data'];

type WeightedStat = {
    name: string;
    weight: number;
};

type Stat = {
    type: 'progress' | 'kollist' | 'barchart';
    label: string;
    stats: WeightedStat[] | SimilarUser[];
};
const prepareStats = (audience: AudienceStats, t: TFunction) => {
    const data: Stat[] = [];
    if (audience.audience_types)
        data.push({ type: 'progress', label: 'types', stats: audience.audience_types });
    if (audience.audience_genders)
        data.push({
            type: 'progress',
            label: 'genders',
            stats: audience.audience_genders.map(({ code, weight }) => ({
                name: t(`creators.filter.${code.toLowerCase()}`),
                weight
            }))
        });
    if (audience.audience_ages)
        data.push({
            type: 'progress',
            label: 'ages',
            stats: audience.audience_ages.map(({ code, weight }) => ({
                name: code,
                weight
            }))
        });
    if (audience.audience_languages)
        data.push({
            type: 'progress',
            label: 'languages',
            stats: audience.audience_languages.map(({ name, weight }) => ({
                name: name || '',
                weight: weight || 0
            }))
        });
    if (audience.audience_geo)
        data.push({
            type: 'progress',
            label: 'countries',
            stats: audience.audience_geo.countries.map(({ name, weight }) => ({
                name: name || '',
                weight: weight || 0
            }))
        });
    if (!!audience.audience_geo?.cities?.length)
        data.push({
            type: 'progress',
            label: 'cities',
            stats: audience.audience_geo.cities.map(({ name, weight }) => ({
                name: name || '',
                weight: weight || 0
            }))
        });
    if (audience.audience_brand_affinity)
        data.push({
            type: 'progress',
            label: 'audienceBrands',
            stats: audience.audience_brand_affinity.map(({ name, weight }) => ({
                name,
                weight
            }))
        });
    // if (obj.audience_ethnicities) data.push({ type: "progress", label: 'audienceEthnicity', stats: obj.audience_ethnicities })
    if (audience.audience_interests)
        data.push({
            type: 'progress',
            label: 'audienceInterests',
            stats: audience.audience_interests.map(({ name, weight }) => ({
                name: name || '',
                weight: weight || 0
            }))
        });

    if (audience.audience_genders_per_age) {
        const gendersByAge: {
            name: string;
            weight: number;
        }[] = [];
        audience.audience_genders_per_age.forEach(({ code, male, female }) => {
            gendersByAge.push(
                ...[
                    {
                        name: `${code} ${t('creators.filter.male')}`,
                        weight: male
                    },
                    {
                        name: `${code} ${t('creators.filter.female')}`,
                        weight: female
                    }
                ]
            );
        });
        data.push({
            type: 'progress',
            label: 'audienceGenderAge',
            stats: gendersByAge
        });
    }
    if (audience.audience_lookalikes)
        data.push({
            type: 'kollist',
            label: 'similarAudienceKol',
            stats: audience.audience_lookalikes as SimilarUser[]
        });

    return data;
};

const AudienceStatsSection = ({
    stats,
    platform
}: {
    stats: Stat[];
    platform: CreatorPlatform;
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div key={index}>
                    {stat.type === 'progress' && (
                        <ProgressBlock stats={stat.stats as WeightedStat[]} title={stat.label} />
                    )}
                    {stat.type === 'kollist' && (
                        <CreatorBlock
                            title={stat.label}
                            similarCreators={stat.stats as SimilarUser[]}
                            platform={platform}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export const AudienceStats = ({ report }: { report: CreatorReport }) => {
    const [audienceTab, setAudienceTab] = useState('audience_followers');
    const { t } = useTranslation();
    const followersStats = prepareStats(report.audience_followers?.data || {}, t);
    const commentersStats = prepareStats(report.audience_commenters?.data || {}, t);
    const likersStats = prepareStats(report.audience_likers?.data || {}, t);

    const tabs: {
        label: string;
        value: string;
    }[] = [];

    if (followersStats.length > 0)
        tabs.push({ label: `creators.show.audience_followers`, value: 'audience_followers' });
    if (commentersStats.length > 0)
        tabs.push({ label: `creators.show.audience_commenters`, value: 'audience_commenters' });
    if (likersStats.length > 0)
        tabs.push({ label: `creators.show.audience_likers`, value: 'audience_likers' });

    const platform = report.user_profile.type;

    return (
        <div className="p-6">
            <div className="font-bold text-gray-600 mb-2">{t('creators.show.audienceStats')}</div>
            <ToggleTabs currentTab={audienceTab} setCurrentTab={setAudienceTab} tabs={tabs} />
            {audienceTab === 'audience_followers' && followersStats.length > 0 && (
                <AudienceStatsSection stats={followersStats} platform={platform} />
            )}
            {audienceTab === 'audience_commenters' && commentersStats.length > 0 && (
                <AudienceStatsSection stats={commentersStats} platform={platform} />
            )}
            {audienceTab === 'audience_likers' && likersStats.length > 0 && (
                <AudienceStatsSection stats={likersStats} platform={platform} />
            )}
        </div>
    );
};
