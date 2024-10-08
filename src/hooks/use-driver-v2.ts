import { driver as driverJS } from 'driver.js';
import { useEffect, useState } from 'react';
import { useLocalStorage } from './use-localstorage';
import { create } from 'src/utils/zustand';
import { type DriverIntros } from 'types/driver';
import { type Nullable } from 'types/nullable';
import { guidesList } from 'src/guides/src';

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
    const [guidesReady, setGuidesReady] = useState(false);
    const [val, setVal] = useLocalStorage<GuideFlagType>('boostbot-guide-flag', {});

    const driver = driverJS({
        showProgress: true, // Shows the progress bar at the bottom
        allowClose: true, // Whether clicking on overlay should close or not
        nextBtnText: 'Next', // Text on the next button for this step
        prevBtnText: 'Previous', // Text on the previous button for this step
        doneBtnText: 'Finish', // Text on the last button for this step
        smoothScroll: true, // Whether to animate the scroll to the next element
        steps: guides?.[activeGuide as string] ?? [],
        onDestroyStarted: () => {
            if (activeGuide) {
                setVal({ ...val, [activeGuide]: guidesList[activeGuide] === 'saveState' });
                setActiveGuide(null);
                driver.destroy();
            }
        },
    });

    useEffect(() => {
        if (guides) {
            setGuidesReady(true);
        }
    }, [guides]);

    const startTour = (section: string) => {
        // disable guide for now
        return;
        if (guides?.[section]?.length && !val[section] && guidesList[section]) {
            if (driver.isActive()) driver.destroy();
            setActiveGuide(section);
            const intervalId = setInterval(() => {
                if (driver.getActiveElement() !== undefined && driver.getActiveIndex() !== undefined) {
                    clearInterval(intervalId);
                }
                driver.drive();
            }, 500);
        }
    };

    const hasBeenSeen = (sections: string[]) => {
        return !!sections.find((section) => val[section]);
    };

    const _setGuides = (guides: DriverIntros) => {
        const newObj = Object.keys(guides).reduce((acc: Record<string, boolean>, key) => {
            acc[key] = !!val[key];
            return acc;
        }, {});
        setVal({ ...val, ...newObj });
        setGuides(guides);
    };

    return { setGuides: _setGuides, startTour, guidesReady, guides, hasBeenSeen, guiding: !!activeGuide };
};
