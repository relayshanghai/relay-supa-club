import type { MessageType } from './chat';

interface MessageProps {
    message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
    const messageClass =
        message.sender === 'Bot'
            ? 'mr-6 bg-primary-50 text-primary-700 border border-primary-500 rounded-bl-none'
            : 'ml-6 border border-slate-300 text-slate-600 bg-slate-50 rounded-br-none';

    return (
        <div className={`mb-4 break-words rounded-lg px-4 py-2 text-sm shadow-md ${messageClass}`}>
            {message.content}
        </div>
    );
};

export default Message;
