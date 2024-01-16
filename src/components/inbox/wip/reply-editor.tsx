import { useCallback, useState } from 'react';
import { Tiptap } from './tiptap';
import type { AttachmentFile, EmailContact } from 'src/utils/outreach/types';
import type { KeyboardEvent } from 'react';
import { Tooltip } from 'src/components/library';
import { nanoid } from 'nanoid';

export const ReplyEditor = ({
    onReply,
    defaultContacts,
    attachments,
    handleRemoveAttachment,
    handleAttachmentSelect,
}: {
    onReply: any;
    defaultContacts: {
        cc: EmailContact[];
        to: EmailContact[];
    };
    attachments: AttachmentFile[] | null;
    handleRemoveAttachment: (file: AttachmentFile) => void;
    handleAttachmentSelect: (files: AttachmentFile[] | null, error?: any) => void;
}) => {
    const [replyText, setReplyText] = useState('');
    const [sendTo, setSendTo] = useState<EmailContact[]>([]);
    const [sendCC, setSendCC] = useState<EmailContact[]>([]);

    const handleSendReply = useCallback(() => {
        onReply(replyText, [...sendTo, ...defaultContacts.to], [...sendCC, ...defaultContacts.cc]);
        setReplyText('');
    }, [replyText, onReply, sendTo, sendCC, defaultContacts]);
    const getNameOrAddressContact = (contact: EmailContact) => contact.name || contact.address;
    const replyCaption = () => {
        const to = sendTo.map(getNameOrAddressContact);
        const cc = sendCC.map(getNameOrAddressContact);
        return `Reply all to ${to.join(', ')}${cc.length > 0 ? `, ${cc.map((r) => `${r} (CC)`).join(', ')}` : ''}`;
    };
    return (
        <div className="grid grid-cols-1 divide-y">
            <div className="p-2">
                <AddressSection
                    defaultTo={defaultContacts.to}
                    defaultCC={defaultContacts.cc}
                    sendTo={sendTo}
                    setSendTo={setSendTo}
                    sendCC={sendCC}
                    setSendCC={setSendCC}
                />
            </div>
            <div className="p-2">
                <Tiptap
                    description={replyText}
                    onChange={(text: string) => {
                        setReplyText(text);
                    }}
                    placeholder={replyCaption()}
                    onSubmit={handleSendReply}
                    attachments={attachments}
                    handleRemoveAttachment={handleRemoveAttachment}
                    handleAttachmentSelect={handleAttachmentSelect}
                />
            </div>
        </div>
    );
};

const AddressLabel = ({
    info,
    onClick,
    defaultAddress,
}: {
    info: EmailContact;
    onClick: (info: EmailContact) => void;
    defaultAddress?: boolean;
}) => {
    const truncatedText = (text: string, maxLength: number) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };
    return (
        <Tooltip delay={500} content={`${info.name}: ${info.address}`}>
            <span className="flex rounded bg-primary-200 px-2 py-1 text-sm font-semibold text-primary-500 hover:bg-primary-100">
                <p className="max-w-8 overflow-hidden whitespace-break-spaces">
                    {truncatedText(info.name || info.address, 15)}
                </p>
                {!defaultAddress && (
                    <span className="cursor-pointer pl-2" onClick={() => onClick(info)}>
                        x
                    </span>
                )}
            </span>
        </Tooltip>
    );
};

const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

export const SingleAddressSection = ({
    sendTo,
    setSendTo,
}: {
    sendTo: EmailContact[];
    setSendTo: (contact: EmailContact[]) => void;
}) => {
    const [toInput, setToInput] = useState('');
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

    return (
        <section className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
                To:
                {sendTo.map((contact) => (
                    <AddressLabel
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
        </section>
    );
};

const AddressSection = ({
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
}) => {
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
                        <AddressLabel
                            key={nanoid()}
                            onClick={() => {
                                handleChangeTo(to);
                            }}
                            defaultAddress
                            info={to}
                        />
                    ))}
                {sendTo.map((contact) => (
                    <AddressLabel
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
                        <AddressLabel
                            key={nanoid()}
                            onClick={() => {
                                handleChangeCC(contact);
                            }}
                            defaultAddress
                            info={contact}
                        />
                    ))}
                {sendCC.map((contact) => (
                    <AddressLabel
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
};
