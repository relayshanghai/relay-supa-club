import { StatCard } from './stat-card';

export const SequenceStats = () => {
    const stats = [
        {
            name: 'Delivered Emails',
            value: '345',
        },
        {
            name: 'Open Rate',
            value: '15%',
        },
        {
            name: 'Click Rate',
            value: '12%',
        },
    ];
    return (
        <div className="flex justify-around rounded-lg bg-white px-12 py-8 shadow-sm">
            {stats.map((stat) => (
                <div key={stat.name}>
                    <StatCard name={stat.name} value={stat.value} />
                </div>
            ))}
        </div>
    );
};
