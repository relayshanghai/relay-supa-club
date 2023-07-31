import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';
import { Spinner } from '../icons';
import { Email } from './Email';
import { Threads } from './Threads';
import { ReplayEditor } from './replay-editor';
import { useState } from 'react';
import { sendReply } from 'src/utils/api/email-engine/handle-messages';
import { clientLogger } from 'src/utils/logger-client';

export const CorrespondenceSection = ({
    selectedMessages,
    loadingSelectedMessages,
}: {
    selectedMessages: SearchResponseMessage[];
    loadingSelectedMessages: boolean;
}) => {
    const [replyMessage, setReplyMessage] = useState<string>('');

    const handleSubmit = async (replyMessage: string) => {
        if (replyMessage === '') {
            return;
        }
        const replyBody = {
            reference: {
                message: selectedMessages[selectedMessages.length - 1].id,
                action: 'reply',
            },
            html: replyMessage,
        };
        try {
            await sendReply(replyBody);
            setReplyMessage('');
        } catch (error) {
            clientLogger(error, 'error');
        }
    };

    return (
        <div className="h-full">
            {loadingSelectedMessages ? (
                <div className="h-full">
                    <Spinner className="h-6 w-6 fill-primary-600 text-primary-200" />
                </div>
            ) : (
                <div className="flex h-full flex-col overflow-y-auto">
                    {selectedMessages.length > 1 ? (
                        <Threads messages={selectedMessages} />
                    ) : (
                        <>{selectedMessages.length > 0 && <Email message={selectedMessages[0]} />}</>
                    )}

                    <div className="justify-self-end">
                        <ReplayEditor
                            replyMessage={replyMessage}
                            setReplyMessage={setReplyMessage}
                            handleSubmit={handleSubmit}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
