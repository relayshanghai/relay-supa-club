import { useState } from 'react';
import { Button } from '../button';
import { InputTextArea } from '../textarea';

export const ReplayEditor = () => {
    const [replyMessage, setReplyMessage] = useState<string>('');
    const handleSubmit = () => {
        if (replyMessage === '') {
            return;
        }
        //TODO:send the message
    };
    return (
        <div className="relative">
            <InputTextArea
                label=""
                className="h-36 rounded-md border-gray-200 text-xs"
                placeholder="Reply here.."
                onChange={(e) => {
                    setReplyMessage(e.target.value);
                }}
            />
            <Button className="absolute bottom-2 left-2" type="submit" onChange={handleSubmit}>
                Send
            </Button>
        </div>
    );
};
