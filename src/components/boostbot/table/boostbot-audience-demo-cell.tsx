import type { Row, Table } from '@tanstack/react-table';
import type { BoostbotInfluencer } from 'pages/api/boostbot/get-influencers';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { processedAudienceDemoData } from 'src/utils/api/boostbot/helper';

export type BoostbotAudienceDemoCellProps = {
    row: Row<BoostbotInfluencer>;
    table: Table<BoostbotInfluencer>;
};

export const BoostbotAudienceDemoCell = ({ row, table }: BoostbotAudienceDemoCellProps) => {
    const influencer = row.original;
    const processedData = processedAudienceDemoData(influencer);

    const isLoading = table.options.meta?.isLoading;

    return (
        <>
            {isLoading ? (
                <div className="h-14 w-[200px] animate-pulse bg-gray-300" />
            ) : (
                <ResponsiveContainer width={200} height={80}>
                    <BarChart
                        data={processedData}
                        margin={{
                            top: 25,
                            bottom: -15,
                        }}
                        className="-mt-6"
                    >
                        <CartesianGrid vertical={false} horizontal={false} />
                        <Tooltip
                            offset={10}
                            allowEscapeViewBox={{ x: true, y: false }}
                            contentStyle={{
                                backgroundColor: '#000000ba',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                            }}
                            wrapperStyle={{
                                zIndex: 50,
                            }}
                            labelStyle={{
                                color: '#ffffff',
                            }}
                            formatter={(value: string, name: string) => {
                                return [`${parseFloat(value).toFixed(2)}`, name];
                            }}
                        />
                        <XAxis
                            dataKey="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 8, fill: '#4b5563' }}
                        />
                        <YAxis domain={['dataMin', 1000]} tick={false} axisLine={false} tickLine={false} />
                        <Bar dataKey="female" fill="#FAA7E0" radius={2} />
                        <Bar dataKey="male" fill="#84CAFF" radius={2} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </>
    );
};
