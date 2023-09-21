import type { EventPayload, TriggerEvent } from '../../types';

export const CLEAR_FILTERS = 'Clear Filters';

export type ClearFiltersPayload = EventPayload<{
    batch_id: number;
}>;

export const ClearFilters = (trigger: TriggerEvent, value?: ClearFiltersPayload) => trigger(CLEAR_FILTERS, value);

export type ClearFilters = typeof ClearFilters;

ClearFilters.eventName = <typeof CLEAR_FILTERS>CLEAR_FILTERS;
