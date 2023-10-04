import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { mapProfileToNotes, mapProfileToShippingDetails } from '../influencer-profile/screens/profile-overlay-screen';

export const mapProfileToFormData = (p?: SequenceInfluencerManagerPage | null) => {
    if (!p) return null;
    return {
        notes: mapProfileToNotes(p),
        shippingDetails: mapProfileToShippingDetails(p),
    };
};
