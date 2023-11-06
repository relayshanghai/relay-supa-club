import type { Row } from '@tanstack/react-table';
import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { GenderPerAge } from 'types';

export type BoostbotAudienceDemoCellProps = {
    row: Row<BoostbotInfluencer>;
};

export const processedAudienceDemoData = (influencer: BoostbotInfluencer) => {
    const { audience_genders_per_age: audienceDemoData, audience_genders } = influencer;
    const maleAudienceWeight = audience_genders && audience_genders[0].weight;

    if (!audienceDemoData || !maleAudienceWeight) {
        return [];
    }

    const processRawData = (rawData: GenderPerAge[], maleAudienceWeight: number) => {
        const totalMale = rawData.reduce((sum, item) => sum + (item.male ?? 0), 0);
        const femaleAudienceWeight = 1 - maleAudienceWeight;

        return rawData.map((item) => ({
            category: item.code,
            male: (item.male ?? 0) * maleAudienceWeight * 10000,
            female:
                totalMale === 0 || item.male === undefined ? 0 : (item.male / totalMale) * femaleAudienceWeight * 10000,
        }));
    };

    return processRawData(audienceDemoData, maleAudienceWeight);
};

export const BoostbotAudienceDemoCell = ({ row }: BoostbotAudienceDemoCellProps) => {
    const influencer = row.original;
    const processedData = processedAudienceDemoData(influencer);

    return (
        <ResponsiveContainer width={150} height={72}>
            <BarChart
                data={processedData}
                margin={{
                    top: 16,
                }}
            >
                <CartesianGrid vertical={false} horizontal={false} />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 8 }} />
                <YAxis width={0} tick={false} axisLine={false} tickLine={false} />
                <Bar dataKey="female" fill="#fcceee" radius={2} />
                <Bar dataKey="male" fill="#b2ccff" radius={2} />
            </BarChart>
        </ResponsiveContainer>
    );
};
