import type { TriggerEvent } from '../types';
import type { CurrentPageEvent } from './current-pages';

export const SIGNUP_STARTED = 'Signup Started';

export type SignupStartedPayload = {
    currentPage: CurrentPageEvent;
};

export const SignupStarted = (trigger: TriggerEvent, value?: SignupStartedPayload) =>
    trigger(SIGNUP_STARTED, { ...value });

SignupStarted.eventName = <typeof SIGNUP_STARTED>SIGNUP_STARTED;
