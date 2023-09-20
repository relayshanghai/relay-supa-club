import Link from 'next/link';
import { Trans } from 'react-i18next';
import { VideoPreviewWithModal } from 'src/components/video-preview-with-modal';
import type { ProgressType } from 'src/components/boostbot/chat-progress';
import ChatProgress from './chat-progress';

type MessageContent = {
    contentKey?: string;
    contentData?: object;
    contentString?: string;
};

export type MessageType = {
    sender: 'User' | 'Bot' | 'Progress';
    type: 'translation' | 'video' | 'progress' | 'text';
} & MessageContent;

interface MessageProps {
    message: MessageType;
}

const Translation = ({ contentKey, contentString, contentData }: MessageContent) => (
    <Trans
        i18nKey={contentKey}
        components={
            contentString
                ? { customLink: <Link target="_blank" className="font-medium underline" href={contentString} /> }
                : undefined
        }
        values={contentData}
    />
);

const Video = ({ contentKey = '', contentString = '' }: MessageContent) => (
    <VideoPreviewWithModal eventToTrack={contentString} videoUrl={contentKey} />
);

const Progress = ({ contentData }: MessageContent) => <ChatProgress progress={contentData as ProgressType} />;

const Text = ({ contentString }: MessageContent) => <>{contentString}</>;

const ContentTypes = {
    translation: Translation,
    video: Video,
    progress: Progress,
    text: Text,
};

const Message: React.FC<MessageProps> = ({ message }) => {
    const { type, sender, ...contentProps } = message;
    const Content = ContentTypes[type];

    const defaultMessageClasses =
        'mb-4 inline-block max-w-[85%] whitespace-pre-wrap break-words rounded-lg px-4 py-2 text-sm shadow-md';
    const messageClasses = {
        User: `${defaultMessageClasses} ml-auto border border-slate-300 text-slate-600 bg-slate-50 rounded-br-none`,
        Bot: `${defaultMessageClasses} bg-primary-50 text-primary-700 border border-primary-500 rounded-bl-none`,
        Progress: 'my-2',
    };
    const messageClass = messageClasses[sender];

    return (
        <div className={messageClass}>
            <Content {...contentProps} />
        </div>
    );
};

export default Message;
