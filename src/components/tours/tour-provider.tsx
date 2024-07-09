import type { FC, PropsWithChildren } from 'react';
import { type StepType, TourProvider as TP } from '@reactour/tour';

type TourProviderProps = PropsWithChildren & {
    steps: StepType[];
};

export const TourProvider: FC<TourProviderProps> = ({ children, steps }) => {
    return <TP steps={steps}>{children}</TP>;
};
