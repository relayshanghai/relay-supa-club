import type { MessageType } from './chat';

interface MessageProps {
    message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
    const messageClass =
        message.sender === 'Bot'
            ? 'bg-primary-50 text-primary-700 border border-primary-500 rounded-bl-none'
            : 'ml-auto border border-slate-300 text-slate-600 bg-slate-50 rounded-br-none';

    return (
        <div
            className={`mb-4 inline-block max-w-[85%] whitespace-pre-wrap break-words rounded-lg px-4 py-2 text-sm shadow-md ${messageClass}`}
        >
            {message.content as string | JSX.Element}
        </div>
    );
};

export default Message;
