import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useUser } from 'src/hooks/use-user';
import type { CampaignNotesWithProfiles } from 'src/utils/api/db';
import { Pin, Trashcan } from 'src/components/icons';
import { useNotes } from 'src/hooks/use-notes';

export default function CommentCard({ note }: { note: CampaignNotesWithProfiles }) {
    const { t, i18n } = useTranslation();
    const { profile } = useUser();
    const { deleteNote, updateNote, refreshNotes } = useNotes({
        campaignCreatorId: note.campaign_creator_id,
    });
    const isYou = profile?.id === note?.user_id;
    const isImportant = note.important === true;

    const handleDelete = async (note: CampaignNotesWithProfiles) => {
        const c = confirm(t('campaigns.notes.deleteConfirmation') as string);
        if (!c) return;
        await deleteNote(note);
        refreshNotes();
        toast.success(t('campaigns.notes.deletedSuccessfully'));
    };

    const toggleImportant = async (note: CampaignNotesWithProfiles) => {
        note.important = !note.important;
        await updateNote(note);
        refreshNotes();
        toast.success(t('campaigns.notes.updateSuccessfully'));
    };

    return (
        <div
            className={` group relative mb-2 flex w-[300px] flex-col rounded-md p-4 duration-300 hover:bg-gray-50 ${
                isYou ? 'place-self-end ' : 'place-self-start'
            } & ${isImportant ? 'bg-secondary-100' : ''}`}
        >
            <div
                className={`absolute -top-2 flex  fill-primary-500 ${isImportant ? '' : 'hidden'} ${
                    isYou ? 'right-2' : 'left-2'
                }`}
            >
                <Pin className="h-4 w-4" />
            </div>

            <div
                className={`invisible absolute -top-2 z-20 flex space-x-1 bg-gray-100 group-hover:visible  ${
                    isYou ? 'left-3' : 'right-3'
                }`}
            >
                <div
                    className="group/pin cursor-pointer appearance-none rounded-md  border border-gray-200 bg-gray-50 p-2 text-center text-gray-600 outline-none duration-300 hover:bg-gray-100"
                    onClick={() => toggleImportant(note)}
                >
                    <Pin className="h-4 w-4 fill-tertiary-600 group-hover/pin:fill-primary-600" />
                </div>
                <div
                    className={`group/trashcan cursor-pointer appearance-none rounded-md  border border-gray-200 bg-gray-50 p-2 text-center text-gray-600 outline-none duration-300 hover:bg-gray-100 ${
                        isYou ? ' ' : 'hidden'
                    }`}
                    onClick={() => handleDelete(note)}
                >
                    <Trashcan className="h-4 w-4 fill-tertiary-600 group-hover/trashcan:fill-primary-600" />
                </div>
            </div>

            <div className={`flex ${isYou ? 'flex-row-reverse' : ''}`}>
                <div className="row-center h-6 w-6 rounded-full bg-gray-200 text-gray-500 ">
                    <div className="p-2">
                        {note.profiles.first_name ? note.profiles.first_name[0].toUpperCase() : ''}
                        {note.profiles.last_name ? note.profiles.last_name[0].toUpperCase() : ''}
                    </div>
                </div>
                <div className="mx-3 self-center font-medium capitalize text-gray-800">{note.profiles.first_name}</div>
                <div className="self-center text-gray-400">
                    {/* Replace this when settle with a date formatting library or function on Ticket V2-36 */}
                    {note.created_at &&
                        `${new Date(note.created_at).toLocaleDateString(i18n.language, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })} ${new Date(note.created_at).toLocaleTimeString(i18n.language, {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}`}
                </div>
            </div>
            <div
                className={`mt-2  w-fit max-w-[200px] rounded-md px-3 py-1 ${
                    isYou ? 'place-self-end bg-primary-100' : 'place-self-start bg-gray-50'
                } `}
            >
                {note?.comment}
            </div>
        </div>
    );
}
