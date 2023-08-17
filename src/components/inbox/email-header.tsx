import { useTranslation } from 'react-i18next';
import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';

export const EmailHeader = ({ messages }: { messages: SearchResponseMessage[] }) => {
    const { i18n, t } = useTranslation();
    const lastMessageDate = messages[messages.length - 1]?.date;
    // TODO: connect with sequence

    return (
        <div className="flex w-full items-center justify-between border-b-2 border-tertiary-200 bg-primary-500 px-4 py-6 text-white">
            <div className="flex flex-col">
                <div className="mb-2 truncate px-4 text-2xl font-semibold">{messages[0]?.subject || 'subject'}</div>
                <div className="space-y-2 pl-4 font-semibold">
                    <div>{t('inbox.sequence')}:</div>
                    {/* <div>Product:</div> */}
                </div>
            </div>
            <div className="self-start px-4">
                {t('inbox.lastMessage')}:{' '}
                {new Date(lastMessageDate).toLocaleDateString(i18n.language, {
                    month: 'short',
                    day: 'numeric',
                })}{' '}
                {new Date(lastMessageDate).toLocaleTimeString(i18n.language, {
                    hour: 'numeric',
                    minute: 'numeric',
                })}
            </div>
        </div>
    );
};
