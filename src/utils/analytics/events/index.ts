import { z } from 'zod';
import type { TrackedEvent } from '../types';
import type { AnalyzeAddToCampaignPayload } from './analyze-add_to_campaign';
import { ANALYZE_ADD_TO_CAMPAIGN, AnalyzeAddToCampaign } from './analyze-add_to_campaign';
import type { AnalyzeOpenExternalSocialProfilePayload } from './analyze-open_external_social_profile';
import {
    ANALYZE_OPEN_EXTERNAL_SOCIAL_PROFILE,
    AnalyzeOpenExternalSocialProfile,
} from './analyze-open_external_social_profile';
import type { BoostbotAnalyzeInfluencerPayload } from './boostbot-analyze-influencer';
import { BOOSTBOT_ANALYZE_INFLUENCER, BoostbotAnalyzeInfluencer } from './boostbot-analyze-influencer';
import type { RecommendInfluencersPayload } from './boostbot/recommend-influencers';
import { BOOSTBOT_RECOMMEND_INFLUENCERS, RecommendInfluencers } from './boostbot/recommend-influencers';
import type { SendInfluencersToOutreachPayload } from './boostbot/send-influencers-to-outreach';
import {
    BOOSTBOT_SEND_INFLUENCERS_TO_OUTREACH,
    SendInfluencersToOutreach,
} from './boostbot/send-influencers-to-outreach';
import type { UnlockInfluencersPayload } from './boostbot/unlock-influencer';
import { BOOSTBOT_UNLOCK_INFLUENCERS, UnlockInfluencers } from './boostbot/unlock-influencer';
import type { ChangePagePayload } from './change-page';
import { CHANGE_PAGE, ChangePage } from './change-page';
import type { OpenSocialProfilePayload } from './open-social-profle';
import { OPEN_SOCIAL_PROFILE, OpenSocialProfile } from './open-social-profle';
import type { OpenAnalyzeProfilePayload } from './open-analyze-profle';
import { OPEN_ANALYZE_PROFILE, OpenAnalyzeProfile } from './open-analyze-profle';
import type { OpenSocialThumbnailsPayload } from './open-social-thumbnails';
import { OPEN_SOCIAL_THUMBNAILS, OpenSocialThumbnails } from './open-social-thumbnails';
import type { OpenVideoGuideModalPayload } from './boostbot/open-video-guide-modal';
import { BOOSTBOT_OPEN_VIDEO_GUIDE_MODAL, OpenVideoGuideModal } from './boostbot/open-video-guide-modal';
import type { CreateSequencePayload } from './outreach/create-sequence';
import { CreateSequence, OUTREACH_CREATE_SEQUENCE } from './outreach/create-sequence';
import type { EmailClickedPayload } from './outreach/email-clicked';
import { EmailClicked, OUTREACH_EMAIL_CLICKED } from './outreach/email-clicked';
import type { EmailComplaintPayload } from './outreach/email-complaint';
import { EmailComplaint, OUTREACH_EMAIL_COMPLAINT } from './outreach/email-complaint';
import type { EmailFailedPayload } from './outreach/email-failed';
import { EmailFailed, OUTREACH_EMAIL_FAILED } from './outreach/email-failed';
import type { EmailOpenedPayload } from './outreach/email-opened';
import { EmailOpened, OUTREACH_EMAIL_OPENED } from './outreach/email-opened';
import type { EmailReplyPayload } from './outreach/email-reply';
import { EmailReply, OUTREACH_EMAIL_REPLY } from './outreach/email-reply';
import type { EmailSentPayload } from './outreach/email-sent';
import { EmailSent, OUTREACH_EMAIL_SENT } from './outreach/email-sent';
import type { StartSequenceForInfluencerPayload } from './outreach/start-sequence-for-influencer';
import {
    OUTREACH_START_SEQUENCE_FOR_INFLUENCER,
    StartSequenceForInfluencer,
} from './outreach/start-sequence-for-influencer';
import type { SearchPayload } from './search';
import { SEARCH as SEARCH_KEY, Search } from './search';
import type { SearchAddToCampaignPayload } from './search-add_to_campaign';
import { SEARCH_ADD_TO_CAMPAIGN, SearchAddToCampaign } from './search-add_to_campaign';
import type { SearchAnalyzeInfluencerPayload } from './search-analyze-influencer';
import { SEARCH_ANALYZE_INFLUENCER, SearchAnalyzeInfluencer } from './search-analyze-influencer';
import type { SearchDefaultPayload } from './search-default';
import { SEARCH_DEFAULT, SearchDefault } from './search-default';
import type { SearchLoadMoreResultsPayload } from './search-load_more_results';
import { SEARCH_LOAD_MORE_RESULTS, SearchLoadMoreResults } from './search-load_more_results';
import type { SearchOpenExternalSocialProfilePayload } from './search-open_external_social_profile';
import {
    SEARCH_OPEN_EXTERNAL_SOCIAL_PROFILE,
    SearchOpenExternalSocialProfile,
} from './search-open_external_social_profile';
import type { WebhookErrorPayload } from './outreach/email-error';
import { OUTREACH_WEBHOOK_ERROR, WebhookError } from './outreach/email-error';
import type { EmailNewPayload } from './outreach/email-new';
import { EmailNew, OUTREACH_EMAIL_NEW } from './outreach/email-new';
import type { StopBoostbotPayload } from './stop-boostbot';
import { STOP_BOOSTBOT, StopBoostbot } from './stop-boostbot';
import type { HoverTooltipPayload } from './hover-tooltip';
import { HOVER_TOOLTIP, HoverTooltip } from './hover-tooltip';
import type { ClickNeedHelpPayload } from './click-need-help';
import { CLICK_NEED_HELP, ClickNeedHelp } from './click-need-help';
import type { GoToLoginPayload } from './go-to-login';
import { GO_TO_LOGIN, GoToLogin } from './go-to-login';
import type { OpenAccountModalPayload } from './open-account-modal';
import { OPEN_ACCOUNT_MODAL, OpenAccountModal } from './open-account-modal';
import type { NavigateToPagePayload } from './navigate-to-page';
import { NAVIGATE_TO_PAGE, NavigateToPage } from './navigate-to-page';
import type { SignupStartedPayload } from './signup-started';
import { SIGNUP_STARTED, SignupStarted } from './signup-started';
import type { OpenSequencePayload } from './outreach/sequence-open';
import { OPEN_SEQUENCE, OpenSequence } from './outreach/sequence-open';
import type { PasswordResetPayload } from './password-reset';
import { PASSWORD_RESET, PasswordReset } from './password-reset';
import type { DeleteSequencePayload } from './outreach/sequence-delete';
import { DELETE_SEQUENCE, DeleteSequence } from './outreach/sequence-delete';
import type { EnterInfluencerEmailPayload } from './outreach/enter-influencer-email';
import { ENTER_INFLUENCER_EMAIL, EnterInfluencerEmail } from './outreach/enter-influencer-email';
import { OpenEmailThread, OPEN_EMAIL_THREAD, type OpenEmailThreadPayload } from './open-email-thread';
import type { ViewSequenceTemplatesPayload } from './outreach/view-sequence-templates';
import { VIEW_SEQUENCE_TEMPLATES, ViewSequenceTemplates } from './outreach/view-sequence-templates';
import type { UpdateTemplateVariablePayload } from './outreach/update-template-variable';
import { UPDATE_TEMPLATE_VARIABLE, UpdateTemplateVariable } from './outreach/update-template-variable';
import type { SaveTemplateVariableUpdatesPayload } from './outreach/save-template-variable-updates';
import { SAVE_TEMPLATE_VARIABLE_UPDATES, SaveTemplateVariableUpdates } from './outreach/save-template-variable-updates';
import type { InputPaymentInfoPayload } from './onboarding/input-payment-info';
import { INPUT_PAYMENT_INFO, InputPaymentInfo } from './onboarding/input-payment-info';
import type { OpenGuideSectionModalPayload } from './guide/open-guide-section-modal';
import { OPEN_GUIDE_SECTION_MODAL, OpenGuideSectionModal } from './guide/open-guide-section-modal';
import type { ExpandHelpSectionPayload } from './guide/expand-help-section';
import { EXPAND_HELP_SECTION, ExpandHelpSection } from './guide/expand-help-section';
import type { ChangeLanguagePayload } from './change-language';
import { CHANGE_LANGUAGE, ChangeLanguage } from './change-language';
import type { StripeWebhookIncomingPayload } from './stripe/stripe-webhook-incoming';
import { STRIPE_WEBHOOK_INCOMING, StripeWebhookIncoming } from './stripe/stripe-webhook-incoming';
import type { StripeWebhookErrorPayload } from './stripe/stripe-webhook-error';
import { STRIPE_WEBHOOK_ERROR, StripeWebhookError } from './stripe/stripe-webhook-error';
import type { StripeWebhookPaymentFailedPayload } from './stripe/stripe-webhook-payment-failed';
import { STRIPE_WEBHOOK_PAYMENT_FAILED, StripeWebhookPaymentFailed } from './stripe/stripe-webhook-payment-failed';
import type { SendEmailReplyPayload } from './send-email-reply';
import { SEND_EMAIL_REPLY, SendEmailReply } from './send-email-reply';
import type { NavigateSignupCarousalPayload } from './onboarding/navigate-signup-carousal';
import { NAVIGATE_SIGNUP_CAROUSAL, NavigateSignupCarousal } from './onboarding/navigate-signup-carousal';
import type { OpenFiltersModalPayload } from './discover/open-filters-modal';
import { OPEN_FILTERS_MODAL, OpenFiltersModal } from './discover/open-filters-modal';
import type { EnterFilterPayload } from './discover/enter-filter';
import { ENTER_FILTER, EnterFilter } from './discover/enter-filter';
import type { ClearFiltersPayload } from './discover/clear-filters';
import { CLEAR_FILTERS, ClearFilters } from './discover/clear-filters';
import type { SearchInfluencerByNamePayload } from './discover/search-influencer-by-name';
import { SEARCH_INFLUENCER_BY_NAME, SearchInfluencerByName } from './discover/search-influencer-by-name';
import type { OpenBoostbotFiltersModalPayload } from './boostbot/open-filters-modal';
import { OPEN_BOOSTBOT_FILTERS_MODAL, OpenBoostbotFiltersModal } from './boostbot/open-filters-modal';
import type { SetBoostbotFilterPayload } from './boostbot/set-filter';
import { SET_BOOSTBOT_FILTER, SetBoostbotFilter } from './boostbot/set-filter';
import type { ChangeSequenceTabPayload } from './outreach/change-sequence-tab';
import { CHANGE_SEQUENCE_TAB, ChangeSequenceTab } from './outreach/change-sequence-tab';
import type { ToggleAutoStartPayload } from './outreach/toggle-auto-start';
import { TOGGLE_AUTO_START, ToggleAutoStart } from './outreach/toggle-auto-start';
import type { OpenInfluencerProfilePayload } from './outreach/open-influencer-profile';
import { OPEN_INFLUENCER_PROFILE, OpenInfluencerProfile } from './outreach/open-influencer-profile';
import type { UpdateInfluencerProfilePayload } from './outreach/update-influencer-profile';
import { UpdateInfluencerProfile, UPDATE_INFLUENCER_PROFILE } from './outreach/update-influencer-profile';
import type { AddInfluencerPostPayload } from './outreach/add-influencer-post';
import { ADD_INFLUENCER_POST, AddInfluencerPost } from './outreach/add-influencer-post';
import type { AddNoteToInfluencerProfilePayload } from './outreach/add-note-to-influencer-profile';
import { ADD_NOTE_TO_INFLUENCER_PROFILE, AddNoteToInfluencerProfile } from './outreach/add-note-to-influencer-profile';
import type { UpdateInfluencerStatusPayload } from './outreach/update-influencer-status';
import { UPDATE_INFLUENCER_STATUS, UpdateInfluencerStatus } from './outreach/update-influencer-status';
import type { FilterSequenceInfluencersPayload } from './outreach/filter-sequence-influencers';
import { FILTER_SEQUENCE_INFLUENCERS, FilterSequenceInfluencers } from './outreach/filter-sequence-influencers';
import type { SearchInfluencerManagerPayload } from './outreach/search-influencer-manager';
import { SEARCH_INFLUENCER_MANAGER, SearchInfluencerManager } from './outreach/search-influencer-manager';
import type { FilterInfluencerManagerPayload } from './outreach/filter-influencer-manager';
import { FILTER_INFLUENCER_MANAGER, FilterInfluencerManager } from './outreach/filter-influencer-manager';
import type { GoToInboxPayload } from './outreach/go-to-inbox';
import { GO_TO_INBOX, GoToInbox } from './outreach/go-to-inbox';
import type { ToggleViewMinePayload } from './outreach/toggle-view-mine';
import { TOGGLE_VIEW_MINE, ToggleViewMine } from './outreach/toggle-view-mine';
import { type SaveInfluencerProfileUpdatesPayload } from './outreach/save-influencer-profile-updates';
import {
    SAVE_INFLUENCER_PROFILE_UPDATES,
    SaveInfluencerProfileUpdates,
} from './outreach/save-influencer-profile-updates';
import type { PlayTutorialVideoPayload } from './guide/play-tutorial-video';
import { PLAY_TUTORIAL_VIDEO, PlayTutorialVideo } from './guide/play-tutorial-video';
import type { CloseHelpModalPayload } from './outreach/close-help-modal';
import { CloseHelpModal, CLOSE_HELP_MODAL } from './outreach/close-help-modal';
import type { ViewInfluencerProfileNotesPayload } from './outreach/view-influencer-profile-notes';
import { ViewInfluencerProfileNotes, VIEW_INFLUENCER_PROFILE_NOTES } from './outreach/view-influencer-profile-notes';
import type { SelectInfluencerProfileTabPayload } from './outreach/select-influencer-profile-tab';
import { SelectInfluencerProfileTab, SELECT_INFLUENCER_PROFILE_TAB } from './outreach/select-influencer-profile-tab';
import type { SearchInboxPayload } from './outreach/search-inbox';
import { SearchInbox, SEARCH_INBOX } from './outreach/search-inbox';
import type { PayForUpgradedPlanPayload } from './onboarding/pay-for-upgraded-plan';
import { PAY_FOR_UPGRADED_PLAN, PayForUpgradedPlan } from './onboarding/pay-for-upgraded-plan';
import type { UpdateProfileInfoPayload } from './update-profile-info';
import { UPDATE_PROFILE_INFO, UpdateProfileInfo } from './update-profile-info';
import type { ChangePasswordPayload } from './change-password';
import { CHANGE_PASSWORD, ChangePassword } from './change-password';
import type { BatchStartSequencePayload } from './outreach/batch-start-sequence';
import { BATCH_START_SEQUENCE, BatchStartSequence } from './outreach/batch-start-sequence';
import type { VisitPagePayload } from './visit-page';
import { VISIT_PAGE, VisitPage } from './visit-page';
import type { CompleteSignupStepPayload } from './onboarding/complete-signup-step';
import { COMPLETE_SIGNUP_STEP, CompleteSignupStep } from './onboarding/complete-signup-step';
import type { ChangeInboxFolderPayload } from './change-inbox-folder';
import { CHANGE_INBOX_FOLDER, ChangeInboxFolder } from './change-inbox-folder';
import type { ChangeTemplatePreviewPayload } from './change-template-preview';
import { CHANGE_TEMPLATE_PREVIEW, ChangeTemplatePreview } from './change-template-preview';
import type { ToggleNavbarSizePayload } from './toggle-navbar-size';
import { TOGGLE_NAVBAR_SIZE, ToggleNavbarSize } from './toggle-navbar-size';
import type { LandingPageStartFreeTrialClickedPayload } from './landing-page-start-free-trial-clicked';
import {
    LANDING_PAGE_START_FREE_TRIAL_CLICKED,
    LandingPageStartFreeTrialClicked,
} from './landing-page-start-free-trial-clicked';
import {
    type SignupWizardStep5StartFreeTrialPayload,
    SIGNUP_WIZARD_STEP_5_START_FREE_TRIAL,
    SignupWizardStep5StartFreeTrial,
} from './signup wizard/signup-wizard-step-5-start-free-trial';
import {
    type PricingSectionToggleMonthlyOrQuarterlyPayload,
    PRICING_SECTION_TOGGLE_MONTHLY_OR_QUARTERLY,
    PricingSectionToggleMonthlyOrQuarterly,
} from './signup wizard/pricing-section-toggle-monthly-or-quarterly';
import {
    type PricingSectionSelectDiyPayload,
    PRICING_SECTION_SELECT_DIY,
    PricingSectionSelectDiy,
} from './signup wizard/pricing-section-select-diy';
import {
    type PricingSectionSelectDiyMaxPayload,
    PRICING_SECTION_SELECT_DIY_MAX,
    PricingSectionSelectDiyMax,
} from './signup wizard/pricing-section-select-diy-max';
import {
    type SignupStartFreeTrialSuccessPayload,
    SIGNUP_START_FREE_TRIAL_SUCCESS,
    SignupStartFreeTrialSuccess,
} from './signup/signup-start-free-trial-success';
import {
    type SignupStartFreeTrialFailedPayload,
    SIGNUP_START_FREE_TRIAL_FAILED,
    SignupStartFreeTrialFailed,
} from './signup/signup-start-free-trial-failed';
import {
    type SignupCheckTermsAndConditionsPayload,
    SIGNUP_CHECK_TERMS_AND_CONDITIONS,
    SignupCheckTermsAndConditions,
} from './signup/signup-check-terms-and-conditions';
import {
    type SignupOpenTermsAndConditionsPayload,
    SIGNUP_OPEN_TERMS_AND_CONDITIONS,
    SignupOpenTermsAndConditions,
} from './signup/signup-open-terms-and-conditions';
import {
    type SignupSignOutFromFreeTrialPagePayload,
    SIGNUP_SIGN_OUT_FROM_FREE_TRIAL_PAGE,
    SignupSignOutFromFreeTrialPage,
} from './signup/signup-sign-out-from-free-trial-page';
import {
    type CampaignInfluencerRowOpenSocialLinkPayload,
    CAMPAIGN_INFLUENCER_ROW_OPEN_SOCIAL_LINK,
    CampaignInfluencerRowOpenSocialLink,
} from './campaign-influencer-row-open-social-link';
import {
    type OpenSimilarInfluencerReportPayload,
    OPEN_SIMILAR_INFLUENCER_REPORT,
    OpenSimilarInfluencerReport,
} from './open-similar-influencer-report';
import {
    type AnalyzePageAddToCampaignPayload,
    ANALYZE_PAGE_ADD_TO_CAMPAIGN,
    AnalyzePageAddToCampaign,
} from './analyze-page-add-to-campaign';
import {
    type CloseSearchFilterModalPayload,
    CLOSE_SEARCH_FILTER_MODAL,
    CloseSearchFilterModal,
} from './close-search-filter-modal';
import {
    type SearchOptionsSetHashtagPayload,
    SEARCH_OPTIONS_SET_HASHTAG,
    SearchOptionsSetHashtag,
} from './search options/search-options-set-hashtag';
import {
    type SearchOptionsSetKeywordPayload,
    SEARCH_OPTIONS_SET_KEYWORD,
    SearchOptionsSetKeyword,
} from './search options/search-options-set-keyword';
import {
    type SearchOptionsSetTopicsPayload,
    SEARCH_OPTIONS_SET_TOPICS,
    SearchOptionsSetTopics,
} from './search options/search-options-set-topics';
import {
    type SearchOptionsSearchTopicsPayload,
    SEARCH_OPTIONS_SEARCH_TOPICS,
    SearchOptionsSearchTopics,
} from './search options/search-options-search-topics';
import {
    type SearchOptionsChangePlatformPayload,
    SEARCH_OPTIONS_CHANGE_PLATFORM,
    SearchOptionsChangePlatform,
} from './search options/search-options-change-platform';
import {
    type SearchTopicsInputAddTagPayload,
    SEARCH_TOPICS_INPUT_ADD_TAG,
    SearchTopicsInputAddTag,
} from './search topics input/search-topics-input-add-tag';
import {
    type SearchTopicsInputRemoveTagPayload,
    SEARCH_TOPICS_INPUT_REMOVE_TAG,
    SearchTopicsInputRemoveTag,
} from './search topics input/search-topics-input-remove-tag';
import {
    type WorldCloudComponentAddTagPayload,
    WORLD_CLOUD_COMPONENT_ADD_TAG,
    WorldCloudComponentAddTag,
} from './word cloud component/world-cloud-component-add-tag';
import {
    type WorldCloudComponentRemoveTagPayload,
    WORLD_CLOUD_COMPONENT_REMOVE_TAG,
    WorldCloudComponentRemoveTag,
} from './word cloud component/world-cloud-component-remove-tag';
import {
    type SearchForInfluencersPayload,
    SEARCH_FOR_INFLUENCERS,
    SearchForInfluencers,
} from './search-for-influencers';

