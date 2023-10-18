import { useTranslation } from 'react-i18next';
import guidePage from 'i18n/en/guide';
import {
    Compass,
    Account,
    ArrowRight,
    ProfilePlus,
    Send,
    Brackets,
    Engagements,
    User,
    BoostbotSelected,
} from '../icons';
import { GuideModal } from './guideModal';
import { useState } from 'react';
import Image from 'next/image';
import { useRudderstack, useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { GUIDE_PAGE } from 'src/utils/rudderstack/event-names';
import { OpenGuideSectionModal } from 'src/utils/analytics/events/guide/open-guide-section-modal';
import { PlayTutorialVideo } from 'src/utils/analytics/events';

const featVideo = true;
export type GuideCardKey = keyof typeof guidePage.cards;

export const GuideCards = ({ cardKey }: { cardKey: GuideCardKey }) => {
    const { t } = useTranslation();
    const [guideShow, setGuideShow] = useState<boolean>(false);
    const { track } = useRudderstackTrack();

    const handleGuideModal = () => {
        track(OpenGuideSectionModal, {
            section: cardKey,
            $add: {
                user_open_count: 1,
            },
        });
        setGuideShow((prev) => !prev);
    };
    return (
        <div className="m-1 my-6 flex w-screen flex-col items-center gap-5 text-center md:w-auto md:basis-1/2 lg:basis-1/3 2xl:basis-1/4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100">
                    {cardKey === 'discover' && (
                        <Compass height={24} width={24} className="stroke-primary-500" color="#8B5CF6" />
                    )}
                    {cardKey === 'account' && <Account height={24} width={24} className="stroke-primary-500" />}
                    {cardKey === 'sequences' && <Send height={24} width={24} className="-mr-2 stroke-primary-500" />}
                    {cardKey === 'templates' && <Brackets height={24} width={24} className="stroke-primary-500" />}
                    {cardKey === 'inbox' && <Engagements height={24} width={24} className="stroke-primary-500" />}
                    {cardKey === 'influencerManager' && (
                        <ProfilePlus height={24} width={24} className="stroke-primary-500" />
                    )}
                    {cardKey === 'influencerProfile' && <User height={24} width={24} className="stroke-primary-500" />}{' '}
                    {cardKey === 'boostbot' && (
                        <BoostbotSelected height={24} width={24} className="stroke-primary-500" />
                    )}
                </div>
            </div>
            <p className="break-words text-xl font-semibold text-gray-800">{t(`guidePage.cards.${cardKey}.title`)}</p>
            <p className="break-words text-gray-600">{t(`guidePage.cards.${cardKey}.description`)}</p>
            <p
                data-testid={`guide-modal-${cardKey}`}
                className="flex cursor-pointer flex-row items-center gap-2 font-medium text-primary-700"
                onClick={handleGuideModal}
            >
                {t('guidePage.learnMore')} <ArrowRight className="stroke-primary-700" height={18} width={18} />
            </p>
            <GuideModal section={cardKey} show={guideShow} setShow={setGuideShow} />
        </div>
    );
};

export const GuideComponent = () => {
    const { t } = useTranslation();
    const { trackEvent } = useRudderstack();
    const { track } = useRudderstackTrack();

    return (
        <div onLoad={() => trackEvent(GUIDE_PAGE('opened'))} className="m-10 flex flex-col items-center gap-6">
            <div className="flex flex-col gap-2 text-center">
                <p className="text-4xl font-bold text-gray-800">
                    {t('guidePage.welcome')} relay<span className="text-[#6B65AD]">.</span>club
                </p>
                <p className="text-base text-gray-500">{t('guidePage.welcomeDescription')}</p>
            </div>
            {featVideo ? (
                <video
                    muted={false}
                    controls={true}
                    onPlay={(e) => {
                        track(PlayTutorialVideo, {
                            video: 'Main Demo',
                            $add: { user_play_count: 1 },
                        });
                        trackEvent(GUIDE_PAGE('tutorial video played'), {
                            timestamp: (e.target as HTMLMediaElement).currentTime,
                        });
                    }}
                    onPause={(e) => {
                        trackEvent(GUIDE_PAGE('tutorial video paused'), {
                            timestamp: (e.target as HTMLMediaElement).currentTime,
                        });
                    }}
                    onEnded={() => {
                        trackEvent(GUIDE_PAGE('tutorial video ended'));
                    }}
                    onSeeked={(e) => {
                        trackEvent(GUIDE_PAGE('tutorial video seeked'), {
                            timestamp: (e.target as HTMLMediaElement).currentTime,
                        });
                    }}
                    className="rounded-3xl shadow-lg sm:w-11/12 md:w-5/6 lg:w-1/2"
                >
                    <source src="/assets/videos/demo.mp4" />
                </video>
            ) : (
                <div className="rounded-3xl shadow-lg sm:w-11/12 md:w-5/6 lg:w-1/2">
                    <Image
                        src="/assets/imgs/placeholders/dashboard-current.png"
                        alt="Description of the image"
                        width={1200}
                        height={800}
                    />
                </div>
            )}
            <div className="flex w-full flex-row flex-wrap justify-center md:justify-evenly md:gap-4 md:gap-y-8">
                {Object.keys(guidePage.cards).map((card, index: number) => {
                    return <GuideCards key={index} cardKey={card as GuideCardKey} />;
                })}
            </div>
        </div>
    );
};
