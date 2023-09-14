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
import type { OpenBoostbotPagePayload } from './boostbot/open-boostbot-page';
import { BOOSTBOT_OPEN_BOOSTBOT_PAGE, OpenBoostbotPage } from './boostbot/open-boostbot-page';
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
import type { OpenSocialThumbnailsPayload } from './open-social-thumbnails';
import { OPEN_SOCIAL_THUMBNAILS, OpenSocialThumbnails } from './open-social-thumbnails';
import type { OpenVideoGuideModalPayload } from './boostbot/open-video-guide-modal';
import { BOOSTBOT_OPEN_VIDEO_GUIDE_MODAL, OpenVideoGuideModal } from './boostbot/open-video-guide-modal';
import type { AddInfluencerToSequencePayload } from './outreach/add-influencer-to-sequence';
import { AddInfluencerToSequence, OUTREACH_ADD_INFLUENCER_TO_SEQUENCE } from './outreach/add-influencer-to-sequence';
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
import type { OpenInboxPagePayload } from './outreach/open-inbox-page';
import { OUTREACH_OPEN_INBOX_PAGE, OpenInboxPage } from './outreach/open-inbox-page';
import type { OpenInfluencerManagerPagePayload } from './outreach/open-influencer-manager-page';
import {
    OUTREACH_OPEN_INFLUENCER_MANAGER_PAGE,
    OpenInfluencerManagerPage,
} from './outreach/open-influencer-manager-page';
import type { OpenSequencesPagePayload } from './outreach/open-sequences-page';
import { OUTREACH_OPEN_SEQUENCES_PAGE, OpenSequencesPage } from './outreach/open-sequences-page';
import type { StartSequenceForInfluencerPayload } from './outreach/start-sequence-for-influencer';
import {
    OUTREACH_START_SEQUENCE_FOR_INFLUENCER,
    StartSequenceForInfluencer,
} from './outreach/start-sequence-for-influencer';
import type { RemoveBoostbotKolPayload } from './remove-boostbot-kol';
import { REMOVE_BOOSTBOT_KOL, RemoveBoostbotKol } from './remove-boostbot-kol';
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
import type { IncomingWebhookPayload } from './outreach/email-incoming';
import { IncomingWebhook, OUTREACH_EMAIL_INCOMING } from './outreach/email-incoming';
import type { StopBoostbotPayload } from './stop-boostbot';
import { STOP_BOOSTBOT, StopBoostbot } from './stop-boostbot';
import type { GoToLoginPayload } from './go-to-login';
import { GO_TO_LOGIN, GoToLogin } from './go-to-login';

