import type { FC } from 'react';

export const TimelineItem: FC<{ title: string; content: string }> = ({ title, content }) => {
    return (
        <div className="relative flex w-1/3 flex-col items-center">
            <div className="top absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500" />
            <div className="mt-6 text-center">
                <h3 className="text-lg font-bold text-blue-500">{title}</h3>
                <p className="mt-2 text-base text-blue-500">{content}</p>
            </div>
        </div>
    );
};
