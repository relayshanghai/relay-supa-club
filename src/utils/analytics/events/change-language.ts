import type { EventPayload, TriggerEvent } from '../types';

export const CHANGE_LANGUAGE = 'Change Language';

export type ChangeLanguagePayload = EventPayload<{
    current_language: string;
    selected_language: string;
}>;

export const ChangeLanguage = (trigger: TriggerEvent, value?: ChangeLanguagePayload) => trigger(CHANGE_LANGUAGE, value);

export type ChangeLanguage = typeof ChangeLanguage;

ChangeLanguage.eventName = <typeof CHANGE_LANGUAGE>CHANGE_LANGUAGE;