export {
    Search,
    SearchDefault,
    SearchLoadMoreResults,
    SearchAddToCampaign,
    AnalyzeAddToCampaign,
    SearchAnalyzeInfluencer,
    SearchOpenExternalSocialProfile,
    AnalyzeOpenExternalSocialProfile,
    AddInfluencerToSequence,
    OpenSequencesPage,
    OpenInboxPage,
    OpenInfluencerManagerPage,
    CreateSequence,
    StartSequenceForInfluencer,
    EmailSent,
    EmailFailed,
    EmailComplaint,
    EmailOpened,
    EmailClicked,
    EmailReply,
    BoostbotAnalyzeInfluencer,
    OpenBoostbotPage,
    RecommendInfluencers,
    UnlockInfluencers,
    SendInfluencersToOutreach,
    OpenSocialProfile,
    RemoveBoostbotKol,
    ChangePage,
    StopBoostbot,
    OpenSocialThumbnails,
    GoToLogin,
    OpenVideoGuideModal,
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
    [OUTREACH_ADD_INFLUENCER_TO_SEQUENCE]: AddInfluencerToSequence,
    [OUTREACH_OPEN_SEQUENCES_PAGE]: OpenSequencesPage,
    [OUTREACH_OPEN_INBOX_PAGE]: OpenInboxPage,
    [OUTREACH_OPEN_INFLUENCER_MANAGER_PAGE]: OpenInfluencerManagerPage,
    [OUTREACH_CREATE_SEQUENCE]: CreateSequence,
    [OUTREACH_START_SEQUENCE_FOR_INFLUENCER]: StartSequenceForInfluencer,
    [OUTREACH_EMAIL_SENT]: EmailSent,
    [OUTREACH_EMAIL_FAILED]: EmailFailed,
    [OUTREACH_EMAIL_COMPLAINT]: EmailComplaint,
    [OUTREACH_EMAIL_OPENED]: EmailOpened,
    [OUTREACH_EMAIL_CLICKED]: EmailClicked,
    [OUTREACH_EMAIL_REPLY]: EmailReply,
    [OUTREACH_EMAIL_INCOMING]: IncomingWebhook,
    [OUTREACH_WEBHOOK_ERROR]: WebhookError,
    [OUTREACH_EMAIL_NEW]: EmailNew,
    [BOOSTBOT_ANALYZE_INFLUENCER]: BoostbotAnalyzeInfluencer,
    [BOOSTBOT_OPEN_BOOSTBOT_PAGE]: OpenBoostbotPage,
    [BOOSTBOT_RECOMMEND_INFLUENCERS]: RecommendInfluencers,
    [BOOSTBOT_UNLOCK_INFLUENCERS]: UnlockInfluencers,
    [BOOSTBOT_SEND_INFLUENCERS_TO_OUTREACH]: SendInfluencersToOutreach,
    [OPEN_SOCIAL_PROFILE]: OpenSocialProfile,
    [REMOVE_BOOSTBOT_KOL]: RemoveBoostbotKol,
    [CHANGE_PAGE]: ChangePage,
    [STOP_BOOSTBOT]: StopBoostbot,
    [OPEN_SOCIAL_THUMBNAILS]: OpenSocialThumbnails,
    [GO_TO_LOGIN]: GoToLogin,
    [BOOSTBOT_OPEN_VIDEO_GUIDE_MODAL]: OpenVideoGuideModal,
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
    [OUTREACH_ADD_INFLUENCER_TO_SEQUENCE]: AddInfluencerToSequencePayload;
    [OUTREACH_OPEN_SEQUENCES_PAGE]: OpenSequencesPagePayload;
    [OUTREACH_OPEN_INBOX_PAGE]: OpenInboxPagePayload;
    [OUTREACH_OPEN_INFLUENCER_MANAGER_PAGE]: OpenInfluencerManagerPagePayload;
    [OUTREACH_CREATE_SEQUENCE]: CreateSequencePayload;
    [OUTREACH_START_SEQUENCE_FOR_INFLUENCER]: StartSequenceForInfluencerPayload;
    [OUTREACH_EMAIL_SENT]: EmailSentPayload;
    [OUTREACH_EMAIL_FAILED]: EmailFailedPayload;
    [OUTREACH_EMAIL_COMPLAINT]: EmailComplaintPayload;
    [OUTREACH_EMAIL_OPENED]: EmailOpenedPayload;
    [OUTREACH_EMAIL_CLICKED]: EmailClickedPayload;
    [OUTREACH_EMAIL_REPLY]: EmailReplyPayload;
    [OUTREACH_EMAIL_INCOMING]: IncomingWebhookPayload;
    [OUTREACH_WEBHOOK_ERROR]: WebhookErrorPayload;
    [OUTREACH_EMAIL_NEW]: EmailNewPayload;
    [BOOSTBOT_ANALYZE_INFLUENCER]: BoostbotAnalyzeInfluencerPayload;
    [BOOSTBOT_OPEN_BOOSTBOT_PAGE]: OpenBoostbotPagePayload;
    [BOOSTBOT_RECOMMEND_INFLUENCERS]: RecommendInfluencersPayload;
    [BOOSTBOT_UNLOCK_INFLUENCERS]: UnlockInfluencersPayload;
    [BOOSTBOT_SEND_INFLUENCERS_TO_OUTREACH]: SendInfluencersToOutreachPayload;
    [OPEN_SOCIAL_PROFILE]: OpenSocialProfilePayload;
    [REMOVE_BOOSTBOT_KOL]: RemoveBoostbotKolPayload;
    [CHANGE_PAGE]: ChangePagePayload;
    [STOP_BOOSTBOT]: StopBoostbotPayload;
    [OPEN_SOCIAL_THUMBNAILS]: OpenSocialThumbnailsPayload;
    [GO_TO_LOGIN]: GoToLoginPayload;
    [BOOSTBOT_OPEN_VIDEO_GUIDE_MODAL]: OpenVideoGuideModalPayload;
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
    z.literal(OUTREACH_ADD_INFLUENCER_TO_SEQUENCE),
    z.literal(OUTREACH_OPEN_SEQUENCES_PAGE),
    z.literal(OUTREACH_OPEN_INBOX_PAGE),
    z.literal(OUTREACH_OPEN_INFLUENCER_MANAGER_PAGE),
    z.literal(OUTREACH_CREATE_SEQUENCE),
    z.literal(OUTREACH_START_SEQUENCE_FOR_INFLUENCER),
    z.literal(OUTREACH_EMAIL_SENT),
    z.literal(OUTREACH_EMAIL_FAILED),
    z.literal(OUTREACH_EMAIL_COMPLAINT),
    z.literal(OUTREACH_EMAIL_OPENED),
    z.literal(OUTREACH_EMAIL_CLICKED),
    z.literal(OUTREACH_EMAIL_REPLY),
    z.literal(OUTREACH_EMAIL_INCOMING),
    z.literal(OUTREACH_WEBHOOK_ERROR),
    z.literal(OUTREACH_EMAIL_NEW),
    z.literal(BOOSTBOT_ANALYZE_INFLUENCER),
    z.literal(BOOSTBOT_OPEN_BOOSTBOT_PAGE),
    z.literal(BOOSTBOT_RECOMMEND_INFLUENCERS),
    z.literal(BOOSTBOT_UNLOCK_INFLUENCERS),
    z.literal(BOOSTBOT_SEND_INFLUENCERS_TO_OUTREACH),
    z.literal(OPEN_SOCIAL_PROFILE),
    z.literal(REMOVE_BOOSTBOT_KOL),
    z.literal(CHANGE_PAGE),
    z.literal(STOP_BOOSTBOT),
    z.literal(OPEN_SOCIAL_THUMBNAILS),
    z.literal(GO_TO_LOGIN),
    z.literal(BOOSTBOT_OPEN_VIDEO_GUIDE_MODAL),
]);

export const isTrackedEvent = (event: (...args: any) => any): event is TrackedEvent => {
    if (!('eventName' in event)) return false;
    const result = eventKeys.safeParse(event.eventName);
    return result.success;
};

export type eventKeys = z.infer<typeof eventKeys>;

export default events;
