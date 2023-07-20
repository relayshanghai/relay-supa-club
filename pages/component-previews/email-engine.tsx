import { useRouter } from 'next/router';
import type { GetAuthLinkPostRequestBody, GetAuthLinkPostResponseBody } from 'pages/api/email-engine/auth-link';
import type { SendEmailPostRequestBody } from 'pages/api/email-engine/send-email';
import { useState } from 'react';
import { Button } from 'src/components/button';
import { Input } from 'src/components/input';
import { useUser } from 'src/hooks/use-user';
import { nextFetch } from 'src/utils/fetcher';
import { clientLogger } from 'src/utils/logger-client';

export default function EmailEngine() {
    const { profile } = useUser();
    const router = useRouter();
    const query = router.query;
    const { account } = query; // We'll want to add this to the user's profile
    const redirectToAuthLink = async () => {
        const body: GetAuthLinkPostRequestBody = {
            redirectUrl: window.location.href,
            name: `${profile?.first_name} ${profile?.last_name}`,
            // email: profile?.email || '',
            account: profile?.id,
        };
        const { url } = await nextFetch<GetAuthLinkPostResponseBody>('email-engine/auth-link', {
            method: 'POST',
            body,
        });
        if (url) {
            window.location.href = url;
        } else {
            alert('Something went wrong');
        }
    };
    const [sendingEmail, setSendingEmail] = useState(false);
    const sendEmail = async () => {
        if (typeof account !== 'string') return;
        setSendingEmail(true);
        try {
            const body: SendEmailPostRequestBody = {
                account,
                to: [{ address: toEmail }],
                subject: 'testing Email Engine',
                text,
            };
            const res = await nextFetch('email-engine/send-email', {
                method: 'POST',
                body,
            });
            clientLogger(res);
        } catch (error) {
            alert('Something went wrong');
        }
        setSendingEmail(false);
    };

    const [toEmail, setToEmail] = useState('');
    const [text, setText] = useState('');
    return (
        <div>
            {account ? (
                <div>
                    Account: {account}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendEmail();
                        }}
                    >
                        <Input
                            type="text"
                            required
                            placeholder="Enter receiver's email"
                            value={toEmail}
                            label={'TO'}
                            onChange={(e) => setToEmail(e.target.value)}
                        />
                        <Input
                            type="text"
                            required
                            placeholder="Enter text"
                            value={text}
                            label={'TEXT'}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <Button disabled={sendingEmail || !text || !toEmail} type="submit">
                            Send Email
                        </Button>
                    </form>
                </div>
            ) : (
                <>
                    {profile?.email ? (
                        <Button onClick={redirectToAuthLink}>Add email account</Button>
                    ) : (
                        <div>loading</div>
                    )}
                </>
            )}
        </div>
    );
}