export {
    Search,
    SearchDefault,
    SearchLoadMoreResults,
    SearchAddToCampaign,
    AnalyzeAddToCampaign,
    SearchAnalyzeInfluencer,
    SearchOpenExternalSocialProfile,
    AnalyzeOpenExternalSocialProfile,
    CreateSequence,
    StartSequenceForInfluencer,
    EmailSent,
    EmailFailed,
    EmailComplaint,
    EmailOpened,
    EmailClicked,
    EmailReply,
    BoostbotAnalyzeInfluencer,
    RecommendInfluencers,
    UnlockInfluencers,
    SendInfluencersToOutreach,
    OpenSocialProfile,
    OpenAnalyzeProfile,
    ChangePage,
    StopBoostbot,
    OpenSocialThumbnails,
    HoverTooltip,
    ClickNeedHelp,
    GoToLogin,
    PasswordReset,
    OpenAccountModal,
    NavigateToPage,
    SignupStarted,
    OpenVideoGuideModal,
    SendEmailReply,
    OpenEmailThread,
    OpenInfluencerProfile,
    UpdateInfluencerProfile,
    AddInfluencerPost,
    AddNoteToInfluencerProfile,
    UpdateInfluencerStatus,
    SaveInfluencerProfileUpdates,
    PlayTutorialVideo,
    CloseHelpModal,
    ViewInfluencerProfileNotes,
    SelectInfluencerProfileTab,
    SearchInbox,
    PayForUpgradedPlan,
    UpdateProfileInfo,
    ChangePassword,
    VisitPage,
    CompleteSignupStep,
    ChangeInboxFolder,
    ChangeTemplatePreview,
    ToggleNavbarSize,
    LandingPageStartFreeTrialClicked,
    SignupWizardStep5StartFreeTrial,
    PricingSectionToggleMonthlyOrQuarterly,
    PricingSectionSelectDiy,
    PricingSectionSelectDiyMax,
    SignupStartFreeTrialSuccess,
    SignupStartFreeTrialFailed,
    SignupCheckTermsAndConditions,
    SignupOpenTermsAndConditions,
    SignupSignOutFromFreeTrialPage,
    CampaignInfluencerRowOpenSocialLink,
    OpenSimilarInfluencerReport,
    AnalyzePageAddToCampaign,
    CloseSearchFilterModal,
    SearchOptionsSetHashtag,
    SearchOptionsSetKeyword,
    SearchOptionsSetTopics,
    SearchOptionsSearchTopics,
    SearchOptionsChangePlatform,
    SearchTopicsInputAddTag,
    SearchTopicsInputRemoveTag,
    WorldCloudComponentAddTag,
    WorldCloudComponentRemoveTag,
    SearchForInfluencers,
};

