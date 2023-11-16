import Link from 'next/link';
import { Trans, useTranslation } from 'react-i18next';
import { VideoPreviewWithModal } from 'src/components/video-preview-with-modal';
import type { ProgressType } from 'src/components/boostbot/chat-progress';
import ChatProgress from './chat-progress';
import { countries } from 'src/utils/api/iqdata/dictionaries/geolocations';
import { translateGeolocations } from 'src/utils/api/iqdata/dictionaries/helpers';
import type { AudienceGeo } from 'types/iqdata/influencer-search-request-body';

type TranslationMessage = {
    type: 'translation';
    translationKey: string;
    translationLink?: string;
    // Dynamic values to be inserted into the translation string, such as {{ count }}.
    translationValues?: Record<string, string | number>;
    // Some dynamic values, such as {{ geolocations }, need to be translated as they get inserted into translation strings. A translation within a translation. Since they will be uncommon and require specific types, we explicitly list them here.
    translationValuesToTranslate?: {
        geolocations: AudienceGeo[];
    };
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

const Translation = ({
    translationKey,
    translationLink,
    translationValues,
    translationValuesToTranslate,
}: TranslationMessage) => {
    const { t } = useTranslation();

    const translatedValues = {
        ...translationValues,
        ...(translationValuesToTranslate
            ? {
                  geolocations: translateGeolocations({
                      t,
                      countries,
                      geolocations: translationValuesToTranslate.geolocations,
                  }),
              }
            : {}),
    };

    return (
        <Trans
            i18nKey={translationKey}
            components={
                translationLink
                    ? {
                          customLink: <Link target="_blank" className="font-medium underline" href={translationLink} />,
                      }
                    : undefined
            }
            values={translatedValues}
        />
    );
};

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
        'inline-block  whitespace-pre-wrap break-words rounded-[6px] px-3 py-3 text-sm shadow-md text-sm font-semibold';
    const messageClasses = {
        User: `${defaultMessageClasses} border border-primary-600 text-white-600 bg-primary-600 `,
        Bot: `${defaultMessageClasses} bg-white font-semibold rounded-[4px] text-primary-600 w-full `,
        Neutral: 'my-2.5 font-semibold text-primary-600 ',
    };
    const user = {
        User: 'You',
        Bot: 'BoostBot',
        Neutral: '',
    };
    const userClasses = {
        User: 'text-right text-primary-600 mt-2.5',
        Bot: 'text-left text-primary-400 mt-2.5',
        Neutral: '',
    };
    const alignmentClass = {
        User: 'ml-auto p-0 mb-2.5 text-white mr-0 max-w-[85%]',
        Bot: ' p-0 mb-4 inline-block max-w-[85%]',
        Neutral: '',
    };
    const borderClass = {
        User: '',
        Bot: 'bg-boostbotbackground p-[1px] rounded-[6px]',
        Neutral: '',
    };
    const messageClass = messageClasses[sender];
    const userType = user[sender];
    const userClass = userClasses[sender];
    const alignment = alignmentClass[sender];
    const border = borderClass[sender];

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

    return (
        <div className={alignment}>
            <div className={border}>
                <div className={messageClass}>{Content}</div>
            </div>
            <div className={userClass}>
                <p className="text-xs font-semibold">{userType}</p>
            </div>
        </div>
    );
};

export default Message;
