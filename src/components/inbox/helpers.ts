import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { mapProfileToNotes, mapProfileToShippingDetails } from '../influencer-profile/screens/profile-overlay-screen';
import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';

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
