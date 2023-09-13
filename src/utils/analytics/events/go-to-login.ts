import type { TriggerEvent } from '../types';
import type { CurrentPageEvent } from './current-pages';

export const GO_TO_LOGIN = 'Go To Login';

export type GoToLoginPayload = {
    currentPage: CurrentPageEvent;
};

export const GoToLogin = (trigger: TriggerEvent, value?: GoToLoginPayload) => trigger(GO_TO_LOGIN, { ...value });

GoToLogin.eventName = <typeof GO_TO_LOGIN>GO_TO_LOGIN;
