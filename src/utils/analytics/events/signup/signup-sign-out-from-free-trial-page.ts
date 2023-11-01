import type { TriggerEvent } from '../../types';
import type { CurrentPageEvent } from '../current-pages';

export const SIGNUP_SIGN_OUT_FROM_FREE_TRIAL_PAGE = 'Signup, Sign out from free trial page';

export type SignupSignOutFromFreeTrialPagePayload = {
    currentPage: CurrentPageEvent;
};

export const SignupSignOutFromFreeTrialPage = (trigger: TriggerEvent, value?: SignupSignOutFromFreeTrialPagePayload) =>
    trigger(SIGNUP_SIGN_OUT_FROM_FREE_TRIAL_PAGE, { ...value });

SignupSignOutFromFreeTrialPage.eventName = <typeof SIGNUP_SIGN_OUT_FROM_FREE_TRIAL_PAGE>(
    SIGNUP_SIGN_OUT_FROM_FREE_TRIAL_PAGE
);
