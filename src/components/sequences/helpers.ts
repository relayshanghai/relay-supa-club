import type {
    InfluencerSocialProfileRow,
    SequenceInfluencer,
    SequenceInfluencerUpdate,
    TemplateVariableInsert,
} from 'src/utils/api/db';
import { clientLogger } from 'src/utils/logger-client';
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
}): Promise<SequenceInfluencer | 'Email already exists' | null> => {
    if (!sequenceInfluencer || !company_id || !socialProfile || !report) {
        return null;
    }

    // for now, what we need from the social profile is the id, email, tags
    const updatedValues = {
        id: sequenceInfluencer.id,
        influencer_social_profile_id: socialProfile.id,
        email: socialProfile.email,
        tags: getRelevantTags(report),
        social_profile_last_fetched: new Date().toISOString(),
        company_id,
    };

    if (
        JSON.stringify(updatedValues.tags) === JSON.stringify(sequenceInfluencer.tags) &&
        updatedValues.influencer_social_profile_id === sequenceInfluencer.influencer_social_profile_id &&
        updatedValues.email === sequenceInfluencer.email
    ) {
        return null;
    }
    try {
        return await updateSequenceInfluencer(updatedValues);
    } catch (error: any) {
        clientLogger(error, 'error');
        if (error.message?.includes('Email already exists for this company for influencer')) {
            return 'Email already exists';
        }
        return null;
    }
};

export const wasFetchedWithinMinutes = (
    now = new Date().getTime(),
    sequenceInfluencer: SequenceInfluencer,
    timeDifference: number,
) => {
    const socialProfileLastFetched = new Date(sequenceInfluencer.social_profile_last_fetched ?? '').getTime();
    return now - socialProfileLastFetched < timeDifference; // 10 minutes
};
