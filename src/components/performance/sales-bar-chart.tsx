import { PureComponent } from 'react';
import { BarChart, Bar, XAxis, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'NOV',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'DEC',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'JAN',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'FEB',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'MAR',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'APR',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

export default class SalesBarChart extends PureComponent {
    render() {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart width={120} height={40} data={data}>
                    <XAxis
                        dataKey="name"
                        style={{ fontSize: '70%' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Bar dataKey="uv" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        );
    }
}
