import type { AddDomainResponse, CheckDomainResponse, EngagePostBody } from 'pages/api/engage';
import { useCallback, useEffect, useState } from 'react';
import { Button } from 'src/components/button';
import { Input } from 'src/components/input';
import { useUser } from 'src/hooks/use-user';
import { nextFetch } from 'src/utils/fetcher';

export default function Gmail() {
    const { profile } = useUser();

    const [domain, setDomain] = useState('relay.club');

    const [registerResults, setRegisterResults] = useState<AddDomainResponse['result']>();

    const [status, setStatus] = useState('');

    const [recipient, setRecipient] = useState('');
    const [content, setContent] = useState('');

    //add useEffect to check registered on load

    const handleRegisterDomain = async () => {
        try {
            const body: EngagePostBody = {
                type: 'registerDomain',
                domain,
            };
            const res = await nextFetch<AddDomainResponse>('engage', {
                method: 'POST',
                body,
            });
            console.log({ res });
            if (res.result) {
                setRegisterResults(res.result);
            } else {
                alert('something went wrong');
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleCheckDomain = useCallback(async () => {
        try {
            const body: EngagePostBody = {
                type: 'checkDomain',
                domain,
            };
            const res = await nextFetch<CheckDomainResponse>('engage', {
                method: 'POST',
                body,
            });
            console.log({ res });
            if (res.result[0]?.status === 1 || res.result[0]?.status === 2) {
                setStatus('ok');
            } else {
                setStatus('not ok');
            }
        } catch (error: any) {
            console.error(error);
            // alert(error.message);
        }
    }, [domain]);

    const handleSendEmail = async () => {
        try {
            const body: EngagePostBody = {
                type: 'sendEmail',
                to: [recipient],
                from: profile?.email ?? '',
                body: {
                    subject: 'test',
                    content: { text: content },
                },
            };
            const res = await nextFetch<CheckDomainResponse>('engage', {
                method: 'POST',
                body,
            });
            console.log({ res });
        } catch (error: any) {
            alert(error.message);
        }
    };

    useEffect(() => {
        if (profile?.email) {
            handleCheckDomain();
        }
    }, [handleCheckDomain, profile?.email]);

    return (
        <div>
            {!registerResults && (
                <form>
                    <Input
                        label="Domain"
                        value={domain}
                        onChange={(e) => {
                            setDomain(e.target.value);
                        }}
                    />
                    <Button onClick={handleRegisterDomain}>Get Domain Registry info</Button>
                </form>
            )}
            {registerResults && status !== 'ok' && (
                <div>
                    <h3>Records to add to domain: {registerResults.name}</h3>

                    <h4>SPF</h4>
                    <table>
                        <thead>
                            <th>type</th>
                            <th>Host</th>
                            <th>Value</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td>spf</td>
                                <td>{registerResults.spf.domain}</td>
                                <td>{registerResults.spf.value}</td>
                            </tr>{' '}
                            <tr>
                                <td>dkim</td>
                                <td>{registerResults.dkim.domain}</td>
                                <td>{registerResults.dkim.value}</td>
                            </tr>{' '}
                            <tr>
                                <td>mx</td>
                                <td>{registerResults.dkim.domain}</td>
                                <td>{registerResults.mx.value}</td>
                            </tr>{' '}
                            <tr>
                                <td>dmarc</td>
                                <td>{registerResults.dkim.domain}</td>
                                <td>{registerResults.dmarc.value}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="flex">spf record: {registerResults.spf.domain}</div>
                    <Button onClick={handleCheckDomain}>Check record registration</Button>
                </div>
            )}

            {registerResults && status === 'ok' && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendEmail();
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
