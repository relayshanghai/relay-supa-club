import { type Driver, driver as driverJS } from 'driver.js';
import { useEffect, useState } from 'react';
import { useLocalStorage } from './use-localstorage';
import { create } from 'src/utils/zustand';
import { type DriverIntros } from 'types/driver';
import { type Nullable } from 'types/nullable';

type GuideFlagType = {
    [key: string]: boolean;
};

interface IntroStepsStore {
    guides: Nullable<DriverIntros>;
    setGuides: (guides: DriverIntros) => void;
}

export const useIntroStepsStore = create<IntroStepsStore>((set) => ({
    guides: null,
    setGuides: (guides: DriverIntros) => set({ guides }),
}));

interface ActiveGuideStore {
    activeGuide: Nullable<string>;
    setActiveGuide: (guides: Nullable<string>) => void;
}

export const useActiveGuide = create<ActiveGuideStore>((set) => ({
    activeGuide: null,
    setActiveGuide: (guides: Nullable<string>) => set({ activeGuide: guides }),
}));

export const useDriverV2 = () => {
    const { setGuides, guides } = useIntroStepsStore();
    const { setActiveGuide, activeGuide } = useActiveGuide();
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
            onDestroyed: () => {
                setVal({ ...val, [activeGuide as string]: true });
                setActiveGuide(null);
            },
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
        if (guides?.[section].length && val[section] === undefined) {
            if (driver?.isActive()) driver?.destroy();
            setActiveGuide(section);
            driver?.setSteps(guides[section]);
            driver?.drive();
        }
    };

    const hasBeenSeen = (sections: string[]) => {
        return sections.every((section) => val[section]);
    };

    return { setGuides, startTour, guidesReady, guides, hasBeenSeen, guiding: !!activeGuide };
};
