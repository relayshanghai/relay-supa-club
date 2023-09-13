import { useState } from 'react';
import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';
import { Spinner } from '../icons';
import { Email } from './Email';
import type { ThreadMessage } from './Threads-dummy';
import { Threads } from './Threads-dummy';
import { EmailHeader } from './email-header-dummy';
import { ReplyEditor } from './reply-editor-dummy';

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

    return (
        <div className="h-full">
            {loadingSelectedMessages ? (
                <div className="flex h-full items-center justify-center">
                    <Spinner className="h-6 w-6 fill-primary-600 text-primary-200" />
                </div>
            ) : (
                <div className="flex h-full flex-col overflow-y-auto">
                    <EmailHeader messages={selectedMessages} />
                    <div className="flex-1 overflow-auto">
                        {selectedMessages.length > 1 ? (
                            <Threads messages={selectedMessages} onInfluencerClick={onInfluencerClick} />
                        ) : (
                            <>{selectedMessages.length > 0 && <Email message={selectedMessages[0]} />}</>
                        )}
                    </div>
                    <div className="justify-self-end px-6 pb-4">
                        <ReplyEditor replyMessage={replyMessage} setReplyMessage={setReplyMessage} />
                    </div>
                </div>
            )}
        </div>
    );
};
