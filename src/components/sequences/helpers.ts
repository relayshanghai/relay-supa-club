import type {
    SequenceInfluencerManagerPage,
    SequenceInfluencerManagerPageWithChannelData,
} from 'pages/api/sequence/influencers';
import type {
    InfluencerSocialProfileRow,
    SequenceEmail,
    SequenceInfluencer,
    SequenceInfluencerUpdate,
    TemplateVariableInsert,
} from 'src/utils/api/db';
import type { CreatorReport } from 'types';

/** 
 will leave out the missing variables and wrap them with `**variableName**`  
 */
export const fillInTemplateVariables = (email: string, templateVariables: TemplateVariableInsert[]) => {
    const splitEmail = email.split(/({{)|(}})/g);
    const filledInEmail = splitEmail.map((part) => {
        if (part?.includes('params.')) {
            const variableName = part.trim().replace('params.', '');
            const variable = templateVariables.find((v) => v.key === variableName);
            if (variable?.value) {
                return `<span class='text-purple-500'>${variable.value}</span>`;
            }
            return `<span class='text-purple-500'>**${part.split('params.')[1].trim()}**</span>`;
        }
        return part;
    });
    return filledInEmail
        .filter((part) => {
            return !part?.includes('{{') && !part?.includes('}}');
        })
        .join('');
};

export const replaceNewlinesAndTabs = (text: string) => {
    return text.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
};

// get the top 3 tags from relevant_tags of the report, then pass it to tags of sequence influencer
export const getRelevantTags = (report?: CreatorReport) => {
    if (!report || !report.user_profile.relevant_tags) {
        return [];
    }
    const relevantTags = report.user_profile.relevant_tags;
    return relevantTags.slice(0, 3).map((tag) => tag.tag);
};

/**
 * Updates the sequence_influencer with the social profile data and the report data if available
 */
export const updateSequenceInfluencerIfSocialProfileAvailable = async ({
    sequenceInfluencer,
    socialProfile,
    report,
    updateSequenceInfluencer,
    company_id,
}: {
    sequenceInfluencer: SequenceInfluencer | null;
    socialProfile?: InfluencerSocialProfileRow;
    report?: CreatorReport;
    updateSequenceInfluencer: (update: SequenceInfluencerUpdate) => Promise<SequenceInfluencer>;
    company_id: string;
}) => {
    if (!sequenceInfluencer || !company_id || !socialProfile || !report) {
        return;
    }

    // for now, what we need from the social profile is the id, email, tags
    const updatedValues: SequenceInfluencerUpdate = {
        id: sequenceInfluencer.id,
        company_id,
    };

    if (!sequenceInfluencer.influencer_social_profile_id) {
        updatedValues.influencer_social_profile_id = socialProfile.id;
        updatedValues.social_profile_last_fetched = new Date().toISOString();
    }

    if (!sequenceInfluencer.email && socialProfile.email) {
        updatedValues.email = socialProfile.email.toLowerCase().trim();
        updatedValues.social_profile_last_fetched = new Date().toISOString();
    }
    if (!sequenceInfluencer.tags || sequenceInfluencer.tags.length === 0) {
        const tags = getRelevantTags(report);
        if (tags.length > 0) {
            updatedValues.tags = tags;
            updatedValues.social_profile_last_fetched = new Date().toISOString();
        }
    }
    if (!sequenceInfluencer.social_profile_last_fetched) {
        updatedValues.social_profile_last_fetched = new Date().toISOString();
    }

    if (!updatedValues.social_profile_last_fetched) {
        return;
    }

    return await updateSequenceInfluencer(updatedValues);
};

export const wasFetchedWithinMinutes = (
    now = new Date().getTime(),
    sequenceInfluencer: SequenceInfluencer,
    timeDifference: number,
) => {
    const socialProfileLastFetched = new Date(sequenceInfluencer.social_profile_last_fetched ?? '').getTime();
    return now - socialProfileLastFetched < timeDifference; // 10 minutes
};

export const isMissingSocialProfileInfo = (sequenceInfluencer: SequenceInfluencerManagerPage) =>
    !sequenceInfluencer.recent_post_title ||
    !sequenceInfluencer.recent_post_url ||
    !sequenceInfluencer.avatar_url ||
    !sequenceInfluencer.social_profile_last_fetched ||
    !sequenceInfluencer.influencer_social_profile_id ||
    !sequenceInfluencer.tags;

export const calculateReplyRate = (
    sequenceInfluencers?: SequenceInfluencerManagerPageWithChannelData[],
    sequenceEmails?: SequenceEmail[],
) => {
    if (!sequenceInfluencers || sequenceInfluencers.length === 0 || !sequenceEmails || sequenceEmails.length === 0) {
        return 0;
    }

    const unsentDeliverStatuses = ['Unscheduled', 'Scheduled'];
    const hasAlreadySentEmailInfluencers = sequenceInfluencers.filter(({ funnel_status, id }) => {
        // if the influencer is in the "To Contact" status, they should not be counted in the reply rate denominator
        if (funnel_status === 'To Contact' || funnel_status === 'Ignored') {
            return false;
        }
        if (funnel_status === 'In Sequence') {
            // only count influencers that have been sent an email
            return sequenceEmails?.some(
                ({ sequence_influencer_id, email_delivery_status }) =>
                    sequence_influencer_id === id &&
                    email_delivery_status &&
                    !unsentDeliverStatuses.includes(email_delivery_status),
            );
        }
        return true;
    }).length;

    const repliedInfluencers = sequenceInfluencers.filter(({ funnel_status, id }) => {
        if (funnel_status === 'To Contact' || funnel_status === 'Ignored') {
            return false;
        }
        if (funnel_status === 'In Sequence') {
            return sequenceEmails?.some(
                ({ sequence_influencer_id, email_delivery_status }) =>
                    sequence_influencer_id === id && email_delivery_status === 'Replied',
            );
        }
        return true;
    }).length;
    if (repliedInfluencers === 0 || hasAlreadySentEmailInfluencers === 0) {
        return 0;
    }

    return repliedInfluencers / hasAlreadySentEmailInfluencers;
};
