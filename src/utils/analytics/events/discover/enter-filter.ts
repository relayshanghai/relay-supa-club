import type { EventPayload, TriggerEvent } from '../../types';

/**
 * Previously as 
 * // Search Filter Modal, Set influencer location filter
//                                       ^- bug: should be audience location filter
// Search Filter Modal, Set audience lower age filter limit
// Search Filter Modal, Set audience upper age filter limit
// Search Filter Modal, Set audience age filter weight
// Search Filter Modal, Set audience gender filter
// Search Filter Modal, Set audience gender filter weight
// Search Filter Modal, Set influencer gender filter
// Search Filter Modal, Set influencer gender filter weight
// Search Filter Modal, Set influencer gender filter parameters
// Search Filter Modal, Set influencer location filter
// Search Filter Modal, Set influencer subscribers filter lower limit
// Search Filter Modal, Set influencer subscribers filter upper limit
// Search Filter Modal, change engagement rate
// Search Filter Modal, Set influencer views filter lower limit
// Search Filter Modal, Set influencer views filter upper limit
// Search Filter Modal, Set influencer last post filter
 */
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