export const events = {
    [SEARCH_KEY]: Search,
    [SEARCH_DEFAULT]: SearchDefault,
    [SEARCH_LOAD_MORE_RESULTS]: SearchLoadMoreResults,
    [SEARCH_ANALYZE_INFLUENCER]: SearchAnalyzeInfluencer,
    [SEARCH_OPEN_EXTERNAL_SOCIAL_PROFILE]: SearchOpenExternalSocialProfile,
    [SEARCH_ADD_TO_CAMPAIGN]: SearchAddToCampaign,
    [ANALYZE_ADD_TO_CAMPAIGN]: AnalyzeAddToCampaign,
    [ANALYZE_OPEN_EXTERNAL_SOCIAL_PROFILE]: AnalyzeOpenExternalSocialProfile,
    [OUTREACH_CREATE_SEQUENCE]: CreateSequence,
    [OUTREACH_START_SEQUENCE_FOR_INFLUENCER]: StartSequenceForInfluencer,
    [OUTREACH_EMAIL_SENT]: EmailSent,
    [OUTREACH_EMAIL_FAILED]: EmailFailed,
    [OUTREACH_EMAIL_COMPLAINT]: EmailComplaint,
    [OUTREACH_EMAIL_OPENED]: EmailOpened,
    [OUTREACH_EMAIL_CLICKED]: EmailClicked,
    [OUTREACH_EMAIL_REPLY]: EmailReply,
    [OUTREACH_WEBHOOK_ERROR]: WebhookError,
    [OUTREACH_EMAIL_NEW]: EmailNew,
    [BOOSTBOT_ANALYZE_INFLUENCER]: BoostbotAnalyzeInfluencer,
    [BOOSTBOT_RECOMMEND_INFLUENCERS]: RecommendInfluencers,
    [BOOSTBOT_UNLOCK_INFLUENCERS]: UnlockInfluencers,
    [BOOSTBOT_SEND_INFLUENCERS_TO_OUTREACH]: SendInfluencersToOutreach,
    [OPEN_SOCIAL_PROFILE]: OpenSocialProfile,
    [OPEN_ANALYZE_PROFILE]: OpenAnalyzeProfile,
    [CHANGE_PAGE]: ChangePage,
    [STOP_BOOSTBOT]: StopBoostbot,
    [OPEN_SOCIAL_THUMBNAILS]: OpenSocialThumbnails,
    [HOVER_TOOLTIP]: HoverTooltip,
    [CLICK_NEED_HELP]: ClickNeedHelp,
    [GO_TO_LOGIN]: GoToLogin,
    [PASSWORD_RESET]: PasswordReset,
    [OPEN_ACCOUNT_MODAL]: OpenAccountModal,
    [NAVIGATE_TO_PAGE]: NavigateToPage,
    [SIGNUP_STARTED]: SignupStarted,
    [BOOSTBOT_OPEN_VIDEO_GUIDE_MODAL]: OpenVideoGuideModal,
    [OPEN_SEQUENCE]: OpenSequence,
    [DELETE_SEQUENCE]: DeleteSequence,
    [ENTER_INFLUENCER_EMAIL]: EnterInfluencerEmail,
    [OPEN_EMAIL_THREAD]: OpenEmailThread,
    [VIEW_SEQUENCE_TEMPLATES]: ViewSequenceTemplates,
    [UPDATE_TEMPLATE_VARIABLE]: UpdateTemplateVariable,
    [SAVE_TEMPLATE_VARIABLE_UPDATES]: SaveTemplateVariableUpdates,
    [INPUT_PAYMENT_INFO]: InputPaymentInfo,
    [OPEN_GUIDE_SECTION_MODAL]: OpenGuideSectionModal,
    [EXPAND_HELP_SECTION]: ExpandHelpSection,
    [CHANGE_LANGUAGE]: ChangeLanguage,
    [STRIPE_WEBHOOK_INCOMING]: StripeWebhookIncoming,
    [STRIPE_WEBHOOK_ERROR]: StripeWebhookError,
    [STRIPE_WEBHOOK_PAYMENT_FAILED]: StripeWebhookPaymentFailed,
    [SEND_EMAIL_REPLY]: SendEmailReply,
    [NAVIGATE_SIGNUP_CAROUSAL]: NavigateSignupCarousal,
    [OPEN_FILTERS_MODAL]: OpenFiltersModal,
    [OPEN_BOOSTBOT_FILTERS_MODAL]: OpenBoostbotFiltersModal,
    [SET_BOOSTBOT_FILTER]: SetBoostbotFilter,
    [ENTER_FILTER]: EnterFilter,
    [CLEAR_FILTERS]: ClearFilters,
    [SEARCH_INFLUENCER_BY_NAME]: SearchInfluencerByName,
    [CHANGE_SEQUENCE_TAB]: ChangeSequenceTab,
    [TOGGLE_AUTO_START]: ToggleAutoStart,
    [OPEN_INFLUENCER_PROFILE]: OpenInfluencerProfile,
    [UPDATE_INFLUENCER_PROFILE]: UpdateInfluencerProfile,
    [ADD_INFLUENCER_POST]: AddInfluencerPost,
    [ADD_NOTE_TO_INFLUENCER_PROFILE]: AddNoteToInfluencerProfile,
    [UPDATE_INFLUENCER_STATUS]: UpdateInfluencerStatus,
    [FILTER_SEQUENCE_INFLUENCERS]: FilterSequenceInfluencers,
    [SEARCH_INFLUENCER_MANAGER]: SearchInfluencerManager,
    [FILTER_INFLUENCER_MANAGER]: FilterInfluencerManager,
    [GO_TO_INBOX]: GoToInbox,
    [TOGGLE_VIEW_MINE]: ToggleViewMine,
    [SAVE_INFLUENCER_PROFILE_UPDATES]: SaveInfluencerProfileUpdates,
    [PLAY_TUTORIAL_VIDEO]: PlayTutorialVideo,
    [CLOSE_HELP_MODAL]: CloseHelpModal,
    [VIEW_INFLUENCER_PROFILE_NOTES]: ViewInfluencerProfileNotes,
    [SELECT_INFLUENCER_PROFILE_TAB]: SelectInfluencerProfileTab,
    [SEARCH_INBOX]: SearchInbox,
    [PAY_FOR_UPGRADED_PLAN]: PayForUpgradedPlan,
    [UPDATE_PROFILE_INFO]: UpdateProfileInfo,
    [CHANGE_PASSWORD]: ChangePassword,
    [BATCH_START_SEQUENCE]: BatchStartSequence,
    [VISIT_PAGE]: VisitPage,
    [COMPLETE_SIGNUP_STEP]: CompleteSignupStep,
    [CHANGE_INBOX_FOLDER]: ChangeInboxFolder,
    [CHANGE_TEMPLATE_PREVIEW]: ChangeTemplatePreview,
    [TOGGLE_NAVBAR_SIZE]: ToggleNavbarSize,
    [LANDING_PAGE_START_FREE_TRIAL_CLICKED]: LandingPageStartFreeTrialClicked,
    [SIGNUP_WIZARD_STEP_5_START_FREE_TRIAL]: SignupWizardStep5StartFreeTrial,
    [PRICING_SECTION_TOGGLE_MONTHLY_OR_QUARTERLY]: PricingSectionToggleMonthlyOrQuarterly,
    [PRICING_SECTION_SELECT_DIY]: PricingSectionSelectDiy,
    [PRICING_SECTION_SELECT_DIY_MAX]: PricingSectionSelectDiyMax,
    [SIGNUP_START_FREE_TRIAL_SUCCESS]: SignupStartFreeTrialSuccess,
    [SIGNUP_START_FREE_TRIAL_FAILED]: SignupStartFreeTrialFailed,
    [SIGNUP_CHECK_TERMS_AND_CONDITIONS]: SignupCheckTermsAndConditions,
    [SIGNUP_OPEN_TERMS_AND_CONDITIONS]: SignupOpenTermsAndConditions,
    [SIGNUP_SIGN_OUT_FROM_FREE_TRIAL_PAGE]: SignupSignOutFromFreeTrialPage,
    [CAMPAIGN_INFLUENCER_ROW_OPEN_SOCIAL_LINK]: CampaignInfluencerRowOpenSocialLink,
    [OPEN_SIMILAR_INFLUENCER_REPORT]: OpenSimilarInfluencerReport,
    [ANALYZE_PAGE_ADD_TO_CAMPAIGN]: AnalyzePageAddToCampaign,
    [CLOSE_SEARCH_FILTER_MODAL]: CloseSearchFilterModal,
    [SEARCH_OPTIONS_SET_HASHTAG]: SearchOptionsSetHashtag,
    [SEARCH_OPTIONS_SET_KEYWORD]: SearchOptionsSetKeyword,
    [SEARCH_OPTIONS_SET_TOPICS]: SearchOptionsSetTopics,
    [SEARCH_OPTIONS_SEARCH_TOPICS]: SearchOptionsSearchTopics,
    [SEARCH_OPTIONS_CHANGE_PLATFORM]: SearchOptionsChangePlatform,
    [SEARCH_TOPICS_INPUT_ADD_TAG]: SearchTopicsInputAddTag,
    [SEARCH_TOPICS_INPUT_REMOVE_TAG]: SearchTopicsInputRemoveTag,
    [WORLD_CLOUD_COMPONENT_ADD_TAG]: WorldCloudComponentAddTag,
    [WORLD_CLOUD_COMPONENT_REMOVE_TAG]: WorldCloudComponentRemoveTag,
    [SEARCH_FOR_INFLUENCERS]: SearchForInfluencers,
};

