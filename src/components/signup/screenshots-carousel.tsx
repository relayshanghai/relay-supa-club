import { useTranslation } from 'react-i18next';
import Carousel from '../ui/carousel';
import { screenshots } from 'public/assets/imgs/screenshots';

export const ScreenshotsCarousel = () => {
    const { t, i18n } = useTranslation();
    const {
        campaignsPageCn,
        campaignsPageEn,
        discoverPageCn,
        discoverPageEn,
        filtersPageCn,
        filtersPageEn,
        performancePageCn,
        performancePageEn,
    } = screenshots;

    const slides = [
        {
            url: i18n.language.includes('en') ? discoverPageEn : discoverPageCn,
            title: t('signup.carousel.title1'),
            description: t('signup.carousel.description1'),
        },
        {
            url: i18n.language.includes('en') ? filtersPageEn : filtersPageCn,
            title: t('signup.carousel.title2'),
            description: t('signup.carousel.description2'),
        },
        {
            url: i18n.language.includes('en') ? campaignsPageEn : campaignsPageCn,
            title: t('signup.carousel.title3'),
            description: t('signup.carousel.description3'),
        },
        {
            url: i18n.language.includes('en') ? performancePageEn : performancePageCn,
            title: t('signup.carousel.title4'),
            description: t('signup.carousel.description4'),
        },
    ];

    return (
        <div className="invisible flex h-screen max-h-[870px] flex-col items-center justify-center text-white md:visible">
            <Carousel slides={slides} autoSlide={true} />
        </div>
    );
};
