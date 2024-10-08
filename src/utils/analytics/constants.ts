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
    email = 'email',
    firstName = 'firstName',
    lastName = 'lastName',
    userRole = 'userRole',
    company = 'company',
    companyId = 'companyId',
    companyName = 'companyName',
    number = 'number',
    lang = 'lang',
    paidUserSince = 'paidUserSince',
    subscriptionStatus = 'subscriptionStatus',
    subscriptionPlan = 'subscriptionPlan',
    total_sessions = 'total_sessions',
    total_classic_searches = 'total_classic_searches',
    total_boostbot_searches = 'total_boostbot_searches',
    total_reports = 'total_reports',
    total_sequence_influencers = 'total_sequence_influencers',
    total_emails_sent = 'total_emails_sent',
    user_open_count = 'user_open_count',
    user_play_count = 'user_play_count',
    sequence_open_count = 'sequence_open_count',
    created_at = 'createdAt',
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
    | MixpanelPeopleProps.total_classic_searches
    | MixpanelPeopleProps.total_boostbot_searches
    | MixpanelPeopleProps.total_reports
    | MixpanelPeopleProps.total_sequence_influencers
    | MixpanelPeopleProps.total_emails_sent
    | MixpanelPeopleProps.user_open_count
    | MixpanelPeopleProps.user_play_count
    | MixpanelPeopleProps.sequence_open_count;
