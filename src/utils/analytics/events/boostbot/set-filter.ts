import type { EventPayload, TriggerEvent } from '../../types';
import type { CurrentPageEvent } from '../current-pages';

export const SET_BOOSTBOT_FILTER = 'Set BoostBot Filter';

export type SetBoostbotFilterPayload = EventPayload<{
    currentPage: CurrentPageEvent;
    name: string;
    key: string;
    value: string;
    batch_id: number;
}>;

export const SetBoostbotFilter = (trigger: TriggerEvent, value?: SetBoostbotFilterPayload) =>
    trigger(SET_BOOSTBOT_FILTER, value);

export type SetBoostbotFilter = typeof SetBoostbotFilter;

SetBoostbotFilter.eventName = <typeof SET_BOOSTBOT_FILTER>SET_BOOSTBOT_FILTER;
