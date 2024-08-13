import React from 'react';

import { BorderedTick } from 'src/components/icons';
import { Progress } from 'shadcn/components/ui/progress';

const ProgressSymbol = ({
    progress,
    threshold,
    children,
}: {
    progress: number;
    threshold: number;
    children: React.ReactNode;
}) =>
    progress > threshold ? (
        <div className="z-10 aspect-square rounded-full border-2 border-primary-600 bg-primary-600 p-1">{children}</div>
    ) : (
        <div
            className={`relative z-10 aspect-square h-full w-fit rounded-full border-2 ${
                progress >= threshold
                    ? 'w-6 border-primary-600 bg-primary-600 before:absolute before:-left-2 before:-top-2 before:-z-10 before:aspect-square before:w-10 before:rounded-full before:bg-primary-300 before:opacity-30'
                    : 'border-gray-200 bg-white'
            } p-2`}
        >
            <div
                className={`aspect-square h-2 w-2 rounded-full ${progress >= threshold ? 'bg-white' : 'bg-gray-200'}`}
            />
        </div>
    );

type ProgressLabel = { title: string; description: string };

const Label = ({ label, length }: { label: ProgressLabel; length: number }) => (
    <section className="flex flex-col text-center" style={{ flexBasis: `${(1 / length) * 100}%` }}>
        <p className="text-sm font-semibold text-gray-400">{label.title}</p>
        <p className="text-sm font-normal text-gray-400">{label.description}</p>
    </section>
);

const ProgressHeader = ({ labels, selectedIndex }: { labels: ProgressLabel[]; selectedIndex: number }) => {
    const progress = (selectedIndex / (labels.length - 1)) * 100;
    return (
        <section className="flex flex-col gap-3">
            <section className="px-24 pt-6 md:px-28 xl:px-48">
                <section className="relative flex w-full justify-between">
                    {labels.map((label, index) => (
                        <ProgressSymbol
                            key={'tick-' + label.title}
                            progress={progress}
                            threshold={(index / (labels.length - 1)) * 100}
                        >
                            <BorderedTick className="h-4 w-4 stroke-white" />
                        </ProgressSymbol>
                    ))}
                    <div className="absolute flex h-full w-full items-center">
                        <Progress className="h-1 bg-gray-200" value={progress} />
                    </div>
                </section>
            </section>
            <section className="relative flex w-full justify-between">
                {labels.map((label) => (
                    <Label key={'label-' + label.title} label={label} length={labels.length} />
                ))}
            </section>
        </section>
    );
};

export default ProgressHeader;
