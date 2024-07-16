import { type Driver, driver as driverJS } from 'driver.js';
import { useEffect, useState } from 'react';
import { useLocalStorage } from './use-localstorage';
import { create } from 'src/utils/zustand';
import { type DriverIntros } from 'types/driver';
import { type Nullable } from 'types/nullable';

type GuideFlagType = {
    [key: string]: boolean;
};

interface IntroSteps {
    guides: Nullable<DriverIntros>;
    setGuides: (guides: DriverIntros) => void;
}

export const useIntroStepsStore = create<IntroSteps>((set) => ({
    guides: null,
    setGuides: (guides: DriverIntros) => set({ guides }),
}));

export const useDriverV2 = () => {
    const { setGuides, guides } = useIntroStepsStore();
    const [driver, setDriver] = useState<Driver | null>(null);
    const [guidesReady, setGuidesReady] = useState(false);
    const [val, setVal] = useLocalStorage<GuideFlagType>('boostbot-guide-flag', {});

    useEffect(() => {
        const d = driverJS({
            showProgress: true, // Shows the progress bar at the bottom
            allowClose: true, // Whether clicking on overlay should close or not
            nextBtnText: 'Next', // Text on the next button for this step
            prevBtnText: 'Previous', // Text on the previous button for this step
            doneBtnText: 'Done', // Text on the last button for this step
        });
        setDriver(d);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (guides) {
            setGuidesReady(true);
        }
    }, [guides]);

    const startTour = (section: string) => {
        if (guides?.[section] && !val[section]) {
            if (driver?.isActive()) driver?.destroy();
            setVal({ ...val, [section]: true });
            driver?.setSteps(guides[section]);
            driver?.drive();
        }
    };

    return { setGuides, startTour, guidesReady, guides };
};
