import { useTranslation } from 'react-i18next';
import { useUser } from 'src/hooks/use-user';
import type { CampaignNotesWithProfiles } from 'src/utils/api/db';
import { Pin, Trashcan } from 'src/components/icons';

export default function CommentCard({ note }: { note: CampaignNotesWithProfiles }) {
    const { i18n } = useTranslation();
    const { profile } = useUser();
    const isYou = profile?.id === note?.user_id;

    return (
        <div
            className={` relative group hover:bg-gray-50 rounded-md p-4 w-[300px] duration-300 flex flex-col ${
                isYou ? 'place-self-end ' : 'place-self-start'
            }`}
        >
            <div className="z-20 absolute flex space-x-1 top-2 right-2 bg-gray-100 invisible group-hover:visible ease-in-out duration-150">
                <div className="group/pin p-2 rounded-md text-gray-600  bg-gray-50 hover:bg-gray-100 border border-gray-200 duration-300 outline-none appearance-none text-center cursor-pointer">
                    <Pin className="w-4 h-4 fill-tertiary-600 group-hover/pin:fill-primary-600" />
                </div>
                <div className="group/trashcan p-2 rounded-md text-gray-600  bg-gray-50 hover:bg-gray-100 border border-gray-200 duration-300 outline-none appearance-none text-center cursor-pointer">
                    <Trashcan className="w-4 h-4 fill-tertiary-600 group-hover/trashcan:fill-primary-600" />
                </div>
            </div>
            <div className="">
                <div className="flex align-center">
                    <div className="rounded-full w-6 h-6 row-center bg-primary-100 text-primary-500 mr-4">
                        <div className="p-2">
                            {note.profiles.first_name
                                ? note.profiles.first_name[0].toUpperCase()
                                : ''}
                            {note.profiles.last_name
                                ? note.profiles.last_name[0].toUpperCase()
                                : ''}
                        </div>
                    </div>
                    <div className="font-medium text-gray-800 capitalize mr-2 self-center">
                        {note.profiles.first_name} {note.profiles.last_name}
                    </div>
                    <div className="text-gray-400 self-center">
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
                    }`}
                >
                    {note?.comment}
                </div>
            </div>
        </div>
    );
}
