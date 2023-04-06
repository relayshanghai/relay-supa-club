import { LineChart as LC, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { numFormatter } from 'src/utils/utils';

export default function LineChart({ data, dataKey }: { data: any[]; dataKey: string }) {
    const { t } = useTranslation();
    return (
        <div className="inline-block h-[250px] w-full rounded-lg bg-white py-6 pb-12 pr-6 text-xs">
            <h3 className="mb-4 text-center text-lg font-bold text-gray-600">{t(`creators.show.${dataKey}`)}</h3>
            <ResponsiveContainer width="100%">
                <LC data={data}>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value: any) => numFormatter(value)} />
                    <Tooltip />
                    {/* <Legend /> */}
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        name={t(`creators.show.${dataKey}`) || ''}
                        stroke="#8B5CF6"
                    />
                </LC>
            </ResponsiveContainer>
        </div>
    );
}
