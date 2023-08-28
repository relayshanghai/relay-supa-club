import { useState } from 'react';
import { useUser } from 'src/hooks/use-user';
import { sendReply } from 'src/utils/api/email-engine/handle-messages';
import { clientLogger } from 'src/utils/logger-client';
import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';
import { Spinner } from '../icons';
import { replaceNewlinesAndTabs } from '../sequences/helpers';
import { Email } from './Email';
import type { ThreadMessage } from './Threads';
import { Threads } from './Threads';
import { EmailHeader } from './email-header';
import { ReplyEditor } from './reply-editor';

export const CorrespondenceSection = ({
    selectedMessages,
    loadingSelectedMessages,
    onInfluencerClick,
}: {
    selectedMessages: SearchResponseMessage[];
    loadingSelectedMessages: boolean;
    onInfluencerClick?: (message: ThreadMessage['from']) => void;
}) => {
    const [replyMessage, setReplyMessage] = useState<string>('');
    const { profile } = useUser();

    const handleSubmit = async (replyMessage: string) => {
        if (!profile?.email_engine_account_id) {
            throw new Error('No email account');
        }
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
            await sendReply(replyBody, profile?.email_engine_account_id);
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
                    <div className="flex-1 overflow-auto">
                        <EmailHeader messages={selectedMessages} />
                        {selectedMessages.length > 1 ? (
                            <Threads messages={selectedMessages} onInfluencerClick={onInfluencerClick} />
                        ) : (
                            <>{selectedMessages.length > 0 && <Email message={selectedMessages[0]} />}</>
                        )}
                    </div>
                    <div className="justify-self-end px-6 pb-4">
                        <ReplyEditor
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
