import { type Driver, driver as driverJS, type DriveStep } from 'driver.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

export const useDriver = (_section: string) => {
    const { setSteps: _setSteps, steps } = useIntroStepsStore();
    const [driver, setDriver] = useState<Driver | null>(null);
    const [stepsReady, setStepsReady] = useState(false);
    const [section, setSection] = useState<string>('');
    const [val, setVal] = useLocalStorage<GuideFlagType[]>('boostbot-guide-flag', []);
    const hasBeenGuided = val.find((d) => d.section === section)?.hasBeenGuided;
    const sectionSteps = useMemo(() => steps[section] ?? [], [steps, section]);

    useEffect(() => {
        setSection(_section);
    }, [_section]);

    useEffect(() => {
        const d = driverJS({
            showProgress: true, // Shows the progress bar at the bottom
            allowClose: true, // Whether clicking on overlay should close or not
            nextBtnText: 'Next', // Text on the next button for this step
            prevBtnText: 'Previous', // Text on the previous button for this step
            doneBtnText: 'Done', // Text on the last button for this step
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
        setDriver(d);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sectionSteps]);

    const initFlag = useCallback(() => {
        const pages = val.map((d) => d.section);
        if (!pages.includes(section)) {
            setVal([...val, { hasBeenGuided: false, section }]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [section]);

    const initializeSteps = useCallback(() => {
        if (driver && sectionSteps.length > 0) {
            driver.setSteps(sectionSteps);
            setStepsReady(true);
            initFlag();
        }
    }, [driver, sectionSteps, initFlag]);

    useEffect(() => {
        initializeSteps();
    }, [initializeSteps]);

    const startTour = () => {
        if (stepsReady) {
            driver?.drive();
        }
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
