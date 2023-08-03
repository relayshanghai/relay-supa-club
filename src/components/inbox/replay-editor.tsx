import type { Dispatch, SetStateAction, ChangeEvent } from 'react';
import { Button } from '../button';
import { InputTextArea } from '../textarea';
import { useTranslation } from 'react-i18next';

export const ReplayEditor = ({
    replyMessage,
    setReplyMessage,
    handleSubmit,
}: {
    replyMessage: string;
    setReplyMessage: Dispatch<SetStateAction<string>>;
    handleSubmit: (replyMessage: string) => Promise<void>;
}) => {
    const { t } = useTranslation();

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setReplyMessage(e.target.value);
    };
    return (
        <div className="relative">
            <InputTextArea
                label=""
                className="h-36 rounded-md border-gray-200 text-xs"
                placeholder={t('inbox.replyPlaceholder') as string}
                value={replyMessage}
                onChange={(e) => handleInputChange(e)}
            />
            <Button className="absolute bottom-2 left-2" type="submit" onClick={() => handleSubmit(replyMessage)}>
                {t('inbox.send')}
            </Button>
        </div>
    );
};
