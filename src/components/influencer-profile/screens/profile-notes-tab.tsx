import { useCallback, useEffect } from 'react';
import { useAsync } from 'src/hooks/use-async';
import { apiFetch } from 'src/utils/api/api-fetch';
import type { CampaignNotes } from 'src/utils/api/db';
import { useProfileScreenContext, useUiState } from '../screens/profile-screen-context';
import { CollabAffiliateLinkInput } from '../components/collab-affiliate-link-input';
import { CollabFeeInput } from '../components/collab-fee-input';
import { CollabScheduledPostDateInput } from '../components/collab-scheduled-post-date-input';
import { CollabVideoDetailsInput } from '../components/collab-video-details-input';
import { OutreachCollabStatusInput } from '../components/outreach-collab-status-input';
import { OutreachNextStepsInput } from '../components/outreach-next-steps-input';
import { OutreachNotesInput } from '../components/outreach-notes-input';
import type { Profile } from '../components/profile-header';

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
    fee: string;
    videoDetails: string;
    affiliateLink: string;
    scheduledPostDate: string;
};

type Props = {
    // @todo author and profile optional for now
    author?: { id: string };
    profile?: Profile;
    onUpdate?: (key: keyof ProfileNotes, value: any) => void;
};

export const ProfileNotesTab = ({ profile, author, ...props }: Props) => {
    const { onUpdate } = { onUpdate: () => null, ...props };
    const { state: data } = useProfileScreenContext();
    const [, setUiState] = useUiState();

    const getNotes = useAsync(async (sequence_influencer_id: string, author: string) => {
        return await apiFetch('/api/notes/influencer/{id}', {
            path: { id: sequence_influencer_id },
            query: { author },
        });
    });

    const saveNote = useAsync(async (body: CampaignNotes['Insert']) => {
        await apiFetch('/api/notes/influencer', { body });
    });

    const handleSaveNotes = useCallback(
        (value: string) => {
            saveNote.call({
                comment: value,
                //  @todo still no concrete profile / author shape
                influencer_social_profile_id: profile?.influencer_id ?? '5941a215-1b36-4f60-95b1-6eea3e4b3c3b',
                sequence_influencer_id: profile?.id ?? '1378068d-d985-4fc7-a019-79d483d5dc1d',
                user_id: author?.id ?? 'af5d4b21-b5c5-4849-a441-d7abbe33d612',
            });
        },
        [author, profile, saveNote],
    );

    useEffect(() => {
        // load posts when the modal is opened
        if (getNotes.isLoading !== null) return;
        // influencer_social_profile_id: profile?.influencer_id ?? '5941a215-1b36-4f60-95b1-6eea3e4b3c3b',
        // sequence_influencer_id: profile?.id ?? '1378068d-d985-4fc7-a019-79d483d5dc1d',
        // user_id: author?.id ?? 'af5d4b21-b5c5-4849-a441-d7abbe33d612',
        getNotes.call('1378068d-d985-4fc7-a019-79d483d5dc1d', 'af5d4b21-b5c5-4849-a441-d7abbe33d612').then((notes) => {
            const _notes = notes[0] ?? { comment: '' };

            onUpdate('notes', _notes.comment);
            // setValue((s) => {
            //     return { ...s, notes: { ...s.notes, notes: _notes.comment } };
            // });
        });
        // @todo do some error handling
        // .catch((e) => console.error(e))
    }, [getNotes, onUpdate]);

    return (
        <>
            <div className="grid grid-flow-row auto-rows-max gap-2">
                <div className="inline-flex items-center justify-between gap-2.5">
                    <div className="text-base font-semibold leading-normal tracking-tight text-gray-600">Outreach</div>
                </div>

                <OutreachCollabStatusInput
                    onUpdate={(data) => onUpdate('collabStatus', data)}
                    options={COLLAB_STATUS_OPTIONS}
                    selected={['negotiating']}
                />

                <OutreachNextStepsInput
                    value={data.notes.nextStep}
                    onChange={(e) => onUpdate('nextStep', e.currentTarget.value)}
                />

                <OutreachNotesInput
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
