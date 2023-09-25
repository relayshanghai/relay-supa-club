import type { EventPayload, TriggerEvent } from '../types';

export const CHANGE_PASSWORD = 'Change Password';

export type ChangePasswordPayload = EventPayload<unknown>;

export const ChangePassword = (trigger: TriggerEvent, value?: ChangePasswordPayload) =>
    trigger(CHANGE_PASSWORD, { ...value });

export type ChangePassword = typeof ChangePassword;

ChangePassword.eventName = <typeof CHANGE_PASSWORD>CHANGE_PASSWORD;
