import type { TriggerEvent } from '../../types';

export const SIGNUP_START_FREE_TRIAL_FAILED = 'Signup, Start free trial failed';

export type SignupStartFreeTrialFailedPayload = {
    company?: string;
};

export const SignupStartFreeTrialFailed = (trigger: TriggerEvent, value?: SignupStartFreeTrialFailedPayload) =>
    trigger(SIGNUP_START_FREE_TRIAL_FAILED, { ...value });

SignupStartFreeTrialFailed.eventName = <typeof SIGNUP_START_FREE_TRIAL_FAILED>SIGNUP_START_FREE_TRIAL_FAILED;
