import { useTranslation } from 'react-i18next';
import Carousel from '../ui/carousel';
import { screenshots } from 'public/assets/imgs/screenshots';

export const ScreenshotsCarousel = () => {
    const { t } = useTranslation();
    const { boostBot } = screenshots;

    const slides = [
        {
            url: boostBot,
            title: t('signup.carousel.title1'),
            description: t('signup.carousel.description1'),
        },
    ];

    return (
        <div className="invisible flex h-screen max-h-[870px] flex-col items-center justify-center text-white md:visible">
            <Carousel slides={slides} autoSlide={true} />
        </div>
    );
};
