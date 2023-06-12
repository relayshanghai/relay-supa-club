import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import guidePage from 'i18n/en/guide';
import { Compass, FourSquare, Account, PieChart, Guide, EmailOutline, ArrowRight } from '../icons';
import { Button } from '../button';
import { GuideModal } from './guideModal';
import { useState } from 'react';

export const GuideCards = ({ cardName }: { cardName: string }) => {
    const { t } = useTranslation();
    const [guideShow, setGuideShow] = useState<boolean>(false);

    const handleGuideModal = () => {
        setGuideShow((prev) => !prev);
    };
    return (
        <div className="m-1 my-6 flex basis-1/4 flex-col items-center gap-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100">
                    {cardName === 'discover' && <Compass height={24} width={24} className="stroke-primary-500" />}

                    {cardName === 'campaigns' && <FourSquare height={24} width={24} className="stroke-primary-500" />}

                    {cardName === 'aiEmailGenerator' && (
                        <EmailOutline height={24} width={24} className="stroke-primary-500" />
                    )}

                    {cardName === 'account' && <Account height={24} width={24} className="stroke-primary-500" />}

                    {cardName === 'performance' && <PieChart height={24} width={24} className="stroke-primary-500" />}

                    {cardName === 'guide' && <Guide height={24} width={24} className="stroke-primary-500" />}
                </div>
            </div>
            <p className="break-words">{t(`guidePage.cards.${cardName}.title`)}</p>
            <p className="break-words">{t(`guidePage.cards.${cardName}.description`)}</p>
            <Button className="flex flex-row gap-3" onClick={handleGuideModal}>
                Learn more <ArrowRight className="stroke-white" height={18} width={18} />
            </Button>
            <GuideModal section={cardName} show={guideShow} setShow={setGuideShow} />
        </div>
    );
};

export const GuideComponent = () => {
    const { t } = useTranslation();

    return (
        <div className="m-10 flex flex-col items-center gap-6">
            <div className="flex flex-col gap-2 text-center">
                <p className="text-4xl font-bold text-black">
                    {t('guidePage.welcome')} relay<span className="text-violet-500">.</span>club
                </p>
                <p className="text-base text-gray-500">{t('guidePage.welcomeDescription')}</p>
            </div>
            <div className="w-1/2 rounded-3xl shadow-lg">
                <Image
                    src="/assets/imgs/placeholders/dashboard-current.png"
                    alt="Description of the image"
                    layout="responsive"
                    width={1200}
                    height={800}
                />
            </div>
            <div className="flex flex-row flex-wrap justify-evenly">
                {Object.keys(guidePage.cards).map((name: string, index: number) => {
                    return <GuideCards key={index} cardName={name} />;
                })}
            </div>
        </div>
    );
};
