import { useState } from 'react';
import { Tiptap } from './tiptap';
import { sendReply } from './utils';

export const ReplyEditor = () => {
    const [replyText, setReplyText] = useState('');

    const handleSendReply = () => {
        // send reply using backend
        sendReply({
            replyBody: replyText,
            account: '',
        });
        setReplyText('');
    };

    return (
        <div>
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
