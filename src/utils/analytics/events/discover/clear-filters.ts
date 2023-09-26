import type { EventPayload, TriggerEvent } from '../../types';

export const CLEAR_FILTERS = 'Search Filter Modal, Clear search filters'; // use old name and update view name in mixpanel to 'Clear Filters'

export type ClearFiltersPayload = EventPayload<{
    batch_id: number;
}>;

export const ClearFilters = (trigger: TriggerEvent, value?: ClearFiltersPayload) => trigger(CLEAR_FILTERS, value);

export type ClearFilters = typeof ClearFilters;

ClearFilters.eventName = <typeof CLEAR_FILTERS>CLEAR_FILTERS;
