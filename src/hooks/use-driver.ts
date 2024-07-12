import { driver, type DriveStep } from 'driver.js';
import { useEffect, useState } from 'react';
import { useLocalStorage } from './use-localstorage';
import { create } from 'src/utils/zustand';

type GuideFlagType = {
    hasBeenGuided: boolean;
    section: string;
};

interface IntroSteps {
    steps: DriveStep[];
    setSteps: (steps: DriveStep[]) => void;
}

export const useIntroStepsStore = create<IntroSteps>((set) => ({
    steps: [],
    setSteps: (steps: DriveStep[]) => set({ steps }),
}));

export const useDriver = (section: string) => {
    const { setSteps, steps } = useIntroStepsStore();
    const [, setActiveStep] = useState(0);
    const [val, setVal] = useLocalStorage<GuideFlagType[]>('boostbot-guide-flag', []);

    const d = driver({
        showProgress: true, // Shows the progress bar at the bottom
        allowClose: true, // Whether clicking on overlay should close or not
        nextBtnText: 'Next', // Text on the next button for this step
        prevBtnText: 'Previous', // Text on the previous button for this step
        doneBtnText: 'Done', // Text on the last button for this step
        steps,
        onDestroyed: () => {
            setVal(
                val.map((d) => {
                    if (d.section === section) {
                        return { hasBeenGuided: true, section };
                    }
                    return d;
                }),
            );
        },
    });

    const hasBeenGuided = val.find((d) => d.section === section)?.hasBeenGuided;

    useEffect(() => {
        const pages = val.map((d) => d.section);
        if (!pages.includes(section)) {
            setVal([...val, { hasBeenGuided: false, section }]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [section]);

    useEffect(() => {
        if (steps.length > 0) {
            setActiveStep(d.getActiveIndex() as number);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [d.getActiveIndex()]);

    const stepsReady = steps.length > 0;

    const startTour = () => {
        if (!steps.length || hasBeenGuided) {
            return;
        }

        d.drive();
    };

    const addStep = (step: DriveStep) => {
        setSteps([...steps, step]);
    };

    return { setSteps, addStep, startTour, stepsReady, hasBeenGuided };
};
