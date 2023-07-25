import { useCallback, useEffect, useState } from 'react';
import { clientLogger } from 'src/utils/logger-client';
import { cleanEmailBody } from 'src/utils/clean-html';
import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';
import { getMessageText } from 'src/utils/api/email-engine/handle-messages';

export const Email = ({ message }: { message: SearchResponseMessage }) => {
    // TODO: mark email as seen. Use update email endpoint /v1/account/{account}/messages
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const getText = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const { html } = await getMessageText(id);
            if (!html) {
                throw new Error('No html returned');
            }
            setContent(html);
        } catch (error: any) {
            clientLogger(error, 'error');
            throw error.message;
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (message.text.id && !loading && !content) {
            getText(message.text.id);
        }
    }, [content, getText, loading, message]);

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
