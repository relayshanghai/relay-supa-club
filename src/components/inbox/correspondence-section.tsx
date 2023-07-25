import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';
import { Spinner } from '../icons';
import { Email } from './Email';
import { Threads } from './Threads';
import { ReplayEditor } from './replay-editor';

export const CorrespondenceSection = ({
    selectedMessages,
    loadingSelectedMessages,
}: {
    selectedMessages: SearchResponseMessage[];
    loadingSelectedMessages: boolean;
}) => {
    return (
        <div className="h-full ">
            {loadingSelectedMessages ? (
                <div className="flex h-full w-full items-center justify-center">
                    <Spinner className="h-6 w-6 fill-primary-600 text-primary-200" />
                </div>
            ) : (
                <div className="relative flex w-full flex-col justify-between  p-3">
                    <div className="mb-6 overflow-y-auto">
                        {selectedMessages.length > 1 ? (
                            <Threads messages={selectedMessages} />
                        ) : (
                            <>{selectedMessages.length > 0 && <Email message={selectedMessages[0]} />}</>
                        )}
                    </div>
                    <div className="fixed bottom-0 w-full">
                        <ReplayEditor />
                    </div>
                </div>
            )}
        </div>
    );
};
