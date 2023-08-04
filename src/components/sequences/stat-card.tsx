import type { ReactElement } from 'react';

export const StatCard = ({ name, value }: { name: string; value: string; icon?: ReactElement }) => {
    return (
        <div className="flex cursor-default flex-col items-center justify-center space-y-2 p-2">
            <div className="font-medium">{name}</div>
            <div className="text-4xl">{value}</div>
        </div>
    );
};
