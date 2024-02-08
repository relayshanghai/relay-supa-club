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
        <div className="z-10 aspect-square rounded-full border-2 border-primary-600 bg-primary-600 p-2">{children}</div>
    ) : (
        <div
            className={`relative z-10 aspect-square h-full w-fit rounded-full border-2 ${
                progress >= threshold
                    ? 'w-6 border-primary-600 bg-primary-600 before:absolute before:-left-2 before:-top-2 before:-z-10 before:aspect-square before:w-14 before:rounded-full before:bg-primary-300 before:opacity-30'
                    : 'border-gray-200 bg-white'
            } p-3`}
        >
            <div
                className={`aspect-square h-4 w-4 rounded-full ${progress >= threshold ? 'bg-white' : 'bg-gray-200'}`}
            />
        </div>
    );

type ProgressLabel = { title: string; description: string };

const Label = ({ label, position }: { label: ProgressLabel; position: string }) => (
    <section className={`flex basis-1/3 flex-col ${position}`}>
        <p className="text-sm font-semibold text-gray-400">{label.title}</p>
        <p className="text-sm font-normal text-gray-400">{label.description}</p>
    </section>
);

const ProgressHeader = ({ labels, selectedIndex }: { labels: ProgressLabel[]; selectedIndex: number }) => {
    const progress = (selectedIndex / (labels.length - 1)) * 100;
    return (
        <section className="flex flex-col gap-2 pt-6">
            <section className="relative flex w-full justify-between">
                {labels.map((label, index) => (
                    <ProgressSymbol
                        key={'tick-' + label.title}
                        progress={progress}
                        threshold={(index / (labels.length - 1)) * 100}
                    >
                        <BorderedTick className="h-6 w-6 stroke-white" />
                    </ProgressSymbol>
                ))}
                <div className="absolute flex h-full w-full items-center">
                    <Progress className="h-1 bg-gray-200" value={progress} />
                </div>
            </section>
            <section className="relative flex w-full justify-between">
                {labels.map((label, index) => (
                    <Label
                        key={'label-' + label.title}
                        label={label}
                        position={index == 0 ? 'text-start' : index === labels.length - 1 ? 'text-end' : 'text-center'}
                    />
                ))}
            </section>
        </section>
    );
};

export default ProgressHeader;
