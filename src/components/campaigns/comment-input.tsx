import { ChangeEventHandler, KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotes } from 'src/hooks/use-notes';
import { useUser } from 'src/hooks/use-user';
import { CampaignCreatorDB } from 'src/utils/api/db';
import { clientLogger } from 'src/utils/logger';
import { Send, Spinner } from '../icons';
import toast from 'react-hot-toast';

export default function CommentInput({
    currentCreator,
}: {
    currentCreator: CampaignCreatorDB | null;
}) {
    const { t } = useTranslation();
    const [comment, setComment] = useState('');
    const { createNote, loading } = useNotes({ campaignCreatorId: currentCreator?.id });
    const { profile } = useUser();

    const handleComment = async (comment: string) => {
        if (comment === '') return toast.error(t('campaigns.notes.emptyComment'));
        if (profile && currentCreator) {
            try {
                await createNote({
                    campaign_creator_id: currentCreator.id,
                    user_id: profile?.id,
                    comment,
                    important: false,
                });
            } catch (error) {
                clientLogger(error, 'error');
            }
        }

        setComment('');
    };
    const handleInput: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setComment(e.target.value);
    };

    const enterComment = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleComment(comment);
        }
    };

    return (
        <div className=" text-xs p-3 w-full">
            <div className="flex items-center">
                <div className="rounded-full w-6 h-6 row-center bg-primary-100 text-primary-500 mr-4">
                    <div className="p-2">
                        {profile?.first_name ? profile.first_name[0].toUpperCase() : ''}
                        {profile?.last_name ? profile.last_name[0].toUpperCase() : ''}
                    </div>
                </div>
                <textarea
                    rows={1}
                    placeholder={t('campaigns.creatorModal.messagePlaceholder') as string}
                    className="textarea-field placeholder:text-xs overflow-y-auto"
                    value={comment}
                    onChange={handleInput}
                    onKeyDown={(e) => enterComment(e)}
                />
                <button
                    className="group p-2 ml-2 rounded-md text-gray-600  bg-gray-50 hover:bg-gray-100 border border-gray-200 duration-300 outline-none appearance-none text-center cursor-pointer"
                    onClick={() => handleComment(comment)}
                >
                    {loading ? (
                        <Spinner className=" fill-primary-600 text-white w-4 h-4" />
                    ) : (
                        <Send className="w-4 h-4 fill-tertiary-600 group-hover:fill-primary-600" />
                    )}
                </button>
            </div>
        </div>
    );
}
