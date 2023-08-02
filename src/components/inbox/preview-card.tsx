import dateFormat from 'src/utils/dateFormat';
import type { MessagesGetMessage } from 'types/email-engine/account-account-messages-get';

export const PreviewCard = ({
    message,
    handleGetThreadEmails,
    loadingSelectedMessages,
}: {
    message: MessagesGetMessage;
    handleGetThreadEmails: (message: MessagesGetMessage) => Promise<void>;
    loadingSelectedMessages: boolean;
}) => {
    return (
        <div
            onClick={() => handleGetThreadEmails(message)}
            className={`group flex h-24 cursor-pointer items-center justify-between border-b-2 border-tertiary-200 p-3 duration-200 hover:bg-tertiary-200 hover:bg-opacity-50 focus:bg-primary-200 ${
                loadingSelectedMessages && 'disabled'
            }`}
        >
            <div
                className={`mr-1 h-1.5 w-1.5 rounded-full bg-primary-500 opacity-0 ${message.unseen && 'opacity-100'}`}
            />
            <div className="flex w-11/12 flex-col justify-center space-y-1">
                <div className="overflow-hidden text-sm font-bold text-tertiary-500">
                    {message.from.name || message.from.address}
                </div>
                <div className="flex items-center justify-between text-xs text-tertiary-400">
                    <div className={`truncate font-bold ${message.unseen && 'text-primary-500'}`}>
                        {message.subject}
                    </div>
                    <div className="font-base ml-2 min-w-fit">{dateFormat(message.date, 'isoDate', true, true)} </div>
                </div>
                <div className="flex items-center justify-between text-xs text-tertiary-400">
                    {/* TODO: add preview text after document store is implemented V2-578 */}
                    {/* <div className="truncate">{message.text.id}</div> */}
                </div>
            </div>
        </div>
    );
};
