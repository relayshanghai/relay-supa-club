import type { EventPayload, TriggerEvent } from '../../types';

export const ENTER_FILTER = 'Enter Filter';

export type EnterFilterPayload = EventPayload<{
    filter_type: 'Audience' | 'Influencer';
    filter_name: string;
    values: string;
    batch_id: number;
}>;

export const EnterFilter = (trigger: TriggerEvent, value?: EnterFilterPayload) => trigger(ENTER_FILTER, value);

export type EnterFilter = typeof EnterFilter;

EnterFilter.eventName = <typeof ENTER_FILTER>ENTER_FILTER;
