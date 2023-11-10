import type { Row } from '@tanstack/react-table';
import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { processedAudienceDemoData } from 'src/utils/api/boostbot/helper';

export type BoostbotAudienceDemoCellProps = {
    row: Row<BoostbotInfluencer>;
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
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#4b5563' }} />
                <YAxis width={0} tick={false} axisLine={false} tickLine={false} />
                <Bar dataKey="female" fill="#fcceee" radius={2} />
                <Bar dataKey="male" fill="#b2ccff" radius={2} />
            </BarChart>
        </ResponsiveContainer>
    );
};
