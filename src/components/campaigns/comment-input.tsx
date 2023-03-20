import type { ChangeEventHandler, KeyboardEvent} from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotes } from 'src/hooks/use-notes';
import { useUser } from 'src/hooks/use-user';
import type { CampaignCreatorDB } from 'src/utils/api/db';
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
        <div className=" w-full p-3 text-xs">
            <div className="flex items-center">
                <div className="row-center mr-4 h-6 w-6 rounded-full bg-primary-100 text-primary-500">
                    <div className="p-2">
                        {profile?.first_name ? profile.first_name[0].toUpperCase() : ''}
                        {profile?.last_name ? profile.last_name[0].toUpperCase() : ''}
                    </div>
                </div>
                <textarea
                    rows={1}
                    placeholder={t('campaigns.creatorModal.messagePlaceholder') as string}
                    className="textarea-field overflow-y-auto placeholder:text-xs"
                    value={comment}
                    onChange={handleInput}
                    onKeyDown={(e) => enterComment(e)}
                />
                <button
                    className="group ml-2 cursor-pointer appearance-none rounded-md  border border-gray-200 bg-gray-50 p-2 text-center text-gray-600 outline-none duration-300 hover:bg-gray-100"
                    onClick={() => handleComment(comment)}
                >
                    {loading ? (
                        <Spinner className=" h-4 w-4 fill-primary-600 text-white" />
                    ) : (
                        <Send className="h-4 w-4 fill-tertiary-600 group-hover:fill-primary-600" />
                    )}
                </button>
            </div>
        </div>
    );
}
