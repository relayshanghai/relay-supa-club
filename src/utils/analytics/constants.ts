export const JOURNEY_COOKIE_NAME = '__relay_journey';
export const ANALYTICS_COOKIE_ANON = '__anon_id';
export const ANALYTICS_HEADER_NAME = 'x-analytics-anon-id';

/**
 * Mixpanel properties
 *
 *  These properties should be set in Rudderstack's dashboard
 *
 *  `Collect > Destinations > Mixpanel > Configuration > Traits to set as People Properties`
 *
 * @see https://www.rudderstack.com/docs/destinations/streaming-destinations/mixpanel/#explicitly-setting-people-properties-and-super-properties
 */
export enum MixpanelPeopleProps {
    total_sessions = 'total_sessions',
    total_searches = 'total_searches',
    total_reports = 'total_reports',
    total_sequence_influencers = 'total_sequence_influencers',
    total_emails_sent = 'total_emails_sent',
}

/**
 * Incrementable Mixpanel People Properties
 *
 *  These properties should be set in Rudderstack's dashboard
 *
 *  `Collect > Destinations > Mixpanel > Configuration > Properties to increment in People`
 *
 * @see https://www.rudderstack.com/docs/destinations/streaming-destinations/mixpanel/#incrementing-properties-in-mixpanel-people
 */
export type MixpanelPeoplePropsInc =
    | MixpanelPeopleProps.total_sessions
    | MixpanelPeopleProps.total_searches
    | MixpanelPeopleProps.total_reports
    | MixpanelPeopleProps.total_sequence_influencers
    | MixpanelPeopleProps.total_emails_sent;
