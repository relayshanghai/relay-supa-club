const generateEventName =
    (prefix: string) =>
    (details?: string): string =>
        `${prefix}, ${details}`;

// Onboarding
export const LANDING_PAGE = generateEventName('Landing Page');
export const SIGNUP_WIZARD = generateEventName('Signup Wizard');
export const CAROUSEL = generateEventName('Carousel');
export const SIGNUP = generateEventName('Signup');

// Discovery
export const CAMPAIGN_INFLUENCER_ROW = generateEventName('Campaign Influencer Row');
export const ANALYZE_PAGE = generateEventName('Analyze Page');
export const SEARCH_FILTER_MODAL = generateEventName('Search Filter Modal');
export const SEARCH_OPTIONS = generateEventName('Search Options');
export const SEARCH_RESULT = generateEventName('Search Result');
export const SEARCH_RESULT_ROW = generateEventName('Search Result Row');
export const SEARCH_TOPICS_INPUT = generateEventName('Search Topics Input');
export const WORD_CLOUD_COMPONENT = generateEventName('Word Cloud Component');

// Campaigns
export const CAMPAIGN_BANNER = generateEventName('Campaign Banner');
export const CAMPAIGN_FORM = generateEventName('Campaign Form');
export const INFLUENCER_TABLE = generateEventName('Influencer Table');
export const CAMPAIGN_MODAL_CARD = generateEventName('Campaign Modal Card');

// AI Email Generator
export const AI_EMAIL_GENERATOR = generateEventName('AI Email Generator');

// Account
export const ACCOUNT_COMPANY_DETAILS = generateEventName('Account, CompanyDetails');
export const ACCOUNT_PERSONAL_DETAILS = generateEventName('Account, PersonalDetails');
export const ACCOUNT_SUBSCRIPTION = generateEventName('Account, Subscription');
export const PRICING_PAGE = generateEventName('Pricing Page');
export const PAYMENT_PAGE = generateEventName('Payment Page');

// Guide
export const GUIDE_PAGE = generateEventName('Guide Page');

// Modals
export const ALREADY_ADDED_MODAL = generateEventName('Already Added Modal');
export const CANCEL_SUBSCRIPTION_MODAL = generateEventName('Cancel Subscription Modal');
export const MANAGE_POSTS_MODAL = generateEventName('Manage Posts Modal');

// Navigation
export const NAVBAR = generateEventName('Navbar');
export const LANGUAGE_TOGGLE = generateEventName('Language Toggle');
export const LOG_IN = generateEventName('Log In');
export const LOG_OUT = generateEventName('Log Out');
