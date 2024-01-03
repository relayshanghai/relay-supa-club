import { useCallback, useState } from 'react';
import { Tiptap } from './tiptap';
import { sendReply } from './utils';
import type { EmailContact } from './thread-preview';
import type { KeyboardEvent } from 'react';
import { nanoid } from 'nanoid';

export const ReplyEditor = ({ influencer, onReply }: { influencer: EmailContact; onReply: any }) => {
    const [replyText, setReplyText] = useState('');
    console.log(influencer);
    const [sendTo, setSendTo] = useState<EmailContact[]>([]);
    const [sendCC, setSendCC] = useState<EmailContact[]>([]);

    const handleSendReply = useCallback(() => {
        onReply(replyText);
        setReplyText('');
    }, [replyText, onReply]);

    return (
        <div>
            <AddressSection
                defaultTo={influencer}
                sendTo={sendTo}
                setSendTo={setSendTo}
                sendCC={sendCC}
                setSendCC={setSendCC}
            />
            <Tiptap
                description={replyText}
                onChange={(text: string) => {
                    setReplyText(text);
                }}
                onSubmit={handleSendReply}
            />
        </div>
    );
};

const AddressLabel = ({ info, onClick }: { info: EmailContact; onClick: (info: EmailContact) => void }) => {
    return (
        <span className="flex rounded bg-primary-200 px-2 text-sm font-semibold hover:bg-primary-100">
            {info.name || info.address}({info.address})
            <span className="cursor-pointer pl-2" onClick={() => onClick(info)}>
                x
            </span>
        </span>
    );
};

const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

const AddressSection = ({
    defaultTo,
    sendTo,
    setSendTo,
    sendCC,
    setSendCC,
}: {
    defaultTo?: EmailContact;
    sendTo: EmailContact[];
    setSendTo: (contact: EmailContact[]) => void;
    sendCC: EmailContact[];
    setSendCC: (contact: EmailContact[]) => void;
}) => {
    const [toInput, setToInput] = useState('');
    const [ccInput, setCCInput] = useState('');
    const handleChangeTo = (contact: EmailContact) => {
        if (sendTo.some((contactTo) => contactTo.address === contact.address)) {
            setSendTo(sendTo.filter((contactTo) => contactTo.address !== contact.address));
            return;
        }
        setSendTo([...sendTo, contact]);
    };
    const handleChangeCC = (contact: EmailContact) => {
        if (sendCC.some((contact) => contact.address === contact.address)) {
            setSendCC(sendCC.filter((contact) => contact.address !== contact.address));
            return;
        }
        setSendCC([...sendCC, contact]);
    };
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (toInput === '' || !validateEmail(e.currentTarget.value)) return;
            setToInput('');
            handleChangeTo({
                name: '',
                address: e.currentTarget.value,
            });
        } else if (e.key === 'Backspace') {
            if (toInput === '' && sendTo.length > 0) {
                setSendTo(sendTo.slice(0, sendTo.length - 1));
            }
        }
    };
    return (
        <section className="flex flex-col">
            <div className="flex items-center gap-2">
                To:{' '}
                {defaultTo && (
                    <AddressLabel
                        key={defaultTo.address}
                        onClick={() => {
                            handleChangeTo(defaultTo);
                        }}
                        info={defaultTo}
                    />
                )}
                {sendTo.map((contact) => (
                    <AddressLabel
                        key={contact.address}
                        onClick={() => {
                            handleChangeTo(contact);
                        }}
                        info={contact}
                    />
                ))}{' '}
                <input
                    onKeyDown={handleKeyDown}
                    value={toInput}
                    onChange={(e) => setToInput(e.currentTarget.value)}
                    className="w-full rounded border-none bg-gray-50 focus-visible:outline-none"
                />
            </div>
            <div className="flex items-center gap-2">
                Cc:{' '}
                {sendCC.map((contact) => (
                    <AddressLabel
                        key={contact.address}
                        onClick={() => {
                            handleChangeCC(contact);
                        }}
                        info={contact}
                    />
                ))}{' '}
                <input
                    onKeyDown={handleKeyDown}
                    value={ccInput}
                    onChange={(e) => setCCInput(e.currentTarget.value)}
                    className="w-full rounded border-none bg-gray-50 focus-visible:outline-none"
                />
            </div>
        </section>
    );
};
