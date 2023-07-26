import { StatCard } from './stat-card';

export const SequenceStats = () => {
    return (
        <div className="flex justify-around rounded-lg bg-white px-12 py-8 shadow-sm">
            <StatCard />
            <StatCard />
            <StatCard />
        </div>
    );
};
