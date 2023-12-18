import { useState } from 'react';
import { Tiptap } from './tiptap';

export const ReplyEditor = () => {
    const [replyText, setReplyText] = useState('');
    return (
        <div>
            <Tiptap
                description={replyText}
                onChange={(text: string) => {
                    setReplyText(text);
                }}
            />
        </div>
    );
};
