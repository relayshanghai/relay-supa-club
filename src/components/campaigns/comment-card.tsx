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
            className={` relative group hover:bg-gray-50 rounded-md p-4 mb-2 w-[300px] duration-300 flex flex-col ${
                isYou ? 'place-self-end ' : 'place-self-start'
            } & ${isImportant ? 'bg-secondary-100' : ''}`}
        >
            <Pin
                className={`w-4 h-4 fill-primary-600 absolute -top-1 -left-1 ${
                    isImportant ? '' : 'hidden'
                }`}
            />

            <div
                className={`z-20 absolute flex space-x-1 -top-3 bg-gray-100 invisible group-hover:visible  ${
                    isYou ? 'left-3' : 'right-3'
                }`}
            >
                <div
                    className="group/pin p-2 rounded-md text-gray-600  bg-gray-50 hover:bg-gray-100 border border-gray-200 duration-300 outline-none appearance-none text-center cursor-pointer"
                    onClick={() => toggleImportant(note)}
                >
                    <Pin className="w-4 h-4 fill-tertiary-600 group-hover/pin:fill-primary-600" />
                </div>
                <div
                    className={`group/trashcan p-2 rounded-md text-gray-600  bg-gray-50 hover:bg-gray-100 border border-gray-200 duration-300 outline-none appearance-none text-center cursor-pointer ${
                        isYou ? ' ' : 'hidden'
                    }`}
                    onClick={() => handleDelete(note)}
                >
                    <Trashcan className="w-4 h-4 fill-tertiary-600 group-hover/trashcan:fill-primary-600" />
                </div>
            </div>

            <div className={`flex ${isYou ? 'flex-row-reverse' : ''}`}>
                <div className="rounded-full w-6 h-6 row-center bg-gray-200 text-gray-500 ">
                    <div className="p-2">
                        {note.profiles.first_name ? note.profiles.first_name[0].toUpperCase() : ''}
                        {note.profiles.last_name ? note.profiles.last_name[0].toUpperCase() : ''}
                    </div>
                </div>
                <div className="font-medium text-gray-800 capitalize self-center mx-3">
                    {note.profiles.first_name}
                </div>
                <div className="text-gray-400 self-center">
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
                className={`mt-2 ml-10 px-3 py-1 w-fit max-w-[200px] rounded-md ${
                    isYou ? 'place-self-end bg-primary-100' : 'place-self-start bg-gray-50'
                } `}
            >
                {note?.comment}
            </div>
        </div>
    );
}
