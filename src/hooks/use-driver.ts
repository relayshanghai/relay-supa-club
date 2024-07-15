import { driver, type DriveStep } from 'driver.js';
import { useEffect, useState } from 'react';
import { useLocalStorage } from './use-localstorage';
import { create } from 'src/utils/zustand';

type GuideFlagType = {
    hasBeenGuided: boolean;
    section: string;
};

type DriverIntros = {
    // any string as key and DriveStep[] as value
    [key: string]: DriveStep[];
};

interface IntroSteps {
    steps: DriverIntros;
    setSteps: (steps: DriverIntros) => void;
}

export const useIntroStepsStore = create<IntroSteps>((set) => ({
    steps: {},
    setSteps: (steps: DriverIntros) => set({ steps }),
}));

export const useDriver = (section: string) => {
    const { setSteps: _setSteps, steps } = useIntroStepsStore();
    const [, setActiveStep] = useState(0);
    const [val, setVal] = useLocalStorage<GuideFlagType[]>('boostbot-guide-flag', []);

    const sectionSteps = steps[section] || [];

    const d = driver({
        showProgress: true, // Shows the progress bar at the bottom
        allowClose: true, // Whether clicking on overlay should close or not
        nextBtnText: 'Next', // Text on the next button for this step
        prevBtnText: 'Previous', // Text on the previous button for this step
        doneBtnText: 'Done', // Text on the last button for this step
        steps: sectionSteps,
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
        if (sectionSteps.length > 0) {
            setActiveStep(d.getActiveIndex() as number);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [d.getActiveIndex()]);

    const stepsReady = sectionSteps.length > 0;

    const startTour = () => {
        if (!sectionSteps.length) {
            return;
        }

        d.drive();
    };

    const addStep = (step: DriveStep) => {
        _setSteps({
            ...steps,
            [section]: [...sectionSteps, step],
        });
    };

    const setSteps = (_steps: DriveStep[]) => {
        _setSteps({
            ...steps,
            [section]: _steps,
        });
    };

    return { setSteps, addStep, startTour, stepsReady, hasBeenGuided };
};
