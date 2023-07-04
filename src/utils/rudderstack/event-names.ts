const generateEventName =
    (prefix: string) =>
    (details: string): string =>
        `${prefix}, ${details}`;

// Onboarding
export const LANDING_PAGE = generateEventName('Landing Page');
export const SIGNUP_WIZARD = generateEventName('Signup Wizard');

// AI Email Generator
export const AI_EMAIL_GENERATOR = generateEventName('AI Email Generator');

// Campaigns
export const CAMPAIGN_BANNER = generateEventName('Campaign Banner');
export const CAMPAIGN_FORM = generateEventName('Campaign Form');

// Account
export const ACCOUNT_COMPANY_DETAILS = generateEventName('Account, CompanyDetails');
export const ACCOUNT_PERSONAL_DETAILS = generateEventName('Account, PersonalDetails');
export const ACCOUNT_SUBSCRIPTION = generateEventName('Account, Subscription');

// Modals
export const ALREADY_ADDED_MODAL = generateEventName('Already Added Modal');
export const CANCEL_SUBSCRIPTION_MODAL = generateEventName('Cancel Subscription Modal');
export const MANAGE_POSTS_MODAL = generateEventName('Manage Posts Modal');