export type payloads = {
    [SEARCH_KEY]: SearchPayload;
    [SEARCH_DEFAULT]: SearchDefaultPayload;
    [SEARCH_LOAD_MORE_RESULTS]: SearchLoadMoreResultsPayload;
    [SEARCH_ANALYZE_INFLUENCER]: SearchAnalyzeInfluencerPayload;
    [SEARCH_OPEN_EXTERNAL_SOCIAL_PROFILE]: SearchOpenExternalSocialProfilePayload;
    [SEARCH_ADD_TO_CAMPAIGN]: SearchAddToCampaignPayload;
    [ANALYZE_ADD_TO_CAMPAIGN]: AnalyzeAddToCampaignPayload;
    [ANALYZE_OPEN_EXTERNAL_SOCIAL_PROFILE]: AnalyzeOpenExternalSocialProfilePayload;
    [OUTREACH_CREATE_SEQUENCE]: CreateSequencePayload;
    [OUTREACH_START_SEQUENCE_FOR_INFLUENCER]: StartSequenceForInfluencerPayload;
    [OUTREACH_EMAIL_SENT]: EmailSentPayload;
    [OUTREACH_EMAIL_FAILED]: EmailFailedPayload;
    [OUTREACH_EMAIL_COMPLAINT]: EmailComplaintPayload;
    [OUTREACH_EMAIL_OPENED]: EmailOpenedPayload;
    [OUTREACH_EMAIL_CLICKED]: EmailClickedPayload;
    [OUTREACH_EMAIL_REPLY]: EmailReplyPayload;
    [OUTREACH_WEBHOOK_ERROR]: WebhookErrorPayload;
    [OUTREACH_EMAIL_NEW]: EmailNewPayload;
    [BOOSTBOT_ANALYZE_INFLUENCER]: BoostbotAnalyzeInfluencerPayload;
    [BOOSTBOT_RECOMMEND_INFLUENCERS]: RecommendInfluencersPayload;
    [BOOSTBOT_UNLOCK_INFLUENCERS]: UnlockInfluencersPayload;
    [BOOSTBOT_SEND_INFLUENCERS_TO_OUTREACH]: SendInfluencersToOutreachPayload;
    [OPEN_SOCIAL_PROFILE]: OpenSocialProfilePayload;
    [OPEN_ANALYZE_PROFILE]: OpenAnalyzeProfilePayload;
    [CHANGE_PAGE]: ChangePagePayload;
    [STOP_BOOSTBOT]: StopBoostbotPayload;
    [OPEN_SOCIAL_THUMBNAILS]: OpenSocialThumbnailsPayload;
    [HOVER_TOOLTIP]: HoverTooltipPayload;
    [CLICK_NEED_HELP]: ClickNeedHelpPayload;
    [GO_TO_LOGIN]: GoToLoginPayload;
    [PASSWORD_RESET]: PasswordResetPayload;
    [OPEN_ACCOUNT_MODAL]: OpenAccountModalPayload;
    [NAVIGATE_TO_PAGE]: NavigateToPagePayload;
    [SIGNUP_STARTED]: SignupStartedPayload;
    [BOOSTBOT_OPEN_VIDEO_GUIDE_MODAL]: OpenVideoGuideModalPayload;
    [OPEN_SEQUENCE]: OpenSequencePayload;
    [DELETE_SEQUENCE]: DeleteSequencePayload;
    [ENTER_INFLUENCER_EMAIL]: EnterInfluencerEmailPayload;
    [OPEN_EMAIL_THREAD]: OpenEmailThreadPayload;
    [VIEW_SEQUENCE_TEMPLATES]: ViewSequenceTemplatesPayload;
    [UPDATE_TEMPLATE_VARIABLE]: UpdateTemplateVariablePayload;
    [SAVE_TEMPLATE_VARIABLE_UPDATES]: SaveTemplateVariableUpdatesPayload;
    [INPUT_PAYMENT_INFO]: InputPaymentInfoPayload;
    [OPEN_GUIDE_SECTION_MODAL]: OpenGuideSectionModalPayload;
    [EXPAND_HELP_SECTION]: ExpandHelpSectionPayload;
    [CHANGE_LANGUAGE]: ChangeLanguagePayload;
    [STRIPE_WEBHOOK_INCOMING]: StripeWebhookIncomingPayload;
    [STRIPE_WEBHOOK_ERROR]: StripeWebhookErrorPayload;
    [STRIPE_WEBHOOK_PAYMENT_FAILED]: StripeWebhookPaymentFailedPayload;
    [SEND_EMAIL_REPLY]: SendEmailReplyPayload;
    [NAVIGATE_SIGNUP_CAROUSAL]: NavigateSignupCarousalPayload;
    [OPEN_FILTERS_MODAL]: OpenFiltersModalPayload;
    [OPEN_BOOSTBOT_FILTERS_MODAL]: OpenBoostbotFiltersModalPayload;
    [SET_BOOSTBOT_FILTER]: SetBoostbotFilterPayload;
    [ENTER_FILTER]: EnterFilterPayload;
    [CLEAR_FILTERS]: ClearFiltersPayload;
    [SEARCH_INFLUENCER_BY_NAME]: SearchInfluencerByNamePayload;
    [CHANGE_SEQUENCE_TAB]: ChangeSequenceTabPayload;
    [TOGGLE_AUTO_START]: ToggleAutoStartPayload;
    [OPEN_INFLUENCER_PROFILE]: OpenInfluencerProfilePayload;
    [UPDATE_INFLUENCER_PROFILE]: UpdateInfluencerProfilePayload;
    [ADD_INFLUENCER_POST]: AddInfluencerPostPayload;
    [ADD_NOTE_TO_INFLUENCER_PROFILE]: AddNoteToInfluencerProfilePayload;
    [UPDATE_INFLUENCER_STATUS]: UpdateInfluencerStatusPayload;
    [FILTER_SEQUENCE_INFLUENCERS]: FilterSequenceInfluencersPayload;
    [SEARCH_INFLUENCER_MANAGER]: SearchInfluencerManagerPayload;
    [FILTER_INFLUENCER_MANAGER]: FilterInfluencerManagerPayload;
    [GO_TO_INBOX]: GoToInboxPayload;
    [TOGGLE_VIEW_MINE]: ToggleViewMinePayload;
    [SAVE_INFLUENCER_PROFILE_UPDATES]: SaveInfluencerProfileUpdatesPayload;
    [PLAY_TUTORIAL_VIDEO]: PlayTutorialVideoPayload;
    [CLOSE_HELP_MODAL]: CloseHelpModalPayload;
    [VIEW_INFLUENCER_PROFILE_NOTES]: ViewInfluencerProfileNotesPayload;
    [SELECT_INFLUENCER_PROFILE_TAB]: SelectInfluencerProfileTabPayload;
    [SEARCH_INBOX]: SearchInboxPayload;
    [PAY_FOR_UPGRADED_PLAN]: PayForUpgradedPlanPayload;
    [UPDATE_PROFILE_INFO]: UpdateProfileInfoPayload;
    [CHANGE_PASSWORD]: ChangePasswordPayload;
    [BATCH_START_SEQUENCE]: BatchStartSequencePayload;
    [VISIT_PAGE]: VisitPagePayload;
    [COMPLETE_SIGNUP_STEP]: CompleteSignupStepPayload;
    [CHANGE_INBOX_FOLDER]: ChangeInboxFolderPayload;
    [CHANGE_TEMPLATE_PREVIEW]: ChangeTemplatePreviewPayload;
    [TOGGLE_NAVBAR_SIZE]: ToggleNavbarSizePayload;
    [LANDING_PAGE_START_FREE_TRIAL_CLICKED]: LandingPageStartFreeTrialClickedPayload;
    [SIGNUP_WIZARD_STEP_5_START_FREE_TRIAL]: SignupWizardStep5StartFreeTrialPayload;
    [PRICING_SECTION_TOGGLE_MONTHLY_OR_QUARTERLY]: PricingSectionToggleMonthlyOrQuarterlyPayload;
    [PRICING_SECTION_SELECT_DIY]: PricingSectionSelectDiyPayload;
    [PRICING_SECTION_SELECT_DIY_MAX]: PricingSectionSelectDiyMaxPayload;
    [SIGNUP_START_FREE_TRIAL_SUCCESS]: SignupStartFreeTrialSuccessPayload;
    [SIGNUP_START_FREE_TRIAL_FAILED]: SignupStartFreeTrialFailedPayload;
    [SIGNUP_CHECK_TERMS_AND_CONDITIONS]: SignupCheckTermsAndConditionsPayload;
    [SIGNUP_OPEN_TERMS_AND_CONDITIONS]: SignupOpenTermsAndConditionsPayload;
    [SIGNUP_SIGN_OUT_FROM_FREE_TRIAL_PAGE]: SignupSignOutFromFreeTrialPagePayload;
    [CAMPAIGN_INFLUENCER_ROW_OPEN_SOCIAL_LINK]: CampaignInfluencerRowOpenSocialLinkPayload;
    [OPEN_SIMILAR_INFLUENCER_REPORT]: OpenSimilarInfluencerReportPayload;
    [ANALYZE_PAGE_ADD_TO_CAMPAIGN]: AnalyzePageAddToCampaignPayload;
    [CLOSE_SEARCH_FILTER_MODAL]: CloseSearchFilterModalPayload;
    [SEARCH_OPTIONS_SET_HASHTAG]: SearchOptionsSetHashtagPayload;
    [SEARCH_OPTIONS_SET_KEYWORD]: SearchOptionsSetKeywordPayload;
    [SEARCH_OPTIONS_SET_TOPICS]: SearchOptionsSetTopicsPayload;
    [SEARCH_OPTIONS_SEARCH_TOPICS]: SearchOptionsSearchTopicsPayload;
    [SEARCH_OPTIONS_CHANGE_PLATFORM]: SearchOptionsChangePlatformPayload;
    [SEARCH_TOPICS_INPUT_ADD_TAG]: SearchTopicsInputAddTagPayload;
    [SEARCH_TOPICS_INPUT_REMOVE_TAG]: SearchTopicsInputRemoveTagPayload;
    [WORLD_CLOUD_COMPONENT_ADD_TAG]: WorldCloudComponentAddTagPayload;
    [WORLD_CLOUD_COMPONENT_REMOVE_TAG]: WorldCloudComponentRemoveTagPayload;
    [SEARCH_FOR_INFLUENCERS]: SearchForInfluencersPayload;
};

