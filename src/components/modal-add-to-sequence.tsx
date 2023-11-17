import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { useSequenceInfluencers } from 'src/hooks/use-sequence-influencers';
import { SendInfluencersToOutreach } from 'src/utils/analytics/events';

import type { Sequence, SequenceInfluencer } from 'src/utils/api/db';
import { clientLogger } from 'src/utils/logger-client';
import type { CreatorPlatform, CreatorUserProfile } from 'types';
import { Button } from './button';
import { Info } from './icons';
import { Modal } from './modal';
import type { SendInfluencersToOutreachPayload } from 'src/utils/analytics/events/boostbot/send-influencers-to-outreach';

// eslint-disable-next-line complexity
export const AddToSequenceModal = ({
    show,
    setShow,
    creatorProfile,
    platform,
    setSuppressReportFetch,
    sequence,
    setSequence,
    setSequenceInfluencer,
    sequences,
}: {
    show: boolean;
    setShow: (show: boolean) => void;
    creatorProfile: CreatorUserProfile;
    platform: CreatorPlatform;
    setSuppressReportFetch?: (suppress: boolean) => void;
    sequence: Sequence | null;
    setSequence: (sequence: Sequence | null) => void;
    setSequenceInfluencer: (sequenceInfluencer: SequenceInfluencer | null) => void;
    sequences: Sequence[];
}) => {
    const { t } = useTranslation();
    const { track } = useRudderstackTrack();
    const [submitting, setSubmitting] = useState<boolean>(false);
    const { createSequenceInfluencer } = useSequenceInfluencers(sequence ? [sequence.id] : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!sequences) {
            return;
        }
        const selectedSequenceObject = sequences?.find((sequence) => sequence.name === e.target.value) ?? null;
        setSequence(selectedSequenceObject);
    };

    const handleAddToSequence = useCallback(async () => {
        setSubmitting(true);
        let newSequenceInfluencer: Awaited<ReturnType<typeof createSequenceInfluencer>> | null = null;
        const trackingPayload: Omit<SendInfluencersToOutreachPayload, 'currentPage'> & { $add?: any } = {
            sequence_id: sequence?.id || '',
            influencer_ids: null,
            sequence_influencer_ids: null,
            sequence_influencer_id: null,
            is_success: true,
            is_sequence_autostart: sequence?.auto_start || false,
            is_multiple: false,
            topics: null,
        };
        try {
            if (!sequence) {
                track(SendInfluencersToOutreach, {
                    ...trackingPayload,
                    extra_info: { error: 'Missing sequence' },
                });
                throw new Error('Missing selectedSequence');
            }
            if (!creatorProfile.user_id) {
                track(SendInfluencersToOutreach, {
                    ...trackingPayload,
                    extra_info: { error: 'Missing creatorProfile.user_id' },
                });
                throw new Error('Missing creatorProfile.user_id');
            }

            if (!creatorProfile.username && !creatorProfile.handle) {
                throw new Error('Missing creatorProfile username and handle');
            }

            newSequenceInfluencer = await createSequenceInfluencer({
                name: creatorProfile.fullname ?? creatorProfile.username ?? creatorProfile.handle ?? '',
                username: creatorProfile.handle ?? creatorProfile.username ?? '',
                avatar_url: creatorProfile.picture || '',
                url: creatorProfile.url || '',
                iqdata_id: creatorProfile.user_id,
                sequence_id: sequence.id,
                platform,
            });
            setSequenceInfluencer(newSequenceInfluencer);
            trackingPayload.influencer_ids = [creatorProfile.user_id];
            trackingPayload.sequence_influencer_ids = [newSequenceInfluencer.id];
            trackingPayload.sequence_influencer_id = newSequenceInfluencer.id;
            trackingPayload['$add'] = { total_sequence_influencers: 1 };
            setSuppressReportFetch && setSuppressReportFetch(false); // will start getting the report.

            toast.success(t('creators.addToSequenceSuccess'));
            track(SendInfluencersToOutreach, trackingPayload);
            // when the report is fetched, we will update the sequence influencer row with the report data.
            // It will keep running when the modal is not visible
        } catch (error: any) {
            const errorMessageAndStack = `Message: ${error?.message}\nStack Trace: ${error?.stack}`;
            clientLogger(error, 'error');
            toast.error(t('creators.addToSequenceError'));

            trackingPayload.is_success = false;
            trackingPayload.extra_info = { error: errorMessageAndStack };
            track(SendInfluencersToOutreach, trackingPayload);
            setSubmitting(false);
            return;
        }
    }, [
        createSequenceInfluencer,
        creatorProfile.fullname,
        creatorProfile.picture,
        creatorProfile.url,
        creatorProfile.user_id,
        creatorProfile.username,
        creatorProfile.handle,
        platform,
        sequence,
        setSequenceInfluencer,
        setSuppressReportFetch,
        t,
        track,
    ]);

    return (
        <Modal
            title={t('creators.addToSequence') || ''}
            visible={show}
            onClose={() => {
                setShow(false);
            }}
        >
            <div className="space-y-4 p-6">
                <div>
                    <div className="mb-2 font-semibold text-gray-800">{t('creators.sequence')}</div>
                    <select
                        data-testid="sequence-dropdown"
                        onChange={(e) => handleSelectChange(e)}
                        value={sequence?.name}
                        className="-ml-1 mr-2.5 w-full cursor-pointer appearance-none rounded-md border border-gray-200 p-2 font-medium text-gray-500 outline-none  focus:border-primary-500 focus:ring-primary-500"
                    >
                        {(!sequences || sequences.length === 0) && <option>{t('creators.noSequence')}</option>}
                        {sequences?.map((sequence) => (
                            <option key={sequence.id}>{sequence.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-start rounded-md bg-primary-50 p-4">
                    <Info className="mr-4 mt-1 h-6 w-6 flex-none text-primary-500" />
                    <div className="space-y-4 text-primary-500">
                        <p>{t('creators.addToSequenceNotes')}</p>
                        <p>{t('creators.addToSequenceNotes2')}</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end space-x-3 p-6">
                <Button variant="secondary" onClick={() => setShow(false)}>
                    {t('creators.cancel')}
                </Button>

                <Button onClick={handleAddToSequence} type="submit" disabled={submitting}>
                    {t('creators.addToSequence')}
                </Button>
            </div>
        </Modal>
    );
};
