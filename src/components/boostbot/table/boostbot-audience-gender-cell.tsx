import type { Row, Table } from '@tanstack/react-table';
import type { SearchTableInfluencer as BoostbotInfluencer } from 'types';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { convertAudienceDataToPercentage, processedAudienceDemoData } from 'src/utils/api/boostbot/helper';

export type BoostbotAudienceDemoCellProps = {
    row: Row<BoostbotInfluencer>;
    table: Table<BoostbotInfluencer>;
};

export const BoostbotAudienceGenderCell = ({ row, table }: BoostbotAudienceDemoCellProps) => {
    const influencer = row.original;
    const processedData = convertAudienceDataToPercentage(processedAudienceDemoData(influencer));

    const isLoading = table.options.meta?.isLoading;

    return (
        <>
            {isLoading ? (
                <div className="h-14 w-[200px] animate-pulse bg-gray-300" />
            ) : (
                <div className="-mr-20 h-20 w-60">
                    <ResponsiveContainer>
                        <BarChart
                            data={processedData}
                            margin={{
                                top: 25,
                                bottom: -15,
                            }}
                            className="-ml-16 -mr-4 -mt-6"
                        >
                            <CartesianGrid vertical={false} horizontal={false} />
                            <Tooltip
                                cursor={false}
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
                                    return [`${parseFloat(value).toFixed(2)}%`, name];
                                }}
                            />
                            <XAxis
                                dataKey="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 8, fill: '#4b5563' }}
                            />
                            <YAxis tick={false} axisLine={false} tickLine={false} />
                            <Bar dataKey="female" minPointSize={5} fill="#FAA7E0" radius={2} />
                            <Bar dataKey="male" minPointSize={5} fill="#84CAFF" radius={2} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </>
    );
};
