import type { EventPayload, TriggerEvent } from '../../types';

export const COMPLETE_SIGNUP_STEP = 'Complete Signup Step';

export type CompleteSignupStepPayload = EventPayload<{
    current_step: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    companyName: string;
    companyWebsite: string;
    companySize: string;
}>;

export const CompleteSignupStep = (trigger: TriggerEvent, value?: CompleteSignupStepPayload) =>
    trigger(COMPLETE_SIGNUP_STEP, value);

export type CompleteSignupStep = typeof CompleteSignupStep;

CompleteSignupStep.eventName = <typeof COMPLETE_SIGNUP_STEP>COMPLETE_SIGNUP_STEP;
