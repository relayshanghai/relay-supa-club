import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { EmailContact } from 'src/backend/database/thread/email-entity';
import ThreadReplyAddressSection from './thread-reply-address-section';
import ThreadReplyEditor from './thread-reply-editor';
import { useDriverV2 } from 'src/hooks/use-driver-v2';
import { openThreadReplyGuide } from 'src/guides/inbox.guide';

export default function ThreadReply({
    onReply,
    defaultContacts,
    attachments,
    handleRemoveAttachment,
    handleAttachmentSelect,
    loading,
}: {
    onReply: any;
    defaultContacts: {
        cc: EmailContact[];
        to: EmailContact[];
    };
    attachments: string[];
    handleRemoveAttachment: (file: string) => void;
    handleAttachmentSelect: (files: string[]) => void;
    loading: boolean;
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
    const [replyClicked, setReplyClicked] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setReplyClicked(false);
            }
        };
        document.addEventListener('click', handler, true);
        return () => {
            document.removeEventListener('click', handler, true);
        };
    }, []);

    const { setGuides, startTour, guidesReady } = useDriverV2();

    useEffect(() => {
        setGuides({
            'inbox#threadReply': openThreadReplyGuide,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (guidesReady && replyClicked) {
            startTour('inbox#threadReply');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guidesReady, replyClicked]);

    return (
        <>
            <div
                onClick={() => setReplyClicked(true)}
                onBlur={() => setReplyClicked(false)}
                className={`w-full cursor-text rounded-lg border-2 border-gray-100 px-4 py-2 text-gray-300 ${
                    !replyClicked ? 'block' : 'hidden'
                }`}
            >
                {t('inbox.replyToThread')}
            </div>
            <div
                ref={ref}
                className={`grid grid-cols-1 divide-y ${replyClicked ? 'block' : 'hidden'}`}
                id="inbox-thread-reply-box"
            >
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
                        loading={loading}
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
        </>
    );
}
