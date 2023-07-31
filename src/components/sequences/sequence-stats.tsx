import { StatCard } from './stat-card';

export const SequenceStats = () => {
    const stats = [
        {
            name: 'Total Influencers',
            value: '345',
        },
        {
            name: 'Open Rate',
            value: '15%',
        },
        {
            name: 'Clicked Rate',
            value: '12%',
        },
        {
            name: 'Replied',
            value: '10',
        },
    ];
    return (
        <div className="flex flex-wrap justify-around rounded-lg bg-white px-12 py-8 shadow-sm">
            {stats.map((stat) => (
                <div key={stat.name}>
                    <StatCard name={stat.name} value={stat.value} />
                </div>
            ))}
        </div>
    );
};
