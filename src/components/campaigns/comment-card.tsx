import { useTranslation } from 'react-i18next';
import { useUser } from 'src/hooks/use-user';
import type { CampaignNotesWithProfiles } from 'src/utils/api/db';

export default function CommentCard({ note }: { note: CampaignNotesWithProfiles }) {
    const { i18n } = useTranslation();
    const { profile } = useUser();
    const isYou = profile?.id === note?.user_id;

    return (
        <div
            className={`bg-gray-50 p-3 w-[300px] duration-300 flex flex-col mb-2 rounded-xl ${
                isYou ? 'place-self-end' : 'place-self-start'
            }`}
        >
            <div className="flex align-center space-x-2">
                <div className="rounded-full w-6 h-6 p-1 row-center bg-primary-100 text-primary-500">
                    {/* temp placeholder texts below to be replaced in V2-139h */}
                    <div className="p-2">
                        {note.profiles.first_name ? note.profiles.first_name[0].toUpperCase() : ''}
                        {note.profiles.last_name ? note.profiles.last_name[0].toUpperCase() : ''}
                    </div>
                </div>
                {/* temp placeholder texts below to be replaced in V2-139h */}
                <div className="font-medium ">
                    {note.profiles.first_name} {note.profiles.last_name}
                </div>
                <div className="text-gray-400">
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
            <div className="mb-2 pl-8">{note?.comment}</div>
        </div>
    );
}
