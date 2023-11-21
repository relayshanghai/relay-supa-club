import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import httpCodes from 'src/constants/httpCodes';
import { RelayError } from 'src/errors/relay-error';
import { ApiHandler } from 'src/utils/api-handler';
import { getAddressByInfluencer, saveAddressByInfluencer } from 'src/utils/api/db/calls/addresses';
import { getProfileByIdCall } from 'src/utils/api/db/calls/profiles';
import {
    getSequenceInfluencerByIdCall,
    updateSequenceInfluencerCall,
} from 'src/utils/api/db/calls/sequence-influencers';
import { toISO } from 'src/utils/datetime';
import { db } from 'src/utils/supabase-client';
import { z } from 'zod';

export const ProfileNotes = z.object({
    collabStatus: z
        .union([
            z.literal('To Contact'),
            z.literal('In Sequence'),
            z.literal('Ignored'),
            z.literal('Negotiating'),
            z.literal('Confirmed'),
            z.literal('Shipped'),
            z.literal('Rejected'),
            z.literal('Received'),
            z.literal('Content Approval'),
            z.literal('Posted'),
        ])
        .default('To Contact'),
    // notes: z.string().optional(),
    nextStep: z.string().default(''),
    fee: z
        .string()
        .or(z.number())
        .transform((v) => +v)
        .default(0),
    videoDetails: z.string().default(''),
    affiliateLink: z.string().default(''),
    scheduledPostDate: z.string().optional(),
});

export const ProfileShippingDetails = z.object({
    name: z.string().default(''),
    phoneNumber: z.string().optional(),
    streetAddress: z.string().default(''),
    city: z.string().default(''),
    state: z.string().default(''),
    country: z.string().default(''),
    postalCode: z.string().default(''),
    trackingCode: z.string().optional(),
    // fullAddress: z.string().optional(),
});

export const ProfileValue = z.object({
    notes: ProfileNotes.optional(),
    shippingDetails: ProfileShippingDetails.optional(),
});

/**
 * Note that this will not return the recent post title or url
 */
const postHandler: NextApiHandler = async (
    req: NextApiRequest,
    res: NextApiResponse<SequenceInfluencerManagerPage>,
) => {
    const id = String(req.query.id);
    const body = ProfileValue.parse(req.body);

    let sequenceInfluencer = await db(getSequenceInfluencerByIdCall)(id);
    if (!sequenceInfluencer.influencer_social_profile_id) {
        throw new RelayError('socialId not present');
    } else if (!sequenceInfluencer.username) {
        throw new RelayError('username not present');
    }
    let address = await db(getAddressByInfluencer)(sequenceInfluencer.influencer_social_profile_id);

    const { data: manager, error: getManagerError } = await db(getProfileByIdCall)(sequenceInfluencer.added_by);

    // @todo this should be wrapped inside getProfileByIdCall
    if (getManagerError) {
        throw getManagerError;
    }

    if (body.notes) {
        const {
            collabStatus: funnel_status,
            nextStep: next_step,
            fee: rate_amount,
            videoDetails: video_details,
            scheduledPostDate: scheduled_post_date,
        } = body.notes;

        sequenceInfluencer = await db(updateSequenceInfluencerCall)({
            funnel_status,
            next_step,
            rate_amount,
            video_details,
            scheduled_post_date: scheduled_post_date ? toISO(scheduled_post_date) : undefined,
            id: sequenceInfluencer.id,
        });
    }

    if (body.shippingDetails) {
        const {
            name,
            phoneNumber: phone_number,
            streetAddress: address_line_1,
            city,
            state,
            country,
            postalCode: postal_code,
            trackingCode: tracking_code,
        } = body.shippingDetails;
        if (!sequenceInfluencer.influencer_social_profile_id) {
            throw new RelayError('socialId not present'); // this won't happen, but we need to make TS happy
        }
        address = await db(saveAddressByInfluencer)(sequenceInfluencer.influencer_social_profile_id, {
            ...address,
            name,
            phone_number,
            address_line_1,
            city,
            state,
            country,
            postal_code,
            tracking_code,
            influencer_social_profile_id: sequenceInfluencer.influencer_social_profile_id,
            id: address?.id,
        });
    }

    return res.status(httpCodes.OK).json({
        ...sequenceInfluencer,
        manager_first_name: manager.first_name,
        address,
        recent_post_title: '',
        recent_post_url: '',
    });
};

export default ApiHandler({ postHandler });
