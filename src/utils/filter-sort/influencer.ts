import { type SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { type SequenceEmail } from '../api/db';

export const sortInfluencers = (
    currentTab: SequenceInfluencerManagerPage['funnel_status'],
    influencers?: SequenceInfluencerManagerPage[],
    sequenceEmails?: SequenceEmail[],
) => {
    return influencers?.sort((a, b) => {
        const getEmailTime = (influencerId: string) =>
            sequenceEmails?.find((email) => email.sequence_influencer_id === influencerId)?.email_send_at;

        if (currentTab === 'To Contact') {
            return a.created_at.localeCompare(b.created_at);
        } else if (currentTab === 'In Sequence' || currentTab === 'Ignored') {
            const mailTimeA = getEmailTime(a.id);
            const mailTimeB = getEmailTime(b.id);

            if (!mailTimeA || !mailTimeB) {
                return -1;
            }

            return mailTimeB.localeCompare(mailTimeA);
        }

        return 0;
    });
};

export const totalNumberOfPages = (sortedInfluencers: any[] | undefined, numberOfInfluencersPerPage: number) => {
    //gets the number of pages
    if (sortedInfluencers?.length) {
        return Math.ceil(sortedInfluencers.length / numberOfInfluencersPerPage);
    }
    return 1;
};

export const filterByPage = (
    currentPage: number,
    numberOfInfluencersPerPage: number,
    sortedInfluencers: any[] | undefined,
) => {
    //calculates the range splice   the results
    const lastPage = totalNumberOfPages(sortedInfluencers, numberOfInfluencersPerPage);
    const startRange = (currentPage - 1) * numberOfInfluencersPerPage;
    let endRange: any = currentPage * numberOfInfluencersPerPage;
    const totalNoOfInfluencers: any = sortedInfluencers?.length;

    if (totalNoOfInfluencers > endRange && currentPage == lastPage) {
        endRange = sortedInfluencers?.length;
    }

    if (sortedInfluencers) {
        return sortedInfluencers?.slice(startRange, endRange);
    }
    return [];
};
