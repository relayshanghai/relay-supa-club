import type { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { InputTextArea } from '../textarea';
import { useTranslation } from 'react-i18next';
import { Send } from '../icons';

export const ReplyEditor = ({
    replyMessage,
    setReplyMessage,
}: {
    replyMessage: string;
    setReplyMessage: Dispatch<SetStateAction<string>>;
}) => {
    const { t } = useTranslation();

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setReplyMessage(e.target.value);
    };
    return (
        <div className="relative">
            <InputTextArea
                label=""
                className="h-36 rounded-md border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={t('inbox.replyPlaceholder') as string}
                value={replyMessage}
                onChange={(e) => handleInputChange(e)}
            />
            <div className="absolute bottom-3 left-3 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <button className="px-3 py-2" type="submit">
                    <Send className="h-4 w-4 shrink-0 stroke-gray-400 stroke-2 hover:stroke-primary-500" />
                </button>
            </div>
        </div>
    );
};
