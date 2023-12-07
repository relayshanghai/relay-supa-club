import { useTranslation } from 'react-i18next';
import type { MessagesGetMessage } from 'types/email-engine/account-account-messages-get';
import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';

export const PreviewCard = ({
    message,
    selectedMessage,
    handleGetThreadEmails,
    loadingSelectedMessages,
}: {
    message: MessagesGetMessage;
    selectedMessage: SearchResponseMessage | null;
    handleGetThreadEmails: (message: MessagesGetMessage) => Promise<void>;
    loadingSelectedMessages: boolean;
}) => {
    const { i18n } = useTranslation();
    return (
        <div
            onClick={() => handleGetThreadEmails(message)}
            className={`${
                selectedMessage?.id === message.id
                    ? 'border-2  border-primary-500  bg-primary-100 text-primary-500'
                    : 'border-b-2 border-tertiary-200'
            } group flex h-24 cursor-pointer items-center justify-between  p-3 duration-200 hover:bg-tertiary-200 hover:bg-opacity-50 focus:bg-primary-200 ${
                loadingSelectedMessages && 'disabled'
            } `}
        >
            <div
                className={`mr-1 h-1.5 w-1.5 rounded-full bg-primary-500 opacity-0 ${message.unseen && 'opacity-100'}`}
            />
            <div className="flex w-11/12 flex-col justify-center space-y-1">
                <div
                    className={`overflow-hidden text-sm font-bold  ${
                        selectedMessage?.id === message.id ? 'text-primary-500' : 'text-tertiary-500'
                    }`}
                >
                    {message.from.name || message.from.address}
                </div>
                <div className="flex items-center justify-between text-xs text-tertiary-400">
                    <div
                        className={`truncate font-bold ${
                            message.unseen || (selectedMessage?.id === message.id && 'text-primary-500')
                        }`}
                    >
                        {message.subject}
                    </div>
                    <div
                        className={`font-base ${
                            selectedMessage?.id === message.id && 'text-primary-500'
                        } ml-2 min-w-fit`}
                    >
                        {' '}
                        {new Date(message.date).toLocaleDateString(i18n.language, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}{' '}
                    </div>
                </div>
                <div className="flex items-center justify-between text-xs text-tertiary-400">
                    {/* TODO: add preview text after document store is implemented V2-578 */}
                    {/* <div className="truncate">{message.text.id}</div> */}
                </div>
            </div>
        </div>
    );
};
