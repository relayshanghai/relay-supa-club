import type { TriggerEvent } from '../../types';

export const SIGNUP_CHECK_TERMS_AND_CONDITIONS = 'Signup, check Terms and Conditions';

export type SignupCheckTermsAndConditionsPayload = {
    termsChecked: boolean;
};

export const SignupCheckTermsAndConditions = (trigger: TriggerEvent, value?: SignupCheckTermsAndConditionsPayload) =>
    trigger(SIGNUP_CHECK_TERMS_AND_CONDITIONS, { ...value });

SignupCheckTermsAndConditions.eventName = <typeof SIGNUP_CHECK_TERMS_AND_CONDITIONS>SIGNUP_CHECK_TERMS_AND_CONDITIONS;
