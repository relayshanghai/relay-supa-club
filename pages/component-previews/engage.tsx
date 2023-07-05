/* eslint-disable no-console */
import type { AddDomainResponse, CheckDomainResponse, EngagePostBody } from 'pages/api/engage';
import { useCallback, useEffect, useState } from 'react';
import { Button } from 'src/components/button';
import { Input } from 'src/components/input';
import { useUser } from 'src/hooks/use-user';
import { nextFetch } from 'src/utils/fetcher';

export default function Gmail() {
    const { profile } = useUser();

    const [domain, setDomain] = useState('relayclub.cn');

    const [registerResults, setRegisterResults] = useState<AddDomainResponse['result']>();

    const [status, setStatus] = useState(0);
    const [checkingStatus, setCheckingStatus] = useState(false);
    const [recordsStatus, setRecordsStatus] = useState<CheckDomainResponse['result'][0]>();

    const [sender, setSender] = useState('');
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
            console.error(error);
            // alert(error.message);
        }
    };

    const handleCheckDomain = useCallback(async () => {
        setCheckingStatus(true);
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
            if (res.result[0]) {
                setRecordsStatus(res.result[0]);
            }
            if (res.result[0]?.status === 1 || res.result[0]?.status === 2) {
                setStatus(res.result[0]?.status);
            } else {
                setStatus(0);
            }
        } catch (error: any) {
            console.error(error);
            // alert(error.message);
        }
        setCheckingStatus(false);
    }, [domain]);

    const handleSendEmail = async () => {
        try {
            if (!recipient || !content) {
                alert('please fill in all fields');
                return;
            }
            if (sender && sender.split('@')[1] !== domain) {
                alert('sender must be from the domain');
                return;
            }
            const body: EngagePostBody = {
                type: 'sendEmail',
                to: [recipient],
                from: sender ? sender : 'testuser@' + domain,
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
            // handleCheckDomain();
        }
    }, [handleCheckDomain, profile?.email]);

    return (
        <div className="flex flex-col space-x-4 space-y-4">
            <form
                className="flex w-fit flex-col space-x-4 space-y-4 p-10"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleRegisterDomain();
                }}
            >
                <Input
                    label="Domain"
                    value={domain}
                    onChange={(e) => {
                        setDomain(e.target.value);
                    }}
                />
                <Button>Get Domain Registry info</Button>
            </form>

            {registerResults && (
                <div className="flex w-fit flex-col space-x-4 space-y-4">
                    <h3>Add these records to your domain: {registerResults.name}</h3>

                    <table className="max-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <td className="px-4 py-2">Name</td>
                                <td className="px-4 py-2">Type</td>
                                <td className="px-4 py-2">Host</td>
                                <td className="px-4 py-2">Value</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2">spf</td>
                                <td className="border px-4 py-2">TXT</td>
                                <td className="border px-4 py-2">{registerResults.spf.domain}</td>
                                <td className="border px-4 py-2">{registerResults.spf.value}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">dkim</td>
                                <td className="border px-4 py-2">TXT</td>
                                <td className="border px-4 py-2">{registerResults.dkim.domain}</td>
                                <td className="max-w-xl overflow-scroll border px-4 py-2">
                                    {registerResults.dkim.value}
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">mx</td>
                                <td className="border px-4 py-2">MX</td>
                                <td className="border px-4 py-2">{registerResults.mx.domain}</td>
                                <td className="border px-4 py-2">{registerResults.mx.value}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">dmarc</td>
                                <td className="border px-4 py-2">TXT</td>
                                <td className="border px-4 py-2">{registerResults.dmarc.domain}</td>
                                <td className="border px-4 py-2">{registerResults.dmarc.value}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
            {registerResults && (
                // 0:unverified 1:usable 2:Verified\
                <div className="mt-5 flex w-fit flex-col space-x-2 space-y-2 p-10">
                    <Button disabled={checkingStatus} onClick={handleCheckDomain}>
                        Check record registration
                    </Button>
                    <p>registration status: {status === 0 ? 'unverified' : status === 1 ? 'usable' : 'verified'} </p>
                    {recordsStatus && (
                        <div className="flex flex-col space-y-2">
                            <p>SPF: {recordsStatus.config.spf ? 'ok' : 'not ok'}</p>
                            <p>DKIM: {recordsStatus.config.dkim ? 'ok' : 'not ok'}</p>
                            <p>MX: {recordsStatus.config.mx ? 'ok' : 'not ok'}</p>
                            <p>DMARC: {recordsStatus.config.dmarc ? 'ok' : 'not ok'}</p>
                        </div>
                    )}
                </div>
            )}

            {registerResults && status !== 0 && (
                <form
                    className="flex flex-col space-x-4 space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendEmail();
                    }}
                >
                    <label htmlFor="recipient">Email recipient:</label>

                    <input
                        type="text"
                        id="sender"
                        name="sender"
                        value={sender}
                        onChange={(e) => setSender(e.target.value)}
                        placeholder="Default will be testuser@your.domain"
                    />

                    <input
                        type="text"
                        id="recipient"
                        name="recipient"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="friend@example.com"
                    />

                    <label htmlFor="content">Email content:</label>

                    <input
                        type="text"
                        id="content"
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Hi how are you?"
                    />

                    <Button>SUBMIT</Button>
                </form>
            )}
        </div>
    );
}
