import { useCallback, useEffect, useState } from 'react';
import { nextFetch } from 'src/utils/fetcher';
import { testAccount } from 'src/utils/api/email-engine/prototype-mocks';
import type { GetEmailPostRequestBody, GetEmailPostResponseBody } from 'pages/api/email-engine/email-text';
import { clientLogger } from 'src/utils/logger-client';
import { cleanEmailBody } from 'src/utils/clean-html';
import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';

export const Email = ({ message }: { message: SearchResponseMessage }) => {
    // TODO: mark email as seen. Use update email endpoint /v1/account/{account}/messages

    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
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
            setContent(html);
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
        <div>
            <h3 className={`mb-2 text-lg font-bold`}>{message.subject}</h3>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div
                    className="overflow-y-auto"
                    dangerouslySetInnerHTML={{
                        __html: cleanEmailBody(content),
                    }}
                />
            )}
        </div>
    );
};
