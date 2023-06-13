import { useTranslation } from 'react-i18next';
import screenShot1 from '/public/assets/imgs/screenshots/app-screenshot-1.png';
import screenShot2 from '/public/assets/imgs/screenshots/app-screenshot-2.png';
import screenShot3 from '/public/assets/imgs/screenshots/app-screenshot-3.png';
import Carousel from '../ui/carousel';

export const ScreenshotsCarousel = () => {
    const { t } = useTranslation();

    const screenshots = [
        {
            url: screenShot1.src,
            title: t('signup.carousel.title1'),
            description: t('signup.carousel.description1'),
        },
        {
            url: screenShot2.src,
            title: t('signup.carousel.title2'),
            description: t('signup.carousel.description2'),
        },
        {
            url: screenShot3.src,
            title: t('signup.carousel.title3'),
            description: t('signup.carousel.description3'),
        },
    ];

    return (
        <div className="invisible flex h-screen flex-col items-center justify-center text-white md:visible">
            <Carousel slides={screenshots} autoSlide={false} />
        </div>
    );
};
