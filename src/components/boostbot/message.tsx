import Link from 'next/link';
import { Trans } from 'react-i18next';
import { VideoPreviewWithModal } from 'src/components/video-preview-with-modal';
import type { ProgressType } from 'src/components/boostbot/chat-progress';
import ChatProgress from './chat-progress';

type TranslationMessage = {
    type: 'translation';
    translationKey: string;
    translationLink?: string;
    translationValues?: Record<string, string | number>;
};

type ProgressMessage = {
    type: 'progress';
    sender: 'Neutral';
    progressData: ProgressType;
};

type VideoMessage = {
    type: 'video';
    sender: 'Bot';
    videoUrl: string;
    eventToTrack: string;
};

type TextMessage = {
    type: 'text';
    text: string;
};

export type MessageType = {
    sender: 'User' | 'Bot' | 'Neutral';
} & (TranslationMessage | ProgressMessage | VideoMessage | TextMessage);

const Translation = ({ translationKey, translationLink, translationValues }: TranslationMessage) => (
    <Trans
        i18nKey={translationKey}
        components={
            translationLink
                ? { customLink: <Link target="_blank" className="font-medium underline" href={translationLink} /> }
                : undefined
        }
        values={translationValues}
    />
);

const Video = ({ videoUrl = '', eventToTrack = '' }: VideoMessage) => (
    <VideoPreviewWithModal eventToTrack={eventToTrack} videoUrl={videoUrl} />
);

const Progress = ({ progressData }: ProgressMessage) => <ChatProgress progress={progressData} />;

const Text = ({ text }: TextMessage) => <>{text}</>;

interface MessageProps {
    message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
    const { type, sender } = message;
    const defaultMessageClasses =
        'mb-4 inline-block max-w-[85%] whitespace-pre-wrap break-words rounded-lg px-4 py-2 text-sm shadow-md';
    const messageClasses = {
        User: `${defaultMessageClasses} ml-auto border border-slate-300 text-slate-600 bg-slate-50 rounded-br-none`,
        Bot: `${defaultMessageClasses} bg-primary-50 text-primary-700 border border-primary-500 rounded-bl-none`,
        Neutral: 'my-2',
    };
    const messageClass = messageClasses[sender];

    let Content: React.ReactNode = null;
    if (type === 'translation') {
        Content = <Translation {...message} />;
    } else if (type === 'video') {
        Content = <Video {...message} />;
    } else if (type === 'progress') {
        Content = <Progress {...message} />;
    } else if (type === 'text') {
        Content = <Text {...message} />;
    }

    return <div className={messageClass}>{Content}</div>;
};

export default Message;
