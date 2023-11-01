import type { TriggerEvent } from '../../types';
import type { CurrentPageEvent } from '../current-pages';

export const SIGNUP_OPEN_TERMS_AND_CONDITIONS = 'Signup, open Terms and Conditions';

export type SignupOpenTermsAndConditionsPayload = {
    currentPage: CurrentPageEvent;
};

export const SignupOpenTermsAndConditions = (trigger: TriggerEvent, value?: SignupOpenTermsAndConditionsPayload) =>
    trigger(SIGNUP_OPEN_TERMS_AND_CONDITIONS, { ...value });

SignupOpenTermsAndConditions.eventName = <typeof SIGNUP_OPEN_TERMS_AND_CONDITIONS>SIGNUP_OPEN_TERMS_AND_CONDITIONS;
