import screenShot1 from '/public/assets/imgs/screenshots/app-screenshot-1.png';
import screenShot2 from '/public/assets/imgs/screenshots/app-screenshot-2.png';
import Carousel from '../ui/carousel';

export const ScreenshotsCarousel = () => {
    const screenshots = [
        {
            url: screenShot1.src,
            title: 'Discover',
            description: 'Find the perfect influencer without all the hassle',
        },
        {
            url: screenShot2.src,
            title: 'Hello',
            description: 'Find the perfect influencer without all the hassle nonono',
        },
    ];

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center text-white">
            <Carousel slides={screenshots} autoSlide={false} />
        </div>
    );
};
