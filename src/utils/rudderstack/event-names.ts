/**
 * Generates "events" that accepts a parameter to generate a custom event name
 *
 * @example
 *  ```ts
 *  generateEventName('My Event')('foo') // "My Event, foo"
 *  ```
 *
 *  This is creates dynamic event names which is not recommended by Mixpanel
 *
 *  @see https://docs.mixpanel.com/docs/tracking/how-tos/events-and-properties#avoid-creating-event-or-property-names-dynamically
 *
 *  @todo merge with src/utils/analytics/events
 */
const generateEventName =
    (prefix: string) =>
    (details?: string): string =>
        `${prefix}, ${details}`;

// Onboarding
export const LANDING_PAGE = generateEventName('Landing Page');
// Landing Page, clicked on start free trial
// Landing Page, clicked on switch
// Landing Page, go to Login Page

export const SIGNUP_WIZARD = generateEventName('Signup Wizard');
// Signup Wizard, step-5, start free trial
// Signup Wizard, Pricing Section, click to toggle monthly or quarterly
// Signup Wizard, Pricing Section, click to select DIY Max
// Signup Wizard, Pricing Section, click to select DIY

export const SIGNUP = generateEventName('Signup');
// Signup, step-<number>
// Signup, Start free trial success
// Signup, Start free trial failed
// Signup, check Terms and Conditions
// Signup, open Terms and Conditions
// Signup, Sign out from free trial page

// Discovery
export const CAMPAIGN_INFLUENCER_ROW = generateEventName('Campaign Influencer Row');
// Campaign Influencer Row, open social link

export const ANALYZE_PAGE = generateEventName('Analyze Page');
// Analyze Page, Similar Influencer Section, open report
// Analyze Page, add to campaign

export const SEARCH_FILTER_MODAL = generateEventName('Search Filter Modal');
// Search Filter Modal, Clear search filters
// Search Filter Modal, Open search filter modal
// Search Filter Modal, Close search filter modal
// Search Filter Modal, Set influencer location filter
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

export const SEARCH_OPTIONS = generateEventName('Search Options');
// Search Options, Set keyword
// Search Options, Set hashtag
// Search Options, Set topics
// Search Options, change platform
// Search Options, search topics

export const SEARCH_RESULT = generateEventName('Search Result');
// Search Result, load more

export const SEARCH_RESULT_ROW = generateEventName('Search Result Row');
// Search Result Row, add to campaign
// Search Result Row, open report
// Search Result Row, open social link

export const SEARCH_TOPICS_INPUT = generateEventName('Search Topics Input');
// Search Topics Input, remove a tag
// Search Topics Input, add a tag

export const WORD_CLOUD_COMPONENT = generateEventName('Word Cloud Component');
// Word Cloud Component, Added tag from wordcloud
// Word Cloud Component, Removed tag from wordcloud

// Campaigns
export const CAMPAIGN_BANNER = generateEventName('Campaign Banner');
// Campaign Banner, change status
// Campaign Banner, archive campaign
// Campaign Banner, unarchive campaign
// Campaign Banner, edit campaign

export const CAMPAIGN_FORM = generateEventName('Campaign Form');
// Campaign Form, create new campaign

export const INFLUENCER_TABLE = generateEventName('Influencer Table');
// Influencer Table, tab status changed
// Influencer Table, influencer status changed
// Influencer Table, inline edit clicked
// Influencer Table, notes opened
// Influencer Table, move influencer modal opened
// Influencer Table, manage influencer modal opened
// Influencer Table, add post modal opened
// Influencer Table, influencer deleted
// Influencer Table, click on add new influencer
// Influencer Table, click on add sales

export const CAMPAIGN_MODAL_CARD = generateEventName('Campaign Modal Card');
// Campaign Modal Card, added creator to campaign

// AI Email Generator
export const AI_EMAIL_GENERATOR = generateEventName('AI Email Generator');
// AI Email Generator, regenerate email
// AI Email Generator, regenerate subject
// AI Email Generator, generate email and subject
// AI Email Generator, copy subject line
// AI Email Generator, copy email

// Account
export const ACCOUNT_COMPANY_DETAILS = generateEventName('Account, CompanyDetails');
// Account, CompanyDetails, send invite
// Account, CompanyDetails, mark an invited email as admin
// Account, CompanyDetails, update company
// Account, CompanyDetails, click on Edit
// Account, CompanyDetails, open addMoreMembers modal

export const ACCOUNT_PERSONAL_DETAILS = generateEventName('Account, PersonalDetails');
// Account, PersonalDetails, click on change password
// Account, PersonalDetails, update profile name
// Account, PersonalDetails, update email
// Account, PersonalDetails, click on Edit

export const ACCOUNT_SUBSCRIPTION = generateEventName('Account, Subscription');
// Account, Subscription, open cancel subscription modal
// Account, Subscription, View billing portal
// Account, Subscription, click upgrade subscription and go to pricing page

export const PRICING_PAGE = generateEventName('Pricing Page');
// Pricing Page, clicked on upgrade

export const PAYMENT_PAGE = generateEventName('Payment Page');
// Payment Page, Click on Upgrade
// Payment Page, click on card option
// Payment Page, click on alipay option
// Payment Page, Upgrade Subscription Success

// Guide
export const GUIDE_PAGE = generateEventName('Guide Page');
// Guide Page, closed modal
// Guide Page, navigate to page
// Guide Page, modal opened
// Guide Page, opened
// Guide Page, tutorial video played
// Guide Page, tutorial video paused
// Guide Page, tutorial video ended
// Guide Page, tutorial video seeked

// Modals
export const ALREADY_ADDED_MODAL = generateEventName('Already Added Modal');
// Already Added Modal, click do not add
// Already Added Modal, click add anyway

export const CANCEL_SUBSCRIPTION_MODAL = generateEventName('Cancel Subscription Modal');
// Cancel Subscription Modal, canceled subscription
// Cancel Subscription Modal, renewed subscription

export const MANAGE_POSTS_MODAL = generateEventName('Manage Posts Modal');
// Manage Posts Modal, add another post
// Manage Posts Modal, submit
// Manage Posts Modal, remove post

// Navigation
export const NAVBAR = generateEventName('Navbar');
// Navbar, Hamburger Menu Clicked

export const LANGUAGE_TOGGLE = generateEventName('Language Toggle');
// Language Toggle, Clicked
// Language Toggle, switch to en-US
// Language Toggle, switch to zh-CN

// OTHERS
// Log In, undefined (not in Product-Analytics-Framework)
// Log Out, undefined

// OTHERS from `trackSearch()`
// Search Options, Search
// Search Filters Modal, Search
