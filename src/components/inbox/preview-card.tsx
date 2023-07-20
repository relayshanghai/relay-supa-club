import { useCallback, useEffect, useState } from 'react';
import dateFormat from 'src/utils/dateFormat';
import { nextFetch } from 'src/utils/fetcher';
import type { MessagesGetMessage } from 'types/email-engine/account-account-messages-get';
import type { GetEmailPostRequestBody, GetEmailPostResponseBody } from 'pages/api/email-engine/email-text';
import { clientLogger } from 'src/utils/logger-client';
import { cleanEmailBody } from 'src/utils/clean-html';
import { testAccount } from 'src/utils/api/email-engine/prototype-mocks';

export const PreviewCard = ({
    message,
    handleGetThreadEmails,
    loadingSelectedMessages,
}: {
    message: MessagesGetMessage;
    handleGetThreadEmails: (message: MessagesGetMessage) => Promise<void>;
    loadingSelectedMessages: boolean;
}) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const extractPreviewMessage = (html: string): string => {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;
        const text = tempElement.textContent?.trim() || '';
        const sentences = text.split(/(?<=[.!?:])\s+/);

        const previewMessage = sentences[0] || '';

        return previewMessage;
    };

    const getText = useCallback(async (id: string) => {
        setLoading(true);
        const body: GetEmailPostRequestBody = {
            account: testAccount,
            emailId: id,
        };
        try {
            const { html } = await nextFetch<GetEmailPostResponseBody>('email-engine/email-text', {
                method: 'POST',
                body,
            });
            const previewMessage = extractPreviewMessage(html);
            setContent(previewMessage);
        } catch (error: any) {
            clientLogger(error, 'error');
            setContent('Error fetching email: ' + error.message);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (message.text.id && !loading && !content) {
            getText(message.text.id);
        }
    }, [content, getText, loading, message.text]);

    return (
        <div
            onClick={() => handleGetThreadEmails(message)}
            className={`group flex h-24 cursor-pointer items-center justify-between border-b-2 border-r-2 border-tertiary-200 p-3 duration-200 hover:bg-tertiary-200 hover:bg-opacity-50 ${
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
                    {/* <div className="truncate">{message.text.id}</div> */}
                    <div
                        className="truncate"
                        dangerouslySetInnerHTML={{
                            __html: cleanEmailBody(content),
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
