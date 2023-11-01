import type { TriggerEvent } from '../types';
import type { CurrentPageEvent } from './current-pages';

export const LANDING_PAGE_START_FREE_TRIAL_CLICKED = 'Landing Page, clicked on start free trial';

export type LandingPageStartFreeTrialClickedPayload = {
    currentPage: CurrentPageEvent;
};

export const LandingPageStartFreeTrialClicked = (
    trigger: TriggerEvent,
    value?: LandingPageStartFreeTrialClickedPayload,
) => trigger(LANDING_PAGE_START_FREE_TRIAL_CLICKED, { ...value });

LandingPageStartFreeTrialClicked.eventName = <typeof LANDING_PAGE_START_FREE_TRIAL_CLICKED>(
    LANDING_PAGE_START_FREE_TRIAL_CLICKED
);
