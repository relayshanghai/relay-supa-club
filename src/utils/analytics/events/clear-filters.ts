import type { TriggerEvent } from '../types';
import type { CurrentPageEvent } from './current-pages';

export const CLEAR_FILTERS = 'Clear Filters';

export type ClearFiltersPayload = {
    currentPage: CurrentPageEvent;
};

export const ClearFilters = (trigger: TriggerEvent, value?: ClearFiltersPayload) =>
    trigger(CLEAR_FILTERS, { ...value });

ClearFilters.eventName = <typeof CLEAR_FILTERS>CLEAR_FILTERS;
