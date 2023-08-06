import { useTranslation } from 'react-i18next';
import type { Influencer } from 'pages/boostbot';
import { InfluencerRow } from './influencer-row';

interface InfluencersTableProps {
    influencers: Influencer[];
}

export const InfluencersTable = ({ influencers }: InfluencersTableProps) => {
    const { t } = useTranslation();

    return (
        <table className="w-full divide-y divide-gray-200 border">
            <thead className="bg-white">
                <tr>
                    <th className="p-4 text-left text-xs font-normal text-gray-500">{t('boostbot.platform')}</th>
                    <th className="p-4 text-left text-xs font-normal text-gray-500">{t('boostbot.account')}</th>
                    <th className="p-4 text-left text-xs font-normal text-gray-500">{t('boostbot.posts')}</th>
                    <th className="p-4 text-left text-xs font-normal text-gray-500">{t('boostbot.stats')}</th>
                    <th className="p-4 text-left text-xs font-normal text-gray-500">{t('boostbot.email')}</th>
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
                {influencers.map((influencer) => (
                    <InfluencerRow key={influencer.user_id} influencer={influencer} />
                ))}
            </tbody>
        </table>
    );
};
