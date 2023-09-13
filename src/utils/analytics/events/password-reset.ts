import type { TriggerEvent } from '../types';
import type { CurrentPageEvent } from './current-pages';

export const PASSWORD_RESET = 'Password Reset';

export type PasswordResetPayload = {
    currentPage: CurrentPageEvent;
};

export const PasswordReset = (trigger: TriggerEvent, value?: PasswordResetPayload) =>
    trigger(PASSWORD_RESET, { ...value });

PasswordReset.eventName = <typeof PASSWORD_RESET>PASSWORD_RESET;
