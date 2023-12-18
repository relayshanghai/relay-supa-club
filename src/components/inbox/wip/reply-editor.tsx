import { useState } from 'react';
import { Tiptap } from './tiptap';

export const ReplyEditor = () => {
    const [replyText, setReplyText] = useState('');

    const handleSendReply = () => {
        // send reply using backend
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
