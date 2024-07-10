import { driver, type DriveStep } from 'driver.js';
import { useEffect, useState } from 'react';
import { useLocalStorage } from './use-localstorage';

type GuideFlagType = {
    hasBeenGuided: boolean;
    page: string;
};

export const useDriver = (page: string) => {
    const [steps, setSteps] = useState<DriveStep[]>([]);
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
                    if (d.page === page) {
                        return { hasBeenGuided: true, page };
                    }
                    return d;
                }),
            );
        },
    });

    const hasBeenGuided = val.find((d) => d.page === page)?.hasBeenGuided;

    useEffect(() => {
        const pages = val.map((d) => d.page);
        if (!pages.includes(page)) {
            setVal([...val, { hasBeenGuided: false, page }]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

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
