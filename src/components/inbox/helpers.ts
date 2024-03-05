import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';

export const mapProfileToNotes = (profile: SequenceInfluencerManagerPage) => {
    return {
        collabStatus: profile?.funnel_status ?? profile?.funnel_status ?? '', // profile.funnel_status (toLowerCase)
        nextStep: profile?.next_step ?? profile?.next_step ?? '', // profile.next_step
        fee: profile?.rate_amount ?? profile?.rate_amount ?? '', // profile.rate_amount
        videoDetails: profile?.video_details ?? profile?.video_details ?? '', // profile.video_details
        affiliateLink: '', // ??
        scheduledPostDate: profile?.scheduled_post_date ?? profile?.scheduled_post_date ?? '', // profile.scheduled_post_date
        notes: '', // will be filled by getNotes
    };
};

export const mapProfileToShippingDetails = (profile: SequenceInfluencerManagerPage) => ({
    name: profile?.address?.name ?? '',
    phoneNumber: profile?.address?.phone_number ?? profile?.address?.phone_number ?? '',
    streetAddress: profile?.address?.address_line_1 ?? profile?.address?.address_line_1 ?? '',
    city: profile?.address?.city ?? '',
    state: profile?.address?.state ?? '',
    country: profile?.address?.country ?? '',
    postalCode: profile?.address?.postal_code ?? profile?.address?.postal_code ?? '',
    trackingCode: profile?.address?.tracking_code ?? profile?.address?.tracking_code ?? '',
    fullAddress: '', // probably combination of stuff above
});

export const mapProfileToFormData = (p?: SequenceInfluencerManagerPage | null) => {
    if (!p) return null;
    return {
        notes: mapProfileToNotes(p),
        shippingDetails: mapProfileToShippingDetails(p),
    };
};

export const findMostRecentMessageFromOtherPerson = (messages: SearchResponseMessage[], userEmail: string) => {
    const sortedMessages = messages.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return sortedMessages.find(
        (message) => message.from?.address.trim().toLowerCase() !== userEmail.trim().toLowerCase(),
    );
};

export const findOtherPeopleInThread = (messages: SearchResponseMessage[], userEmail: string) => {
    const otherPeople: string[] = [];
    messages.forEach((message) => {
        const email = message.from?.address.trim().toLowerCase();
        const cc = message.cc?.map((c) => c.address.trim().toLowerCase());

        if (email !== userEmail.trim().toLowerCase()) {
            if (!otherPeople.includes(email)) {
                otherPeople.push(message.from?.address.trim().toLowerCase());
            }
        }

        if (cc) {
            cc.forEach((c) => {
                if (!otherPeople.includes(c)) {
                    otherPeople.push(c);
                }
            });
        }
    });
    return otherPeople;
};

export const sortByUpdatedAtDesc = (a: string | null, b: string | null) => {
    if (!a || !b) {
        return 0;
    }
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
};
