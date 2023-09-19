import type {
    InfluencerSocialProfileRow,
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

export const updateSequenceInfluencerIfSocialProfileAvailable = async ({
    sequenceInfluencer,
    socialProfile,
    report,
    updateSequenceInfluencer,
    company_id,
}: {
    sequenceInfluencer: SequenceInfluencer;
    socialProfile?: InfluencerSocialProfileRow;
    report?: CreatorReport;
    updateSequenceInfluencer: (update: SequenceInfluencerUpdate) => Promise<SequenceInfluencer>;
    company_id: string;
}) => {
    if (!socialProfile) {
        return;
    }
    // get the top 3 tags from relevant_tags of the report, then pass it to tags of sequence influencer
    const getRelevantTags = () => {
        if (!report || !report.user_profile.relevant_tags) {
            return [];
        }
        const relevantTags = report.user_profile.relevant_tags;
        return relevantTags.slice(0, 3).map((tag) => tag.tag);
    };
    // for now, what we need from the social profile is the id, email, tags
    const updatedValues = {
        id: sequenceInfluencer.id,
        influencer_social_profile_id: socialProfile.id,
        email: socialProfile.email,
        tags: getRelevantTags(),
        social_profile_last_fetched: new Date().toISOString(),
        company_id,
    };
    await updateSequenceInfluencer(updatedValues);
};
