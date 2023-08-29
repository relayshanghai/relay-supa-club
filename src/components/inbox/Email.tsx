import { useCallback, useEffect, useState } from 'react';
import { clientLogger } from 'src/utils/logger-client';
import { cleanEmailBody } from 'src/utils/clean-html';
import type { SearchResponseMessage } from 'types/email-engine/account-account-search-post';
import { getMessageText } from 'src/utils/api/email-engine/handle-messages';
import { Spinner } from '../icons';
import { useUser } from 'src/hooks/use-user';

export const Email = ({ message }: { message: SearchResponseMessage }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const { profile } = useUser();

    const getText = useCallback(
        async (id: string) => {
            if (!profile?.email_engine_account_id) {
                return;
            }
            setLoading(true);
            try {
                const { html } = await getMessageText(id, profile.email_engine_account_id);
                if (!html) {
                    throw new Error('No html returned');
                }
                setContent(html);
            } catch (error: any) {
                clientLogger(error, 'error');
                throw new Error('Error fetching email: ' + error.message);
            } finally {
                setLoading(false);
            }
        },
        [profile?.email_engine_account_id],
    );

    useEffect(() => {
        if (message.text.id && !loading && !content) {
            getText(message.text.id);
        }
    }, [content, getText, loading, message]);

    return (
        <div className="h-full p-3">
            <h3 className={`mb-2 text-lg font-bold`}>{message.subject}</h3>
            {loading ? (
                <div className="flex h-full items-center justify-center">
                    <Spinner className="h-6 w-6 fill-primary-600 text-primary-200" />
                </div>
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
