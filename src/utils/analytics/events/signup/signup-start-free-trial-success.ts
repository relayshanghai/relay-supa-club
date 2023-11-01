import type { TriggerEvent } from '../../types';

export const SIGNUP_START_FREE_TRIAL_SUCCESS = 'Signup, Start free trial success';

export type SignupStartFreeTrialSuccessPayload = {
    company?: string;
};

export const SignupStartFreeTrialSuccess = (trigger: TriggerEvent, value?: SignupStartFreeTrialSuccessPayload) =>
    trigger(SIGNUP_START_FREE_TRIAL_SUCCESS, { ...value });

SignupStartFreeTrialSuccess.eventName = <typeof SIGNUP_START_FREE_TRIAL_SUCCESS>SIGNUP_START_FREE_TRIAL_SUCCESS;
