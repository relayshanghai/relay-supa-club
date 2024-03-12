import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import type { EmailContact } from "src/backend/database/thread/email-entity";
import ThreadReplyAddressSection from "./thread-reply-address-section";
import ThreadReplyEditor from "./thread-reply-editor";

export default function ThreadReply ({
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
    attachments: string[];
    handleRemoveAttachment: (file: string) => void;
    handleAttachmentSelect: (files: string[]) => void;
}) {
    const [replyText, setReplyText] = useState('');
    const [sendTo, setSendTo] = useState<EmailContact[]>([]);
    const [sendCC, setSendCC] = useState<EmailContact[]>([]);
    const { t } = useTranslation();
    const handleSendReply = useCallback(() => {
        onReply(replyText, [...sendTo, ...defaultContacts.to], [...sendCC, ...defaultContacts.cc]);
        setReplyText('');
    }, [replyText, onReply, sendTo, sendCC, defaultContacts]);
    const getNameOrAddressContact = (contact: EmailContact, postfix = '') =>
        `${contact.name ?? contact.address}${postfix}`;
    const replyCaption = () => {
        const defaultTo = defaultContacts.to.map((contact) => getNameOrAddressContact(contact));
        const defaultCC = defaultContacts.cc.map((contact) => getNameOrAddressContact(contact, '(CC)'));
        const to = sendTo.map((contact) => getNameOrAddressContact(contact));
        const cc = sendCC.map((contact) => getNameOrAddressContact(contact, '(CC)'));
        return `${t('inbox.replyAllTo')} to ${[...defaultTo, ...defaultCC, ...to, ...cc].join(', ')}`;
    };
    return (
        <div className="grid grid-cols-1 divide-y">
            <div className="p-2">
                <ThreadReplyAddressSection
                    defaultTo={defaultContacts.to}
                    defaultCC={defaultContacts.cc}
                    sendTo={sendTo}
                    setSendTo={setSendTo}
                    sendCC={sendCC}
                    setSendCC={setSendCC}
                />
            </div>
            <div className="p-2">
                <ThreadReplyEditor
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
