/* eslint-disable react-hooks/exhaustive-deps */
import { type FC } from 'react';
import { ArrowLongDownIcon } from '@heroicons/react/24/solid';

type SequenceStepDurationProps = {
    duration: number; // in hours
};

export const SequenceStepDuration: FC<SequenceStepDurationProps> = ({ duration }) => {
    return (
        <div className="inline-flex h-10 w-fit items-center justify-start gap-4 py-1">
            <ArrowLongDownIcon className="h-8 w-8 fill-gray-300" />
            <div>
                <span className="font-['Poppins'] text-xs font-semibold leading-tight tracking-tight text-gray-300">
                    Wait{' '}
                </span>
                <span
                    className="font-['Poppins'] text-xs font-semibold leading-tight tracking-tight text-violet-400"
                    data-testid="duration-text"
                >
                    {Math.ceil(duration / 24)}
                </span>
                <span className="font-['Poppins'] text-xs font-semibold leading-tight tracking-tight text-gray-300">
                    {' '}
                    business days
                </span>
            </div>
        </div>
    );
};
