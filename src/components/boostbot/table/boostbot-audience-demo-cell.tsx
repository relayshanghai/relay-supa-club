import type { Row } from '@tanstack/react-table';
import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export type BoostbotAudienceDemoCellProps = {
    row: Row<BoostbotInfluencer>;
};

export const BoostbotAudienceDemoCell = ({ row }: BoostbotAudienceDemoCellProps) => {
    const influencer = row.original;
    // TODO: replace placeholder in V2-1075
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const audienceDemo = influencer.audience_genders_per_age;

    const dummyBarChartData = [
        {
            category: '13-17',
            male: 4000,
            female: 2400,
        },
        {
            category: '18-24',
            male: 3000,
            female: 1398,
        },
        {
            category: '25-44',
            male: 2000,
            female: 1800,
        },
        {
            category: '45-65',
            male: 2780,
            female: 2908,
        },
        {
            category: '65+',
            male: 1890,
            female: 3800,
        },
    ];

    return (
        <ResponsiveContainer width={150} height={72}>
            <BarChart
                data={dummyBarChartData}
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
