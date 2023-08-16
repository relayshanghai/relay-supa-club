import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';
import { Spinner } from '../icons';
import { Email } from './Email';
import { Threads } from './Threads';
import { ReplayEditor } from './replay-editor';
import { useState } from 'react';
import { sendReply } from 'src/utils/api/email-engine/handle-messages';
import { clientLogger } from 'src/utils/logger-client';
import { EmailHeader } from './email-header';
import { replaceNewlinesAndTabs } from '../sequences/helpers';

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
            html: replaceNewlinesAndTabs(replyMessage),
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
                <div className="flex h-full items-center justify-center">
                    <Spinner className="h-6 w-6 fill-primary-600 text-primary-200" />
                </div>
            ) : (
                <div className="flex h-full flex-col overflow-y-auto">
                    <EmailHeader messages={selectedMessages} />
                    {selectedMessages.length > 1 ? (
                        <Threads messages={selectedMessages} />
                    ) : (
                        <>{selectedMessages.length > 0 && <Email message={selectedMessages[0]} />}</>
                    )}

                    <div className="justify-self-end px-6 pb-4">
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
