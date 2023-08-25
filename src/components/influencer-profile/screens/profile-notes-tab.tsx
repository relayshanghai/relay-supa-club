import type { SequenceInfluencerManagerPage } from 'pages/api/sequence/influencers';
import { useCallback, useEffect } from 'react';
import { useSequenceInfluencerNotes } from 'src/hooks/use-sequence-influencer-notes';
import { CollabAffiliateLinkInput } from '../components/collab-affiliate-link-input';
import { CollabFeeInput } from '../components/collab-fee-input';
import { CollabScheduledPostDateInput } from '../components/collab-scheduled-post-date-input';
import { CollabVideoDetailsInput } from '../components/collab-video-details-input';
import type { NoteData } from '../components/note';
import { OutreachCollabStatusInput } from '../components/outreach-collab-status-input';
import { OutreachNextStepsInput } from '../components/outreach-next-steps-input';
import { OutreachNotesInput } from '../components/outreach-notes-input';
import { useProfileScreenContext, useUiState } from '../screens/profile-screen-context';

export const COLLAB_STATUS_OPTIONS = [
    {
        id: 'negotiating',
        label: 'Negotiating',
        value: 10,
        style: 'bg-blue-100 text-blue-500',
    },
    {
        id: 'confirmed',
        label: 'Confirmed',
        value: 20,
        style: 'bg-primary-100 text-primary-500',
    },
    {
        id: 'shipped',
        label: 'Shipped',
        value: 30,
        style: 'bg-yellow-100 text-yellow-500',
    },
    {
        id: 'received',
        label: 'Received',
        value: 40,
        style: 'bg-green-100 text-green-500',
    },
    {
        id: 'contentApproval',
        label: 'Content Approval',
        value: 50,
        style: 'bg-pink-100 text-pink-500',
    },
    {
        id: 'posted',
        label: 'Posted',
        value: 60,
        style: 'bg-cyan-100 text-cyan-500',
    },
    {
        id: 'rejected',
        label: 'Rejected',
        value: 70,
        style: 'bg-red-100 text-red-500',
    },
];

export type ProfileNotes = {
    collabStatus: string;
    notes: string;
    nextStep: string;
    fee: string | number;
    videoDetails: string;
    affiliateLink: string;
    scheduledPostDate: string;
};

type Props = {
    profile: SequenceInfluencerManagerPage;
    onUpdate?: (key: keyof ProfileNotes, value: any) => void;
};

export const ProfileNotesTab = ({ profile, ...props }: Props) => {
    const { onUpdate } = { onUpdate: () => null, ...props };
    const { state: data } = useProfileScreenContext();
    const [_uiState, setUiState] = useUiState();
    const { getNotes, saveNote } = useSequenceInfluencerNotes();

    const handleSaveNotes = useCallback(
        (value: string) => {
            saveNote
                .call({
                    comment: value,
                    influencer_social_profile_id: profile.influencer_social_profile_id,
                    sequence_influencer_id: profile.id,
                })
                .then(() => {
                    saveNote.refresh();
                });
        },
        [profile, saveNote],
    );

    useEffect(() => {
        // load posts when the modal is opened
        if (getNotes.isLoading !== null) return;

        getNotes.call(profile.id, { current_user_only: true }).then((notes: NoteData[]) => {
            const currentNote: Partial<NoteData> = notes && notes.length > 0 ? notes[0] : { content: '' };
            onUpdate('notes', currentNote.content);
        });
        // @todo do some error handling
        // .catch((e) => console.error(e))
    }, [getNotes, onUpdate, profile]);

    return (
        <>
            <div className="grid grid-flow-row auto-rows-max gap-2">
                <div className="inline-flex items-center justify-between gap-2.5">
                    <div className="text-base font-semibold leading-normal tracking-tight text-gray-600">Outreach</div>
                </div>

                <OutreachCollabStatusInput
                    onUpdate={(data) => onUpdate('collabStatus', data)}
                    options={COLLAB_STATUS_OPTIONS}
                    selected={[data.notes.collabStatus]}
                />

                <OutreachNextStepsInput
                    value={data.notes.nextStep}
                    onChange={(e) => onUpdate('nextStep', e.currentTarget.value)}
                />

                <OutreachNotesInput
                    disabled={getNotes.isLoading === true || saveNote.isLoading === true}
                    value={data.notes.notes}
                    onUpdate={(value) => onUpdate('notes', value)}
                    onSave={handleSaveNotes}
                    onOpenList={() =>
                        setUiState((s) => {
                            return { ...s, isNotesListOverlayOpen: true };
                        })
                    }
                />

                <div className="h-px border border-neutral-200" />

                <div className="inline-flex items-center justify-between gap-2.5">
                    <div className="text-base font-semibold leading-normal tracking-tight text-gray-600">Collab</div>
                </div>

                <CollabFeeInput value={data.notes.fee} onInput={(e) => onUpdate('fee', e.currentTarget.value)} />
                <CollabVideoDetailsInput
                    value={data.notes.videoDetails}
                    onInput={(e) => onUpdate('videoDetails', e.currentTarget.value)}
                />
                <CollabAffiliateLinkInput
                    value={data.notes.affiliateLink}
                    onInput={(e) => onUpdate('affiliateLink', e.currentTarget.value)}
                />
                <CollabScheduledPostDateInput
                    value={data.notes.scheduledPostDate}
                    onInput={(e) => onUpdate('scheduledPostDate', e.currentTarget.value)}
                />
            </div>
        </>
    );
};
