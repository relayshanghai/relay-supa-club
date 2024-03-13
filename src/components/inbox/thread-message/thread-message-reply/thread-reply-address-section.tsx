import { type KeyboardEvent, useCallback, useState } from 'react';
import type { EmailContact } from 'src/backend/database/thread/email-entity';
import ThreadReplyAddressLabel from './thread-reply-address-label';

const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};
export default function ThreadReplyAddressSection({
    defaultTo,
    defaultCC,
    sendTo,
    setSendTo,
    sendCC,
    setSendCC,
}: {
    defaultTo?: EmailContact[] | null;
    defaultCC?: EmailContact[] | null;
    sendTo: EmailContact[];
    setSendTo: (contact: EmailContact[]) => void;
    sendCC: EmailContact[];
    setSendCC: (contact: EmailContact[]) => void;
}) {
    const [toInput, setToInput] = useState('');
    const [ccInput, setCCInput] = useState('');

    const handleChangeTo = useCallback(
        (contact: EmailContact) => {
            if (sendTo.some((contactTo) => contactTo.address === contact.address)) {
                setSendTo(sendTo.filter((contactTo) => contactTo.address !== contact.address));
                return;
            }
            setSendTo([...sendTo, contact]);
        },
        [sendTo, setSendTo],
    );
    const handleChangeCC = useCallback(
        (contact: EmailContact) => {
            if (sendCC.some((contactCC) => contactCC.address === contact.address)) {
                setSendCC(sendCC.filter((contactCC) => contactCC.address !== contact.address));
                return;
            }
            setSendCC([...sendCC, contact]);
        },
        [sendCC, setSendCC],
    );
    const handleKeyDownTo = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (toInput === '' || !validateEmail(e.currentTarget.value)) return;
            setToInput('');
            handleChangeTo({
                name: e.currentTarget.value,
                address: e.currentTarget.value,
            });
        } else if (e.key === 'Backspace') {
            if (toInput === '' && sendTo.length > 0) {
                setSendTo(sendTo.slice(0, sendTo.length - 1));
            }
        }
    };
    const handleKeyDownCC = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (ccInput === '' || !validateEmail(e.currentTarget.value)) return;
            setCCInput('');
            handleChangeCC({
                name: e.currentTarget.value,
                address: e.currentTarget.value,
            });
        } else if (e.key === 'Backspace') {
            if (ccInput === '' && sendCC.length > 0) {
                setSendCC(sendCC.slice(0, sendCC.length - 1));
            }
        }
    };
    return (
        <section className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
                To:
                {defaultTo &&
                    defaultTo.length > 0 &&
                    defaultTo.map((to) => (
                        <ThreadReplyAddressLabel
                            key={to.address}
                            onClick={() => {
                                handleChangeTo(to);
                            }}
                            defaultAddress
                            info={to}
                        />
                    ))}
                {sendTo.map((contact) => (
                    <ThreadReplyAddressLabel
                        key={contact.address}
                        onClick={() => {
                            handleChangeTo(contact);
                        }}
                        info={contact}
                    />
                ))}
                <input
                    onKeyDown={handleKeyDownTo}
                    value={toInput}
                    onChange={(e) => setToInput(e.currentTarget.value)}
                    className="rounded border-none bg-white focus-visible:outline-none"
                />
            </div>
            <div className="flex flex-wrap items-center gap-2">
                Cc:
                {defaultCC &&
                    defaultCC.map((contact) => (
                        <ThreadReplyAddressLabel
                            key={contact.address}
                            onClick={() => {
                                handleChangeCC(contact);
                            }}
                            defaultAddress
                            info={contact}
                        />
                    ))}
                {sendCC.map((contact) => (
                    <ThreadReplyAddressLabel
                        key={contact.address}
                        onClick={() => {
                            handleChangeCC(contact);
                        }}
                        info={contact}
                    />
                ))}
                <input
                    onKeyDown={handleKeyDownCC}
                    value={ccInput}
                    onChange={(e) => setCCInput(e.currentTarget.value)}
                    className="rounded border-none bg-white focus-visible:outline-none"
                />
            </div>
        </section>
    );
}