// @note we are using these eventKeys on other zod objects for validation
//       hopefully next time we can just use the `keyof events` type and use that
export const eventKeys = z.union([
    z.literal(SEARCH_KEY),
    z.literal(SEARCH_DEFAULT),
    z.literal(SEARCH_LOAD_MORE_RESULTS),
    z.literal(SEARCH_ANALYZE_INFLUENCER),
    z.literal(SEARCH_OPEN_EXTERNAL_SOCIAL_PROFILE),
    z.literal(SEARCH_ADD_TO_CAMPAIGN),
    z.literal(ANALYZE_ADD_TO_CAMPAIGN),
    z.literal(ANALYZE_OPEN_EXTERNAL_SOCIAL_PROFILE),
    z.literal(OUTREACH_CREATE_SEQUENCE),
    z.literal(OUTREACH_START_SEQUENCE_FOR_INFLUENCER),
    z.literal(OUTREACH_EMAIL_SENT),
    z.literal(OUTREACH_EMAIL_FAILED),
    z.literal(OUTREACH_EMAIL_COMPLAINT),
    z.literal(OUTREACH_EMAIL_OPENED),
    z.literal(OUTREACH_EMAIL_CLICKED),
    z.literal(OUTREACH_EMAIL_REPLY),
    z.literal(OUTREACH_WEBHOOK_ERROR),
    z.literal(OUTREACH_EMAIL_NEW),
    z.literal(BOOSTBOT_ANALYZE_INFLUENCER),
    z.literal(BOOSTBOT_RECOMMEND_INFLUENCERS),
    z.literal(BOOSTBOT_UNLOCK_INFLUENCERS),
    z.literal(BOOSTBOT_SEND_INFLUENCERS_TO_OUTREACH),
    z.literal(OPEN_SOCIAL_PROFILE),
    z.literal(OPEN_ANALYZE_PROFILE),
    z.literal(CHANGE_PAGE),
    z.literal(STOP_BOOSTBOT),
    z.literal(OPEN_SOCIAL_THUMBNAILS),
    z.literal(HOVER_TOOLTIP),
    z.literal(CLICK_NEED_HELP),
    z.literal(GO_TO_LOGIN),
    z.literal(PASSWORD_RESET),
    z.literal(OPEN_ACCOUNT_MODAL),
    z.literal(NAVIGATE_TO_PAGE),
    z.literal(SIGNUP_STARTED),
    z.literal(BOOSTBOT_OPEN_VIDEO_GUIDE_MODAL),
    z.literal(OPEN_SEQUENCE),
    z.literal(DELETE_SEQUENCE),
    z.literal(ENTER_INFLUENCER_EMAIL),
    z.literal(OPEN_EMAIL_THREAD),
    z.literal(VIEW_SEQUENCE_TEMPLATES),
    z.literal(UPDATE_TEMPLATE_VARIABLE),
    z.literal(SAVE_TEMPLATE_VARIABLE_UPDATES),
    z.literal(INPUT_PAYMENT_INFO),
    z.literal(OPEN_GUIDE_SECTION_MODAL),
    z.literal(EXPAND_HELP_SECTION),
    z.literal(CHANGE_LANGUAGE),
    z.literal(STRIPE_WEBHOOK_INCOMING),
    z.literal(STRIPE_WEBHOOK_ERROR),
    z.literal(STRIPE_WEBHOOK_PAYMENT_FAILED),
    z.literal(SEND_EMAIL_REPLY),
    z.literal(NAVIGATE_SIGNUP_CAROUSAL),
    z.literal(OPEN_FILTERS_MODAL),
    z.literal(OPEN_BOOSTBOT_FILTERS_MODAL),
    z.literal(SET_BOOSTBOT_FILTER),
    z.literal(ENTER_FILTER),
    z.literal(CLEAR_FILTERS),
    z.literal(SEARCH_INFLUENCER_BY_NAME),
    z.literal(CHANGE_SEQUENCE_TAB),
    z.literal(TOGGLE_AUTO_START),
    z.literal(OPEN_INFLUENCER_PROFILE),
    z.literal(UPDATE_INFLUENCER_PROFILE),
    z.literal(ADD_INFLUENCER_POST),
    z.literal(ADD_NOTE_TO_INFLUENCER_PROFILE),
    z.literal(UPDATE_INFLUENCER_STATUS),
    z.literal(FILTER_SEQUENCE_INFLUENCERS),
    z.literal(SEARCH_INFLUENCER_MANAGER),
    z.literal(FILTER_INFLUENCER_MANAGER),
    z.literal(GO_TO_INBOX),
    z.literal(TOGGLE_VIEW_MINE),
    z.literal(SAVE_INFLUENCER_PROFILE_UPDATES),
    z.literal(PLAY_TUTORIAL_VIDEO),
    z.literal(CLOSE_HELP_MODAL),
    z.literal(VIEW_INFLUENCER_PROFILE_NOTES),
    z.literal(SELECT_INFLUENCER_PROFILE_TAB),
    z.literal(SEARCH_INBOX),
    z.literal(PAY_FOR_UPGRADED_PLAN),
    z.literal(UPDATE_PROFILE_INFO),
    z.literal(CHANGE_PASSWORD),
    z.literal(BATCH_START_SEQUENCE),
    z.literal(VISIT_PAGE),
    z.literal(COMPLETE_SIGNUP_STEP),
    z.literal(CHANGE_INBOX_FOLDER),
    z.literal(CHANGE_TEMPLATE_PREVIEW),
    z.literal(TOGGLE_NAVBAR_SIZE),
    z.literal(LANDING_PAGE_START_FREE_TRIAL_CLICKED),
    z.literal(SIGNUP_WIZARD_STEP_5_START_FREE_TRIAL),
    z.literal(PRICING_SECTION_TOGGLE_MONTHLY_OR_QUARTERLY),
    z.literal(PRICING_SECTION_SELECT_DIY),
    z.literal(PRICING_SECTION_SELECT_DIY_MAX),
    z.literal(SIGNUP_START_FREE_TRIAL_SUCCESS),
    z.literal(SIGNUP_START_FREE_TRIAL_FAILED),
    z.literal(SIGNUP_CHECK_TERMS_AND_CONDITIONS),
    z.literal(SIGNUP_OPEN_TERMS_AND_CONDITIONS),
    z.literal(SIGNUP_SIGN_OUT_FROM_FREE_TRIAL_PAGE),
    z.literal(CAMPAIGN_INFLUENCER_ROW_OPEN_SOCIAL_LINK),
    z.literal(OPEN_SIMILAR_INFLUENCER_REPORT),
    z.literal(ANALYZE_PAGE_ADD_TO_CAMPAIGN),
    z.literal(CLOSE_SEARCH_FILTER_MODAL),
    z.literal(SEARCH_OPTIONS_SET_HASHTAG),
    z.literal(SEARCH_OPTIONS_SET_KEYWORD),
    z.literal(SEARCH_OPTIONS_SET_TOPICS),
    z.literal(SEARCH_OPTIONS_SEARCH_TOPICS),
    z.literal(SEARCH_OPTIONS_CHANGE_PLATFORM),
    z.literal(SEARCH_TOPICS_INPUT_ADD_TAG),
    z.literal(SEARCH_TOPICS_INPUT_REMOVE_TAG),
    z.literal(WORLD_CLOUD_COMPONENT_ADD_TAG),
    z.literal(WORLD_CLOUD_COMPONENT_REMOVE_TAG),
    z.literal(SEARCH_FOR_INFLUENCERS),
]);

export const isTrackedEvent = (event: (...args: any) => any): event is TrackedEvent => {
    if (!('eventName' in event)) return false;
    const result = eventKeys.safeParse(event.eventName);
    return result.success;
};

export type eventKeys = z.infer<typeof eventKeys>;

export default events;
