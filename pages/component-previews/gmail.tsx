import { useRouter } from 'next/router';
import { GmailPostBody } from 'pages/api/gmail';
import { useEffect, useState } from 'react';
import { Button } from 'src/components/button';
import { useUser } from 'src/hooks/use-user';
import { nextFetch } from 'src/utils/fetcher';

export default function Gmail() {
    const { profile } = useUser();
    const [url, setUrl] = useState('');
    const router = useRouter();
    const code = router.query.code;

    const [recipient, setRecipient] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        if (!profile?.id) return;
        if (typeof code !== 'string') return;
        const body: GmailPostBody = { code, userId: profile?.id, recipient, content };
        const res = await nextFetch('gmail', {
            method: 'POST',
            body,
        });
        console.log({ res });
    };

    useEffect(() => {
        const getUrl = async () => {
            const res = await nextFetch('gmail');
            console.log({ res });
            if (res.url) setUrl(res.url);
        };
        getUrl();
    }, []);
    return (
        <div>
            {url && !code && (
                <Button>
                    <a href={url}>authenticate</a>
                </Button>
            )}

            {code && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <label htmlFor="recipient">Email recipient:</label>
                    <br />
                    <input
                        type="text"
                        id="recipient"
                        name="recipient"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="friend@example.com"
                    />
                    <br />

                    <label htmlFor="content">Email content:</label>
                    <br />
                    <input
                        type="text"
                        id="content"
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Hi how are you?"
                    />
                    <br />

                    <Button>SUBMIT</Button>
                </form>
            )}
        </div>
    );
}
